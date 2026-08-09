import type {
  Request,
  Response,
} from "express";

import {
  reviewPullRequest,
} from "../services/pr-review.service.js";

export const reviewSelectedPullRequest =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        sessionId,
        pullNumber:
          pullNumberParam,
      } =
        req.params;

      const pullNumber =
        Number(
          pullNumberParam,
        );

      if (
        !Number.isInteger(
          pullNumber,
        ) ||
        pullNumber <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Valid pull request number is required",
          });
      }

      const result =
        await reviewPullRequest(
          sessionId,
          pullNumber,
        );

      return res
        .status(200)
        .json({
          success: true,

          data:
            result,
        });
    } catch (error) {
      console.error(
        "❌ PR Review Error:",
        error,
      );

      if (
        error instanceof Error
      ) {
        if (
          error.message ===
          "SESSION_NOT_FOUND"
        ) {
          return res
            .status(404)
            .json({
              success: false,

              message:
                "Session not found",
            });
        }

        if (
          error.message ===
          "REPOSITORY_NOT_SELECTED"
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Select a repository before reviewing a pull request",
            });
        }

        if (
          error.message ===
          "PR_REVIEW_OUTPUT_MISSING"
        ) {
          return res
            .status(502)
            .json({
              success: false,

              message:
                "PR Review Agent did not return a valid review",
            });
        }
      }

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Pull request review failed",
        });
    }
  };