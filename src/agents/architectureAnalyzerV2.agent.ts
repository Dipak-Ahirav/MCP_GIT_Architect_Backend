import {
  Agent,
  type RunContext,
} from "@openai/agents";

import {
  githubMcpTool,
} from "../mcp/github.mcp.js";

import {
  specialistAnalysisSchema,
} from "../schemas/specialist-analysis.schema.js";

import type {
  RepositoryIntelligenceContext,
} from "../types/repository-intelligence-context.js";

const instructions = (
  runContext:
    RunContext<RepositoryIntelligenceContext>,
) => {
  const {
    repository,
    discovery,
  } =
    runContext.context;

  return `
You are GitArchitect's Architecture Specialist.

Repository:
${repository.fullName}

Detected project type:
${discovery.projectType}

Detected frameworks:
${discovery.frameworks.join(", ") || "unknown"}

Source roots:
${discovery.sourceRoots.join(", ") || "unknown"}

Analyze ONLY architectural engineering concerns.

Use GitHub MCP to inspect representative source
files before making repository-specific claims.

Evaluate:

- architectural boundaries
- ownership
- responsibilities
- coupling
- cohesion
- dependency direction
- module/feature structure
- scalability
- maintainability
- code organization
- separation of concerns
- configuration boundaries
- API/domain boundaries when relevant

Provide scores ONLY for:

architecture
codeOrganization
maintainability
scalability

Set ALL other scores to null.

Every finding must contain real evidencePaths.

Do not criticize a repository simply because it
does not use your preferred architecture.

Architecture must be evaluated relative to the
repository's actual size and purpose.

Return structured output only.
`;
};

export const architectureAnalyzerV2Agent =
  new Agent<RepositoryIntelligenceContext>({
    name:
      "Architecture Analyzer",

    instructions,

    tools: [
      githubMcpTool,
    ],

    outputType:
      specialistAnalysisSchema,
  });