import type {
  Request,
  Response,
} from "express";

import {
  analyzeRepository,
} from "../services/repository-analyzer.service.js";

export const analyzeSelectedRepository =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        sessionId,
      } = req.params;

      const result =
        await analyzeRepository(
          sessionId,
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
        "❌ Repository Analysis Error:",
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
                "Select a repository before running repository analysis",
            });
        }

        if (
          error.message ===
          "ANALYSIS_OUTPUT_MISSING"
        ) {
          return res
            .status(502)
            .json({
              success: false,

              message:
                "Repository analyzer did not return a valid report",
            });
        }
      }

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Repository analysis failed",
        });
    }
  };