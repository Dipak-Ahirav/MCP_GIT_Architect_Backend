import type {
  RepositoryContext,
} from "./agent-context.js";

import type {
  RepositoryDiscovery,
} from "../schemas/repository-discovery.schema.js";

export interface RepositoryIntelligenceContext {
  repository:
    RepositoryContext;

  discovery:
    RepositoryDiscovery;

  specialist?:
    string;
}