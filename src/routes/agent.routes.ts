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

/*
 * Chat
 */
router.post(
  "/chat",
  chatWithAgent,
);

export default router;