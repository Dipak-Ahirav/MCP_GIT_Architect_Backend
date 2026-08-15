import type {
  Request,
  Response,
} from "express";

import {
  createSession,
  deleteSession,
  getSessionRecord,
  setSessionRepository,
  getSessionRepository,
  clearSessionRepository,
} from "../services/session.service.js";

import {
  getRepositoryDetails,
} from "../services/github.service.js";

export const createAgentSession =
  async(
    _req: Request,
    res: Response,
  ) => {
    const session =
      await createSession();

    return res.status(201).json({
      success: true,

      data: {
        sessionId:
          session.sessionId,
      },
    });
  };

export const selectRepository =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        sessionId,
      } = req.params;

      const {
        owner,
        repo,
      } = req.body;

      if (
        typeof owner !==
          "string" ||
        !owner.trim()
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Repository owner is required",
        });
      }

      if (
        typeof repo !==
          "string" ||
        !repo.trim()
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Repository name is required",
        });
      }

      const session =
        await getSessionRecord(
          sessionId,
        );

      if (!session) {
        return res.status(404).json({
          success: false,

          message:
            "Session not found",
        });
      }

      /*
       * Important:
       *
       * Verify repository access with
       * GitHub BEFORE storing it.
       */
      const repository =
        await getRepositoryDetails(
          owner.trim(),
          repo.trim(),
        );

      await setSessionRepository(
        sessionId,
        repository,
      );

      return res.status(200).json({
        success: true,

        message:
          "Repository selected successfully",

        data: {
          sessionId,

          repository,
        },
      });
    } catch (error) {
      console.error(
        "❌ Repository Selection Error:",
        error,
      );

      if (
        error instanceof Error &&
        error.message.startsWith(
          "GITHUB_REPOSITORY_FAILED:",
        )
      ) {
        const status =
          Number(
            error.message.split(
              ":",
            )[1],
          );

        if (
          status === 404
        ) {
          return res.status(404).json({
            success: false,

            message:
              "Repository not found or GitArchitect does not have access to it",
          });
        }
      }

      return res.status(500).json({
        success: false,

        message:
          "Failed to select repository",
      });
    }
  };

export const getSelectedRepository =
  async(
    req: Request,
    res: Response,
  ) => {
    const {
      sessionId,
    } = req.params;

    const session =
      await getSessionRecord(
        sessionId,
      );

    if (!session) {
      return res.status(404).json({
        success: false,

        message:
          "Session not found",
      });
    }

    const repository =
      await getSessionRepository(
        sessionId,
      );

    return res.status(200).json({
      success: true,

      data: {
        sessionId,

        repository:
          repository ?? null,
      },
    });
  };

export const removeSelectedRepository =
  async(
    req: Request,
    res: Response,
  ) => {
    const {
      sessionId,
    } = req.params;

    const cleared =
      await clearSessionRepository(
        sessionId,
      );

    if (!cleared) {
      return res.status(404).json({
        success: false,

        message:
          "Session not found",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Repository context cleared",
    });
  };

export const clearAgentSession =
  async (
    req: Request,
    res: Response,
  ) => {
    const {
      sessionId,
    } = req.params;

    const deleted =
      await deleteSession(
        sessionId,
      );

    if (!deleted) {
      return res.status(404).json({
        success: false,

        message:
          "Session not found",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Conversation deleted successfully",
    });
  };