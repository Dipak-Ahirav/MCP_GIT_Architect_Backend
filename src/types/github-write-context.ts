import type {
  RepositoryContext,
} from "./agent-context.js";

export interface GitHubWriteContext {
  repository:
    RepositoryContext;
}