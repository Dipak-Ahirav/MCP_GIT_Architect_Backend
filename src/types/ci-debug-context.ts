import type {
  RepositoryContext,
} from "./agent-context.js";

export interface CIDebugContext {
  repository:
    RepositoryContext;

  runId:
    number;
}