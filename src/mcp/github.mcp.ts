import {
  hostedMcpTool,
} from "@openai/agents";

import {
  env,
} from "../config/env.js";

/*
 * =====================================================
 * READ-ONLY GITHUB MCP
 * =====================================================
 *
 * Used by:
 *
 * - Chat Agent
 * - Repository Analyzer
 * - PR Reviewer
 * - Issue Analyzer
 * - CI Debugger
 * - Repository Intelligence
 */

export const githubReadMcpTool =
  hostedMcpTool({
    serverLabel:
      "github_read",

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

/*
 * Backward compatibility.
 *
 * Existing agents can continue importing:
 *
 * githubMcpTool
 */
export const githubMcpTool =
  githubReadMcpTool;


/*
 * =====================================================
 * WRITE GITHUB MCP
 * =====================================================
 *
 * ONLY used by GitHubWriteAgent.
 *
 * We deliberately expose specific write tools instead
 * of entire write-capable toolsets.
 */

export const githubWriteMcpTool =
  hostedMcpTool({
    serverLabel:
      "github_write",

    serverUrl:
      "https://api.githubcopilot.com/mcp/",

    headers: {
      Authorization:
        `Bearer ${env.GITHUB_TOKEN}`,

      /*
       * Keep one safe context toolset instead
       * of enabling broad default toolsets.
       */
      "X-MCP-Toolsets":
        "context",

      /*
       * Explicit write allowlist.
       */
      "X-MCP-Tools":
        [
          "add_issue_comment",
          "issue_write",
          "create_branch",
          "push_files",
          "create_pull_request",
          "pull_request_review_write",
          "actions_run_trigger",
        ].join(","),
    },

    /*
     * CRITICAL:
     *
     * Every tool call through this MCP connection
     * requires approval.
     */
    requireApproval:
      "always",
  });