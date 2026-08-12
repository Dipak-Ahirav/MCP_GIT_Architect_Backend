import type {
  SpecialistAnalysis,
} from "../schemas/specialist-analysis.schema.js";

import type {
  RepositoryAnalysis,
} from "../schemas/repository-analysis.schema.js";

type ScoreKey =
  keyof RepositoryAnalysis["scores"];

const scoreKeys:
  ScoreKey[] = [
    "architecture",
    "codeOrganization",
    "maintainability",
    "scalability",
    "security",
    "performance",
    "testing",
    "dependencyHealth",
  ];

export const mergeSpecialistScores =
  (
    analyses:
      SpecialistAnalysis[],
  ): RepositoryAnalysis["scores"] => {
    const result =
      {} as RepositoryAnalysis["scores"];

    for (
      const key
      of scoreKeys
    ) {
      const values =
        analyses
          .map(
            (analysis) =>
              analysis.scores[key],
          )
          .filter(
            (
              value,
            ): value is number =>
              value !== null,
          );

      if (
        values.length === 0
      ) {
        /*
         * Neutral fallback when the
         * repository cannot be evaluated.
         */
        result[key] = 5;

        continue;
      }

      const average =
        values.reduce(
          (
            total,
            value,
          ) =>
            total + value,
          0,
        ) /
        values.length;

      result[key] =
        Number(
          average.toFixed(1),
        );
    }

    return result;
  };

export const calculateOverallScore =
  (
    scores:
      RepositoryAnalysis["scores"],
  ) => {
    const values =
      Object.values(
        scores,
      );

    return Number(
      (
        values.reduce(
          (
            total,
            value,
          ) =>
            total + value,
          0,
        ) /
        values.length
      ).toFixed(1),
    );
  };