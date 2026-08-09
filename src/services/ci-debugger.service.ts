import {
  Runner,
} from "@openai/agents";

import {
  ciDebuggerAgent,
} from "../agents/ciDebugger.agent.js";

import {
  getSessionRecord,
  getSessionRepository,
} from "./session.service.js";

import type {
  CIDebugContext,
} from "../types/ci-debug-context.js";

import type {
  CIDebugAnalysis,
} from "../schemas/ci-debug.schema.js";

const runner =
  new Runner();

export interface CIDebugResult {
  repository:
    string;

  runId:
    number;

  analysis:
    CIDebugAnalysis;
}

export const debugWorkflowRun =
  async (
    sessionId: any,
    runId: number,
  ): Promise<CIDebugResult> => {
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
      CIDebugContext = {
        repository,
        runId,
      };

    const result =
      await runner.run(
        ciDebuggerAgent,
        `
Debug GitHub Actions workflow run ${runId}
for ${repository.fullName}.

Inspect the workflow run, failed jobs and logs.

Then inspect relevant workflow configuration and
repository code to determine the root cause and
propose a safe fix.

Do not change code and do not rerun the workflow.
`,
        {
          context,

          maxTurns: 25,
        },
      );

    if (!result.finalOutput) {
      throw new Error(
        "CI_DEBUG_OUTPUT_MISSING",
      );
    }

    return {
      repository:
        repository.fullName,

      runId,

      analysis:
        result.finalOutput,
    };
  };