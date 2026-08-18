import {
  Runner,
} from "@openai/agents";

import {
  prReviewAgent,
} from "../agents/prReview.agent.js";

import {
  getSessionRecord,
  getSessionRepository,
} from "./session.service.js";

import type {
  PRReviewContext,
} from "../types/pr-review-context.js";

import type {
  PRReview,
} from "../schemas/pr-review.schema.js";

const runner =
  new Runner();

export interface PRReviewResult {
  repository:
    string;

  pullNumber:
    number;

  overallScore:
    number;

  review:
    PRReview;
}

const calculateOverallScore = (
  scores:
    PRReview["scores"],
): number => {
  const values =
    Object.values(
      scores,
    );

  const total =
    values.reduce(
      (
        sum,
        value,
      ) =>
        sum + value,
      0,
    );

  return Number(
    (
      total /
      values.length
    ).toFixed(1),
  );
};

export const reviewPullRequest =
  async (
    sessionId: string,
    pullNumber: number,
  ): Promise<
    PRReviewResult
  > => {
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
      PRReviewContext = {
        repository,
        pullNumber,
      };

    const result =
      await runner.run(
        prReviewAgent,
        `
Review pull request #${pullNumber}
in ${repository.fullName}.

Perform an evidence-based code review using
GitHub MCP.

Inspect the PR details, changed files, diff,
commits, checks and relevant repository code
before returning the structured review.
`,
        {
          context,
        },
      );

    if (!result.finalOutput) {
      throw new Error(
        "PR_REVIEW_OUTPUT_MISSING",
      );
    }

    const review =
      result.finalOutput;

    const overallScore =
      calculateOverallScore(
        review.scores,
      );

    return {
      repository:
        repository.fullName,

      pullNumber,

      overallScore,

      review,
    };
  };
