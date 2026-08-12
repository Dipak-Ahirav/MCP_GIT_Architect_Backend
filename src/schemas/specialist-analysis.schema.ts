import { z } from "zod";

import {
  repositoryFindingSchema,
  repositoryRecommendationSchema,
} from "./repository-analysis.schema.js";

export const specialistScoresSchema =
  z.object({
    architecture:
      z.number()
        .min(0)
        .max(10)
        .nullable(),

    codeOrganization:
      z.number()
        .min(0)
        .max(10)
        .nullable(),

    maintainability:
      z.number()
        .min(0)
        .max(10)
        .nullable(),

    scalability:
      z.number()
        .min(0)
        .max(10)
        .nullable(),

    security:
      z.number()
        .min(0)
        .max(10)
        .nullable(),

    performance:
      z.number()
        .min(0)
        .max(10)
        .nullable(),

    testing:
      z.number()
        .min(0)
        .max(10)
        .nullable(),

    dependencyHealth:
      z.number()
        .min(0)
        .max(10)
        .nullable(),
  });

export const specialistAnalysisSchema =
  z.object({
    specialist:
      z.string(),

    summary:
      z.string(),

    scores:
      specialistScoresSchema,

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

export type SpecialistAnalysis =
  z.infer<
    typeof specialistAnalysisSchema
  >;