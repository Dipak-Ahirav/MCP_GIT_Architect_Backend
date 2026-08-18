import {
  Router,
} from "express";

import {
  getGitHubAuthStatus,
  getGitHubRepositories,
} from "../controllers/github.controller.js";

const router =
  Router();

router.get(
  "/auth/status",
  getGitHubAuthStatus,
);

router.get(
  "/repos",
  getGitHubRepositories,
);

export default router;