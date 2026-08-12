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
  context:
    RunContext<RepositoryIntelligenceContext>,
) => {
  const {
    repository,
    discovery,
  } =
    context.context;

  return `
You are GitArchitect's Testing Analyzer.

Repository:
${repository.fullName}

Detected testing tools:
${discovery.testingTools.join(", ") || "unknown"}

Detected test roots:
${discovery.testRoots.join(", ") || "unknown"}

Use GitHub MCP.

Inspect:

- test configuration
- representative tests
- unit tests
- integration tests
- e2e tests
- mocking patterns
- test organization
- critical business behavior coverage
- failure scenarios
- CI test execution where observable

Do NOT estimate numeric code coverage unless
actual coverage evidence exists.

Do NOT punish a tiny project for not having an
enterprise-scale testing architecture.

Provide a score ONLY for:

testing

Set all other scores to null.

Return structured output only.
`;
};

export const testingAnalyzerAgent =
  new Agent<RepositoryIntelligenceContext>({
    name:
      "Testing Analyzer",

    instructions,

    tools: [
      githubMcpTool,
    ],

    outputType:
      specialistAnalysisSchema,
  });