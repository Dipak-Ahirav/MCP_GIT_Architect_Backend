import {
  RunState,
  Runner,
} from "@openai/agents";

import {
  githubWriteAgent,
} from "../agents/githubWrite.agent.js";

import {
  getSessionRecord,
  getSessionRepository,
} from "./session.service.js";

import {
  createPendingApproval,
  failPendingApproval,
  getPendingApproval,
  updatePendingApproval,
  completePendingApproval,
  rejectPendingApproval
} from "./github-approval.service.js";

import type {
  GitHubWriteContext,
} from "../types/github-write-context.js";

const runner =
  new Runner();

const parseArguments =
  (
    args?: string,
  ) => {
    if (!args) {
      return {};
    }

    try {
      return JSON.parse(
        args,
      );
    } catch {
      return {
        raw:
          args,
      };
    }
  };

const mapInterruptions =
  (
    interruptions:
      ReturnType<
        RunState<any, any>[
          "getInterruptions"
        ]
      >,
  ) => {
    return interruptions.map(
      (
        interruption,
        index,
      ) => ({
        actionIndex:
          index,

        tool:
          interruption.name ??
          "unknown",

        arguments:
          parseArguments(
            interruption.arguments,
          ),
      }),
    );
  };


/*
 * =====================================================
 * REQUEST WRITE
 * =====================================================
 */

export const requestGitHubWrite =
  async (
    sessionId: any,
    instruction: string,
  ) => {
    const session =
      getSessionRecord(
        sessionId,
      );

    if (!session) {
      throw new Error(
        "SESSION_NOT_FOUND",
      );
    }

    const repository =
      getSessionRepository(
        sessionId,
      );

    if (!repository) {
      throw new Error(
        "REPOSITORY_NOT_SELECTED",
      );
    }

    const context:
      GitHubWriteContext = {
        repository,
      };

    const result =
      await runner.run(
        githubWriteAgent,
        instruction,
        {
          context,

          maxTurns:
            10,
        },
      );

    /*
     * Tool attempted and requires approval.
     */
    if (
      result.interruptions.length >
      0
    ) {
      const approval =
  await createPendingApproval(
    sessionId,
    result.state.toString(),
  );

      return {
        status:
          "approval_required" as const,

        approvalId:
          approval.approvalId,

        repository:
          repository.fullName,

        actions:
          mapInterruptions(
            result.interruptions,
          ),
      };
    }

    /*
     * No write tool was called.
     *
     * Example:
     * Agent may have explained that the
     * request is unsupported.
     */
    return {
      status:
        "completed" as const,

      repository:
        repository.fullName,

      response:
        result.finalOutput ??
        "No GitHub action was performed.",
    };
  };


/*
 * =====================================================
 * RESOLVE APPROVAL
 * =====================================================
 */

export const resolveGitHubApproval =
  async (
    approvalId: any,

    decision:
      "approve" |
      "reject",

    actionIndex:
      number,
  ) => {
    const record =
  await getPendingApproval(
    approvalId,
  );

    if (!record) {
      throw new Error(
        "APPROVAL_NOT_FOUND",
      );
    }

    /*
     * Restore EXACT paused run.
     *
     * RunState serialization preserves
     * tool approvals and runtime state.
     */
    const state =
      await RunState
        .fromString(
          githubWriteAgent,

          record
            .serializedState,
        );

    const interruptions =
      state
        .getInterruptions();

    const interruption =
      interruptions[
        actionIndex
      ];

    if (!interruption) {
      throw new Error(
        "APPROVAL_ACTION_NOT_FOUND",
      );
    }

    if (
      decision ===
      "approve"
    ) {
      /*
       * Approve ONLY this invocation.
       *
       * Do NOT use alwaysApprove.
       */
      state.approve(
        interruption,
      );
    } else {
      state.reject(
        interruption,
        {
          message:
            "The user rejected this GitHub write operation. Do not perform it.",
        },
      );
    }

    /*
     * Resume from paused state.
     */
    const result =
      await runner.run(
        githubWriteAgent,
        state,
      );

    /*
     * Multi-step operations can pause again.
     *
     * Example:
     *
     * approve create_branch
     *       ↓
     * agent proposes push_files
     *       ↓
     * approval required again
     */
    if (
      result.interruptions.length >
      0
    ) {
      await updatePendingApproval(
        approvalId,

        result.state.toString(),
      );

      return {
        status:
          "approval_required" as const,

        approvalId,

        actions:
          mapInterruptions(
            result.interruptions,
          ),
      };
    }

    /*
 * No more interruptions.
 * Mark approval workflow as finished.
 */
if (
  decision ===
  "approve"
) {
  await completePendingApproval(
    approvalId,
  );
} else {
  await rejectPendingApproval(
    approvalId,
  );
}

/*
 * Final response.
 */
return {
  status:
    decision === "approve"
      ? "completed"
      : "rejected",

  response:
    result.finalOutput ??
    (
      decision === "approve"
        ? "GitHub operation completed."
        : "GitHub operation rejected."
    ),
};

    /*
     * Workflow finished.
     */
    failPendingApproval(
      approvalId,
    );

    return {
      status:
        decision === "approve"
          ? "completed"
          : "rejected",

      response:
        result.finalOutput ??
        (
          decision ===
          "approve"
            ? "GitHub operation completed."
            : "GitHub operation rejected."
        ),
    };
  };