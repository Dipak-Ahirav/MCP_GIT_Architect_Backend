import type {
  Request,
  Response,
} from "express";

import {
  requestGitHubWrite,
  resolveGitHubApproval,
} from "../services/github-write.service.js";


export const requestWrite =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        sessionId,
      } =
        req.params;

      const {
        instruction,
      } =
        req.body;

      if (
        typeof instruction !==
          "string" ||
        !instruction.trim()
      ) {
        return res
          .status(400)
          .json({
            success:
              false,

            message:
              "Write instruction is required",
          });
      }

      const result =
        await requestGitHubWrite(
          sessionId,

          instruction.trim(),
        );

      /*
       * 202 = waiting for user approval
       */
      if (
        result.status ===
        "approval_required"
      ) {
        return res
          .status(202)
          .json({
            success:
              true,

            data:
              result,
          });
      }

      return res
        .status(200)
        .json({
          success:
            true,

          data:
            result,
        });

    } catch (error) {
      console.error(
        "❌ GitHub Write Error:",
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
              success:
                false,

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
              success:
                false,

              message:
                "Select a repository first",
            });
        }
      }

      return res
        .status(500)
        .json({
          success:
            false,

          message:
            "Unable to prepare GitHub write operation",
        });
    }
  };


export const decideWriteApproval =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        approvalId,
      } =
        req.params;

      const {
        decision,
        actionIndex = 0,
      } =
        req.body;

      if (
        decision !== "approve" &&
        decision !== "reject"
      ) {
        return res
          .status(400)
          .json({
            success:
              false,

            message:
              "decision must be approve or reject",
          });
      }

      if (
        !Number.isInteger(
          actionIndex,
        ) ||
        actionIndex < 0
      ) {
        return res
          .status(400)
          .json({
            success:
              false,

            message:
              "Valid actionIndex is required",
          });
      }

      const result =
        await resolveGitHubApproval(
          approvalId,

          decision,

          actionIndex,
        );

      const status =
        result.status ===
        "approval_required"
          ? 202
          : 200;

      return res
        .status(status)
        .json({
          success:
            true,

          data:
            result,
        });

    } catch (error) {
      console.error(
        "❌ GitHub Approval Error:",
        error,
      );

      if (
        error instanceof Error &&
        (
          error.message ===
            "APPROVAL_NOT_FOUND" ||
          error.message ===
            "APPROVAL_ACTION_NOT_FOUND"
        )
      ) {
        return res
          .status(404)
          .json({
            success:
              false,

            message:
              "Approval request not found or expired",
          });
      }

      return res
        .status(500)
        .json({
          success:
            false,

          message:
            "Unable to process GitHub approval",
        });
    }
  };