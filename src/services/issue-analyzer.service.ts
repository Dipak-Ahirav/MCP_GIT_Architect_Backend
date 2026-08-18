import {
  Runner,
} from "@openai/agents";

import {
  issueAnalyzerAgent,
} from "../agents/issueAnalyzer.agent.js";

import {
  getSessionRecord,
  getSessionRepository,
} from "./session.service.js";

import type {
  IssueAnalysisContext,
} from "../types/issue-analysis-context.js";

import type {
  IssueAnalysis,
} from "../schemas/issue-analysis.schema.js";

const runner =
  new Runner();

export interface IssueAnalysisResult {
  repository:
    string;

  issueNumber:
    number;

  analysis:
    IssueAnalysis;
}

export const analyzeIssue =
  async (
    sessionId: string,
    issueNumber: number,
  ): Promise<IssueAnalysisResult> => {
    const session =
      await getSessionRecord(
        sessionId,
      );

    if (!session) {
      throw new Error(
        "SESSION_NOT_FOUND",
      );
    }

    const repository =
      await getSessionRepository(
        sessionId,
      );

    if (!repository) {
      throw new Error(
        "REPOSITORY_NOT_SELECTED",
      );
    }

    const context:
      IssueAnalysisContext = {
        repository,
        issueNumber,
      };

    const result =
      await runner.run(
        issueAnalyzerAgent,
        `
Analyze issue #${issueNumber}
in ${repository.fullName}.

Read the issue and its discussion first.

Then inspect relevant repository code to
determine requirements, affected areas,
possible root cause, implementation steps,
testing needs and unanswered questions.

Do not modify GitHub.
`,
        {
          context,

          maxTurns: 20,
        },
      );

    if (!result.finalOutput) {
      throw new Error(
        "ISSUE_ANALYSIS_OUTPUT_MISSING",
      );
    }

    return {
      repository:
        repository.fullName,

      issueNumber,

      analysis:
        result.finalOutput,
    };
  };
