import { env } from "../config/env.js";

import type {
  RepositoryContext,
} from "../types/agent-context.js";

interface GitHubUserResponse {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

interface GitHubRepositoryResponse {
  id: number;

  name: string;

  full_name: string;

  private: boolean;

  html_url: string;

  description: string | null;

  default_branch: string;

  updated_at: string;

  language: string | null;

  owner: {
    login: string;
  };
}

export interface GitHubAuthenticatedUser {
  id: number;

  username: string;

  name: string | null;

  avatarUrl: string;

  profileUrl: string;
}

export interface GitHubRepositoryListItem
  extends RepositoryContext {
  updatedAt: string;

  language: string | null;
}

const githubHeaders = {
  Accept:
    "application/vnd.github+json",

  Authorization:
    `Bearer ${env.GITHUB_TOKEN}`,

  "X-GitHub-Api-Version":
    "2026-03-10",

  "User-Agent":
    "GitArchitect",
};

const normalizeRepository = (
  repository: GitHubRepositoryResponse,
): RepositoryContext => {
  return {
    id: repository.id,

    owner:
      repository.owner.login,

    repo:
      repository.name,

    fullName:
      repository.full_name,

    defaultBranch:
      repository.default_branch,

    isPrivate:
      repository.private,

    url:
      repository.html_url,

    description:
      repository.description,
  };
};

export const getAuthenticatedGitHubUser =
  async (): Promise<GitHubAuthenticatedUser> => {
    const response =
      await fetch(
        "https://api.github.com/user",
        {
          method: "GET",

          headers:
            githubHeaders,
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
      id:
        user.id,

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

export const listAccessibleRepositories =
  async (): Promise<
    GitHubRepositoryListItem[]
  > => {
    const response =
      await fetch(
        "https://api.github.com/user/repos?per_page=100&sort=updated&direction=desc",
        {
          method: "GET",

          headers:
            githubHeaders,
        },
      );

    if (!response.ok) {
      throw new Error(
        `GITHUB_REPOSITORIES_FAILED:${response.status}`,
      );
    }

    const repositories =
      (await response.json()) as
        GitHubRepositoryResponse[];

    return repositories.map(
      (repository) => ({
        ...normalizeRepository(
          repository,
        ),

        updatedAt:
          repository.updated_at,

        language:
          repository.language,
      }),
    );
  };

export const getRepositoryDetails =
  async (
    owner: string,
    repo: string,
  ): Promise<RepositoryContext> => {
    const response =
      await fetch(
        `https://api.github.com/repos/${encodeURIComponent(
          owner,
        )}/${encodeURIComponent(
          repo,
        )}`,
        {
          method: "GET",

          headers:
            githubHeaders,
        },
      );

    if (!response.ok) {
      throw new Error(
        `GITHUB_REPOSITORY_FAILED:${response.status}`,
      );
    }

    const repository =
      (await response.json()) as
        GitHubRepositoryResponse;

    return normalizeRepository(
      repository,
    );
  };