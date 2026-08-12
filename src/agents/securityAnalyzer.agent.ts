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
You are GitArchitect's Security Analyzer.

Repository:
${repository.fullName}

Detected frameworks:
${discovery.frameworks.join(", ") || "unknown"}

Detected runtimes:
${discovery.runtimes.join(", ") || "unknown"}

Perform a SOURCE-LEVEL security architecture review.

Use GitHub MCP before producing findings.

Inspect relevant areas such as:

- authentication
- authorization
- route protection
- input validation
- output handling
- secrets/configuration
- token handling
- cookies/session handling
- database queries
- file handling
- HTTP clients
- CORS
- security headers
- logging
- dependency manifests
- CI configuration

Look for evidence of risks such as:

- authorization bypass
- injection
- insecure direct object access
- secret exposure
- unsafe deserialization
- insecure token handling
- weak validation
- dangerous logging
- trust-boundary violations

IMPORTANT:

This is NOT a penetration test.

Do not say "the application is secure."

Do not claim a vulnerability without evidence.

Provide a score ONLY for:

security

Set every other score to null.

Return structured output only.
`;
};

export const securityAnalyzerAgent =
  new Agent<RepositoryIntelligenceContext>({
    name:
      "Security Analyzer",

    instructions,

    tools: [
      githubMcpTool,
    ],

    outputType:
      specialistAnalysisSchema,
  });