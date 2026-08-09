import {
  hostedMcpTool,
} from "@openai/agents";

import {
  env,
} from "../config/env.js";

export const githubMcpTool =
  hostedMcpTool({
    serverLabel: "github",

    serverUrl:
      "https://api.githubcopilot.com/mcp/",

    headers: {
      Authorization:
        `Bearer ${env.GITHUB_TOKEN}`,

      "X-MCP-Toolsets":
  "context,repos,issues,pull_requests,actions",

      "X-MCP-Readonly":
        "true",
    },

    requireApproval:
      "never",
  });