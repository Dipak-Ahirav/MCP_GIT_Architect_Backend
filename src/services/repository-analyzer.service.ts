import {
  Runner,
} from "@openai/agents";

import {
  repositoryAnalyzerAgent,
} from "../agents/repositoryAnalyzer.agent.js";

import {
  getSessionRecord,
  getSessionRepository,
} from "./session.service.js";

import type {
  GitArchitectContext,
} from "../types/agent-context.js";

import type {
  RepositoryAnalysis,
} from "../schemas/repository-analysis.schema.js";

const runner =
  new Runner();

export interface RepositoryAnalysisResult {
  repository:
    string;

  defaultBranch:
    string;

  overallScore:
    number;

  analysis:
    RepositoryAnalysis;
}

const calculateOverallScore = (
  scores:
    RepositoryAnalysis["scores"],
): number => {
  const values =
    Object.values(
      scores,
    );

  const total =
    values.reduce(
      (
        sum,
        score,
      ) =>
        sum + score,
      0,
    );

  return Number(
    (
      total /
      values.length
    ).toFixed(1),
  );
};

export const analyzeRepository =
  async (
    sessionId: any,
  ): Promise<
    RepositoryAnalysisResult
  > => {
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
      GitArchitectContext = {
        repository,
      };

    const result =
      await runner.run(
        repositoryAnalyzerAgent,
        `
Perform a complete architecture analysis of the
currently selected repository.

Repository:
${repository.fullName}

Default branch:
${repository.defaultBranch}

Use GitHub MCP extensively enough to support
your findings with actual repository evidence.
`,
        {
          context,
        },
      );

    if (!result.finalOutput) {
      throw new Error(
        "ANALYSIS_OUTPUT_MISSING",
      );
    }

    const analysis =
      result.finalOutput;

    const overallScore =
      calculateOverallScore(
        analysis.scores,
      );

    return {
      repository:
        repository.fullName,

      defaultBranch:
        repository.defaultBranch,

      overallScore,

      analysis,
    };
  };