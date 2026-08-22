import {
  Router,
} from "express";

import {
  chatWithAgent,
} from "../controllers/agent.controller.js";

import {
  createAgentSession,
  selectRepository,
  getSelectedRepository,
  removeSelectedRepository,
  clearAgentSession,
} from "../controllers/session.controller.js";

import {
  analyzeSelectedRepository,
} from "../controllers/repository-analyzer.controller.js";

import {
  reviewSelectedPullRequest,
} from "../controllers/pr-review.controller.js";

import {
  analyzeSelectedIssue,
} from "../controllers/issue-analyzer.controller.js";

import {
  debugSelectedWorkflowRun,
} from "../controllers/ci-debugger.controller.js";

import {
  prepareSelectedWorkflowAutoFix,
} from "../controllers/ci-auto-fix.controller.js";

import {
  requestWrite,
  decideWriteApproval,
} from "../controllers/github-write.controller.js";

const router =
  Router();

/*
 * Create conversation
 */
router.post(
  "/sessions",
  createAgentSession,
);

/*
 * Select repository
 */
router.put(
  "/sessions/:sessionId/repository",
  selectRepository,
);

/*
 * Get selected repository
 */
router.get(
  "/sessions/:sessionId/repository",
  getSelectedRepository,
);

/*
 * Unselect repository
 */
router.delete(
  "/sessions/:sessionId/repository",
  removeSelectedRepository,
);

router.post(
  "/sessions/:sessionId/repository-analysis",
  analyzeSelectedRepository,
);

/*
 * Delete conversation
 */
router.delete(
  "/sessions/:sessionId",
  clearAgentSession,
);

router.post(
  "/sessions/:sessionId/pull-requests/:pullNumber/review",
  reviewSelectedPullRequest,
);

router.post(
  "/sessions/:sessionId/issues/:issueNumber/analyze",
  analyzeSelectedIssue,
);

router.post(
  "/sessions/:sessionId/actions/runs/:runId/debug",
  debugSelectedWorkflowRun,
);

router.post(
  "/sessions/:sessionId/actions/runs/:runId/auto-fix",
  prepareSelectedWorkflowAutoFix,
);

/*
 * Request GitHub mutation.
 */
router.post(
  "/sessions/:sessionId/github/write",
  requestWrite,
);

/*
 * Approve / reject pending mutation.
 */
router.post(
  "/github/approvals/:approvalId/decision",
  decideWriteApproval,
);

/*
 * Chat
 */
router.post(
  "/chat",
  chatWithAgent,
);

export default router;
