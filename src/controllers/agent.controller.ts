import type {
  Request,
  Response,
} from "express";

import {
  chatWithGitArchitect,
} from "../services/agent.service.js";

export const chatWithAgent = async (
  req: Request,
  res: Response,
) => {
  try {
    const { message } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response =
      await chatWithGitArchitect(
        message.trim(),
      );

    return res.status(200).json({
      success: true,
      data: {
        response,
      },
    });
  } catch (error) {
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