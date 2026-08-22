import {
  debugWorkflowRun,
} from "./ci-debugger.service.js";

import {
  requestGitHubWrite,
} from "./github-write.service.js";

import type {
  CIDebugAnalysis,
} from "../schemas/ci-debug.schema.js";

const formatLines =
  (
    title: string,
    values:
      | string[]
      | undefined,
  ) => {
    if (!values?.length) {
      return `${title}: none reported`;
    }

    return [
      `${title}:`,
      ...values.map(
        value =>
          `- ${value}`,
      ),
    ].join("\n");
  };

const buildAutoFixInstruction =
  (
    runId: number,
    analysis: CIDebugAnalysis,
  ) => {
    const run =
      analysis.workflowRun;

    const rootCause =
      analysis.rootCause ?? {
        title:
          "Unknown root cause",

        explanation:
          "No root cause was available in the CI analysis.",

        evidence:
          [],
      };

    const proposedFixes =
      (
        analysis.proposedFixes ??
        []
      ).map(
        (
          fix,
          index,
        ) => [
          `${index + 1}. ${fix.title ?? "Proposed fix"}`,
          `Priority: ${fix.priority ?? "unknown"}`,
          `Description: ${fix.description ?? "none reported"}`,
          `Files: ${fix.files?.join(", ") || "none reported"}`,
          `Validation: ${fix.validation ?? "none reported"}`,
        ].join("\n"),
      );

    const failedJobs =
      (
        analysis.failedJobs ??
        []
      ).map(
        job => [
          `Job: ${job.name ?? "unknown"}`,
          `Failed step: ${job.failedStep ?? "unknown"}`,
          `Summary: ${job.errorSummary ?? "none reported"}`,
          formatLines(
            "Relevant log lines",
            job.relevantLogLines,
          ),
        ].join("\n"),
      );

    return `
CI Auto Fix request for GitHub Actions run ${runId}.

Create a new fix branch, apply the smallest safe code or workflow change that addresses the failed CI run, commit the change, and open a pull request.

Do not merge the pull request.
Do not push directly to the default branch.
Use the selected repository only.
Prefer a branch name like gitarchitect/ci-auto-fix-${runId}.
After editing, include validation details in the PR body. If tests cannot be run through available tools, state exactly what should be run manually.

Workflow run:
- Actual run id: ${run?.runId ?? runId}
- Workflow: ${run?.workflowName ?? "unknown"}
- Branch: ${run?.branch ?? "unknown"}
- Commit: ${run?.commitSha ?? "unknown"}
- Status: ${run?.status ?? "unknown"}
- Conclusion: ${run?.conclusion ?? "unknown"}
- Event: ${run?.event ?? "unknown"}

Failure category:
${analysis.failureCategory ?? "unknown"}

Summary:
${analysis.summary ?? "No summary was available."}

Root cause:
${rootCause.title ?? "Unknown root cause"}

Root cause explanation:
${rootCause.explanation ?? "No root cause explanation was available."}

${formatLines(
  "Root cause evidence",
  rootCause.evidence,
)}

Failed jobs:
${failedJobs.join("\n\n") || "none reported"}

Proposed fixes:
${proposedFixes.join("\n\n") || "none reported"}

${formatLines(
  "Related files",
  (
    analysis.relatedCode ??
    []
  ).map(
    item =>
      `${item.path ?? "unknown"}: ${item.relevance ?? "none reported"}`,
  ),
)}

${formatLines(
  "Validation plan",
  analysis.validationPlan,
)}

${formatLines(
  "Known limitations",
  analysis.limitations,
)}
`;
  };

export const prepareCiAutoFix =
  async (
    sessionId: any,
    runId: number,
    existingAnalysis?: CIDebugAnalysis,
  ) => {
    const debugResult =
      existingAnalysis
        ? null
        : await debugWorkflowRun(
          sessionId,
          runId,
        );

    const analysis =
      existingAnalysis ??
      debugResult?.analysis;

    if (!analysis) {
      throw new Error(
        "CI_DEBUG_OUTPUT_MISSING",
      );
    }

    const writeResult =
      await requestGitHubWrite(
        sessionId,
        buildAutoFixInstruction(
          runId,
          analysis,
        ),
      );

    return {
      ...writeResult,

      runId,

      analysis,
    };
  };
