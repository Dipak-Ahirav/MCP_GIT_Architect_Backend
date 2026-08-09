import type {
  Request,
  Response,
} from "express";

import {
  getAuthenticatedGitHubUser,
  listAccessibleRepositories,
} from "../services/github.service.js";

export const getGitHubAuthStatus =
  async (
    _req: Request,
    res: Response,
  ) => {
    try {
      const user =
        await getAuthenticatedGitHubUser();

      return res.status(200).json({
        success: true,

        message:
          "GitHub authentication successful",

        data: {
          authenticated:
            true,

          user,
        },
      });
    } catch (error) {
      console.error(
        "❌ GitHub Authentication Error:",
        error,
      );

      if (
        error instanceof Error &&
        error.message.startsWith(
          "GITHUB_AUTH_FAILED:",
        )
      ) {
        const status =
          Number(
            error.message.split(
              ":",
            )[1],
          );

        return res.status(401).json({
          success: false,

          message:
            "GitHub authentication failed",

          data: {
            authenticated:
              false,

            githubStatus:
              status,
          },
        });
      }

      return res.status(500).json({
        success: false,

        message:
          "Unable to verify GitHub authentication",
      });
    }
  };

  export const getGitHubRepositories =
  async (
    _req: Request,
    res: Response,
  ) => {
    try {
      const repositories =
        await listAccessibleRepositories();

      return res.status(200).json({
        success: true,

        data: {
          count:
            repositories.length,

          repositories,
        },
      });
    } catch (error) {
      console.error(
        "❌ GitHub Repository List Error:",
        error,
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to load GitHub repositories",
      });
    }
  };