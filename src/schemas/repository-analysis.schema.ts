import { z } from "zod";

export const repositoryFindingSchema =
  z.object({
    title:
      z.string(),

    category:
      z.enum([
        "architecture",
        "code-organization",
        "maintainability",
        "scalability",
        "security",
        "performance",
        "testing",
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

    description:
      z.string(),

    impact:
      z.string(),

    recommendation:
      z.string(),

    evidencePaths:
      z.array(
        z.string(),
      ),
  });

export const repositoryRecommendationSchema =
  z.object({
    priority:
      z.enum([
        "critical",
        "high",
        "medium",
        "low",
      ]),

    title:
      z.string(),

    description:
      z.string(),

    expectedBenefit:
      z.string(),
  });

export const repositoryAnalysisSchema:any =
  z.object({
    summary:
      z.string(),

    repositoryPurpose:
      z.string(),

    technologyStack:
      z.array(
        z.string(),
      ),

    architectureStyle:
      z.array(
        z.string(),
      ),

    importantDirectories:
      z.array(
        z.object({
          path:
            z.string(),

          purpose:
            z.string(),
        }),
      ),

    scores:
      z.object({
        architecture:
          z.number()
            .min(0)
            .max(10),

        codeOrganization:
          z.number()
            .min(0)
            .max(10),

        maintainability:
          z.number()
            .min(0)
            .max(10),

        scalability:
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

        dependencyHealth:
          z.number()
            .min(0)
            .max(10),
      }),

    strengths:
      z.array(
        z.string(),
      ),

    findings:
      z.array(
        repositoryFindingSchema,
      ),

    recommendations:
      z.array(
        repositoryRecommendationSchema,
      ),

    analyzedFiles:
      z.array(
        z.string(),
      ),

    limitations:
      z.array(
        z.string(),
      ),
  });

export type RepositoryAnalysis =
  z.infer<
    typeof repositoryAnalysisSchema
  >;