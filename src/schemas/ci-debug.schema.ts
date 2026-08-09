import { z } from "zod";

export const ciDebugSchema =
  z.object({
    workflowRun: z.object({
      runId:
        z.number()
          .int()
          .positive(),

      workflowName:
        z.string(),

      status:
        z.enum([
          "queued",
          "in_progress",
          "completed",
          "unknown",
        ]),

      conclusion:
        z.enum([
          "success",
          "failure",
          "cancelled",
          "timed_out",
          "neutral",
          "skipped",
          "action_required",
          "stale",
          "unknown",
        ]),

      branch:
        z.string(),

      commitSha:
        z.string(),

      event:
        z.string(),

      runNumber:
        z.number()
          .int()
          .nonnegative(),
    }),

    summary:
      z.string(),

    failureCategory:
      z.enum([
        "build",
        "test",
        "lint",
        "typecheck",
        "dependency",
        "configuration",
        "environment",
        "deployment",
        "security",
        "infrastructure",
        "timeout",
        "unknown",
      ]),

    rootCause: z.object({
      title:
        z.string(),

      explanation:
        z.string(),

      confidence:
        z.enum([
          "high",
          "medium",
          "low",
          "unknown",
        ]),

      evidence:
        z.array(
          z.string(),
        ),
    }),

    failedJobs:
      z.array(
        z.object({
          jobId:
            z.number()
              .int()
              .positive(),

          name:
            z.string(),

          conclusion:
            z.string(),

          failedStep:
            z.string()
              .nullable(),

          errorSummary:
            z.string(),

          relevantLogLines:
            z.array(
              z.string(),
            ),
        }),
      ),

    relatedCode:
      z.array(
        z.object({
          path:
            z.string(),

          relevance:
            z.string(),

          likelyCause:
            z.boolean(),
        }),
      ),

    proposedFixes:
      z.array(
        z.object({
          priority:
            z.enum([
              "high",
              "medium",
              "low",
            ]),

          title:
            z.string(),

          description:
            z.string(),

          files:
            z.array(
              z.string(),
            ),

          validation:
            z.string(),
        }),
      ),

    reproduction:
      z.array(
        z.string(),
      ),

    validationPlan:
      z.array(
        z.string(),
      ),

    environmentalFactors:
      z.array(
        z.string(),
      ),

    filesInspected:
      z.array(
        z.string(),
      ),

    logsInspected:
      z.array(
        z.string(),
      ),

    confidence:
      z.enum([
        "high",
        "medium",
        "low",
      ]),

    limitations:
      z.array(
        z.string(),
      ),
  });

export type CIDebugAnalysis =
  z.infer<
    typeof ciDebugSchema
  >;