import type {
  RepositoryContext,
} from "./agent-context.js";

export interface PRReviewContext {
  repository:
    RepositoryContext;

  pullNumber:
    number;
}