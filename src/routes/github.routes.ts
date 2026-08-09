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
  "/repositories",
  getGitHubRepositories,
);

export default router;