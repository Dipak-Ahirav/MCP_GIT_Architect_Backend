import type {
  Request,
  Response,
} from "express";

import {
  debugWorkflowRun,
} from "../services/ci-debugger.service.js";

export const debugSelectedWorkflowRun =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        sessionId,
        runId: runIdParam,
      } =
        req.params;

      const runId =
        Number(
          runIdParam,
        );

      if (
        !Number.isInteger(
          runId,
        ) ||
        runId <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Valid workflow run ID is required",
          });
      }

      const result =
        await debugWorkflowRun(
          sessionId,
          runId,
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
        "❌ CI Debug Error:",
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
                "Select a repository before debugging a workflow run",
            });
        }

        if (
          error.message ===
          "CI_DEBUG_OUTPUT_MISSING"
        ) {
          return res
            .status(502)
            .json({
              success: false,

              message:
                "CI Debugger did not return a valid analysis",
            });
        }
      }

      return res
        .status(500)
        .json({
          success: false,

          message:
            "GitHub Actions workflow debugging failed",
        });
    }
  };