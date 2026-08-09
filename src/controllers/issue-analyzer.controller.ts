import type {
  Request,
  Response,
} from "express";

import {
  analyzeIssue,
} from "../services/issue-analyzer.service.js";

export const analyzeSelectedIssue =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        sessionId,
        issueNumber:
          issueNumberParam,
      } =
        req.params;

      const issueNumber =
        Number(
          issueNumberParam,
        );

      if (
        !Number.isInteger(
          issueNumber,
        ) ||
        issueNumber <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Valid issue number is required",
          });
      }

      const result =
        await analyzeIssue(
          sessionId,
          issueNumber,
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
        "❌ Issue Analysis Error:",
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
                "Select a repository before analyzing an issue",
            });
        }

        if (
          error.message ===
          "ISSUE_ANALYSIS_OUTPUT_MISSING"
        ) {
          return res
            .status(502)
            .json({
              success: false,

              message:
                "Issue Analyzer did not return a valid analysis",
            });
        }
      }

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Issue analysis failed",
        });
    }
  };