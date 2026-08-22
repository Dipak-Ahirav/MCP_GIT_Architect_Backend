import type {
  Request,
  Response,
} from "express";

import {
  prepareCiAutoFix,
} from "../services/ci-auto-fix.service.js";

import type {
  CIDebugAnalysis,
} from "../schemas/ci-debug.schema.js";

export const prepareSelectedWorkflowAutoFix =
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

      const analysis =
        typeof req.body?.analysis ===
          "object" &&
        req.body.analysis !== null
          ? req.body.analysis as CIDebugAnalysis
          : undefined;

      const result =
        await prepareCiAutoFix(
          sessionId,
          runId,
          analysis,
        );

      return res
        .status(
          result.status ===
            "approval_required"
            ? 202
            : 200,
        )
        .json({
          success: true,

          data:
            result,
        });
    } catch (error) {
      console.error(
        "❌ CI Auto Fix Error:",
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
                "Select a repository before preparing a CI auto fix",
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
            "Unable to prepare CI auto fix",
        });
    }
  };
