import { env } from "../config/env.js";

interface GitHubUserResponse {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

export interface GitHubAuthenticatedUser {
  id: number;
  username: string;
  name: string | null;
  avatarUrl: string;
  profileUrl: string;
}

export const getAuthenticatedGitHubUser =
  async (): Promise<GitHubAuthenticatedUser> => {
    const response = await fetch(
      "https://api.github.com/user",
      {
        method: "GET",

        headers: {
          Accept:
            "application/vnd.github+json",

          Authorization:
            `Bearer ${env.GITHUB_TOKEN}`,

          "X-GitHub-Api-Version":
            "2026-03-10",

          "User-Agent":
            "GitArchitect",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `GITHUB_AUTH_FAILED:${response.status}`,
      );
    }

    const user =
      (await response.json()) as
        GitHubUserResponse;

    return {
      id: user.id,

      username:
        user.login,

      name:
        user.name,

      avatarUrl:
        user.avatar_url,

      profileUrl:
        user.html_url,
    };
  };