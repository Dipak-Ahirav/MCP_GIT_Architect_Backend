import {
  Router,
} from "express";

import {
  getGitHubAuthStatus,
} from "../controllers/github.controller.js";

const router =
  Router();

router.get(
  "/auth/status",
  getGitHubAuthStatus,
);

export default router;