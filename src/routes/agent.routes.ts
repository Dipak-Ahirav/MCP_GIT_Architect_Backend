import {
  Router,
} from "express";

import {
  chatWithAgent,
  clearAgentSession,
} from "../controllers/agent.controller.js";

const router =
  Router();

router.post(
  "/chat",
  chatWithAgent,
);

router.delete(
  "/sessions/:sessionId",
  clearAgentSession,
);

export default router;