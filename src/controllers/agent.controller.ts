import type {
  Request,
  Response,
} from "express";

import {
  chatWithGitArchitect,
} from "../services/agent.service.js";

import {
  deleteSession,
} from "../services/session.service.js";

export const chatWithAgent = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      message,
      sessionId,
    } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Message is required",
      });
    }

    if (
      sessionId !== undefined &&
      typeof sessionId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "sessionId must be a string",
      });
    }

    const result =
      await chatWithGitArchitect(
        message.trim(),
        sessionId,
      );

    return res.status(200).json({
      success: true,

      data: {
        sessionId:
          result.sessionId,

        response:
          result.response,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "SESSION_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Session not found or expired. Start a new conversation.",
      });
    }

    console.error(
      "❌ GitArchitect Agent Error:",
      error,
    );

    return res.status(500).json({
      success: false,

      message:
        "GitArchitect failed to process the request",
    });
  }
};
