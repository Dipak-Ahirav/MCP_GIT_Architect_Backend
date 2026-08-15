import "dotenv/config";

import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import agentRoutes from "./routes/agent.routes.js";
import githubRoutes from "./routes/github.routes.js";
import {
  connectMongoDB,
  closeMongoDB,
} from "./config/mongodb.js";

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

app.use(
  "/api/v1/github",
  githubRoutes,
);

// app.listen(env.PORT, () => {
//   console.log(
//     `🚀 GitArchitect API running on port ${env.PORT}`,
//   );

//   console.log(
//     `🤖 OpenAI configuration loaded successfully`,
//   );
// });

const startServer =
  async () => {

    try {

      await connectMongoDB();

      app.listen(
        env.PORT,
        () => {

          console.log(
            `🚀 GitArchitect API running on port ${env.PORT}`,
          );

          console.log(
            "🤖 GitArchitect Agent ready",
          );
        },
      );

    } catch (
      error
    ) {

      console.error(
        "❌ Failed to start GitArchitect:",
        error,
      );

      process.exit(1);
    }
  };


const shutdown =
  async () => {

    console.log(
      "🛑 Shutting down GitArchitect...",
    );

    await closeMongoDB();

    process.exit(0);
  };


process.on(
  "SIGINT",
  shutdown,
);

process.on(
  "SIGTERM",
  shutdown,
);


void startServer();