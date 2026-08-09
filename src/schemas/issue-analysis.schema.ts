import { z } from "zod";

export const issueAnalysisSchema =
  z.object({
    issue: z.object({
      number:
        z.number()
          .int()
          .positive(),

      title:
        z.string(),

      author:
        z.string(),

      state:
        z.enum([
          "open",
          "closed",
          "unknown",
        ]),

      labels:
        z.array(
          z.string(),
        ),
    }),

    issueType:
      z.enum([
        "bug",
        "feature",
        "enhancement",
        "refactor",
        "security",
        "performance",
        "testing",
        "documentation",
        "maintenance",
        "unknown",
      ]),

    summary:
      z.string(),

    problemStatement:
      z.string(),

    implementationReadiness:
      z.enum([
        "ready",
        "mostly-ready",
        "needs-clarification",
        "blocked",
      ]),

    requirements:
      z.object({
        explicit:
          z.array(
            z.string(),
          ),

        inferred:
          z.array(
            z.string(),
          ),

        missing:
          z.array(
            z.string(),
          ),
      }),

    acceptanceCriteria:
      z.array(
        z.string(),
      ),

    affectedAreas:
      z.array(
        z.object({
          area:
            z.string(),

          reason:
            z.string(),

          evidencePaths:
            z.array(
              z.string(),
            ),
        }),
      ),

    rootCauseAnalysis:
      z.object({
        applicable:
          z.boolean(),

        hypothesis:
          z.string(),

        confidence:
          z.enum([
            "high",
            "medium",
            "low",
            "unknown",
          ]),

        evidencePaths:
          z.array(
            z.string(),
          ),
      }),

    relatedFiles:
      z.array(
        z.object({
          path:
            z.string(),

          relevance:
            z.string(),

          likelyChange:
            z.boolean(),
        }),
      ),

    implementationPlan:
      z.array(
        z.object({
          order:
            z.number()
              .int()
              .positive(),

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

    testingPlan:
      z.array(
        z.object({
          type:
            z.enum([
              "unit",
              "integration",
              "e2e",
              "manual",
              "regression",
            ]),

          scenario:
            z.string(),

          expectedResult:
            z.string(),
        }),
      ),

    risks:
      z.array(
        z.object({
          level:
            z.enum([
              "high",
              "medium",
              "low",
            ]),

          risk:
            z.string(),

          mitigation:
            z.string(),
        }),
      ),

    questions:
      z.array(
        z.string(),
      ),

    relatedPullRequests:
      z.array(
        z.object({
          number:
            z.number()
              .int()
              .positive(),

          relationship:
            z.string(),
        }),
      ),

    filesInspected:
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

export type IssueAnalysis =
  z.infer<
    typeof issueAnalysisSchema
  >;