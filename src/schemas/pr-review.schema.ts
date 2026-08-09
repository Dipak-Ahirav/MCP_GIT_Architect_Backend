import { z } from "zod";

export const prReviewFindingSchema =
  z.object({
    title:
      z.string(),

    category:
      z.enum([
        "correctness",
        "architecture",
        "maintainability",
        "security",
        "performance",
        "testing",
        "error-handling",
        "api-design",
        "data-integrity",
        "dependencies",
      ]),

    severity:
      z.enum([
        "critical",
        "high",
        "medium",
        "low",
        "info",
      ]),

    path:
      z.string(),

    line:
      z.number()
        .int()
        .positive()
        .nullable(),

    description:
      z.string(),

    whyItMatters:
      z.string(),

    suggestion:
      z.string(),
  });

export const prReviewSchema =
  z.object({
    pullRequest:
      z.object({
        number:
          z.number()
            .int()
            .positive(),

        title:
          z.string(),

        author:
          z.string(),

        status:
          z.enum([
            "open",
            "closed",
            "merged",
            "draft",
            "unknown",
          ]),

        baseBranch:
          z.string(),

        headBranch:
          z.string(),

        changedFiles:
          z.number()
            .int()
            .nonnegative(),

        additions:
          z.number()
            .int()
            .nonnegative(),

        deletions:
          z.number()
            .int()
            .nonnegative(),
      }),

    summary:
      z.string(),

    riskLevel:
      z.enum([
        "critical",
        "high",
        "medium",
        "low",
      ]),

    reviewRecommendation:
      z.enum([
        "approve",
        "comment",
        "request-changes",
        "needs-more-context",
      ]),

    scores:
      z.object({
        correctness:
          z.number()
            .min(0)
            .max(10),

        architecture:
          z.number()
            .min(0)
            .max(10),

        maintainability:
          z.number()
            .min(0)
            .max(10),

        security:
          z.number()
            .min(0)
            .max(10),

        performance:
          z.number()
            .min(0)
            .max(10),

        testing:
          z.number()
            .min(0)
            .max(10),
      }),

    positives:
      z.array(
        z.string(),
      ),

    findings:
      z.array(
        prReviewFindingSchema,
      ),

    testingAssessment:
      z.object({
        confidence:
          z.enum([
            "high",
            "medium",
            "low",
            "unknown",
          ]),

        notes:
          z.array(
            z.string(),
          ),
      }),

    checks:
      z.object({
        status:
          z.enum([
            "passing",
            "failing",
            "pending",
            "mixed",
            "unavailable",
          ]),

        notes:
          z.array(
            z.string(),
          ),
      }),

    filesReviewed:
      z.array(
        z.string(),
      ),

    limitations:
      z.array(
        z.string(),
      ),
  });

export type PRReview =
  z.infer<
    typeof prReviewSchema
  >;