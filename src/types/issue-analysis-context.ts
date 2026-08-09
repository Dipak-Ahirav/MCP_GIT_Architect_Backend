import type {
  RepositoryContext,
} from "./agent-context.js";

export interface IssueAnalysisContext {
  repository:
    RepositoryContext;

  issueNumber:
    number;
}