import "dotenv/config";

import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "GitArchitect API is running",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use(
  "/api/v1/agent",
  agentRoutes,
);

app.listen(env.PORT, () => {
  console.log(
    `🚀 GitArchitect API running on port ${env.PORT}`,
  );

  console.log(
    `🤖 OpenAI configuration loaded successfully`,
  );
});