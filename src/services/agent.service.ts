import {
  Runner,
} from "@openai/agents";

import {
  gitArchitectAgent,
} from "../agents/gitArchitect.agent.js";

import {
  createSession,
  getSession,
  getSessionRepository,
} from "./session.service.js";

import type {
  GitArchitectContext,
} from "../types/agent-context.js";

const runner =
  new Runner();

interface ChatResult {
  sessionId: string;

  response: string;
}

export const chatWithGitArchitect =
  async (
    message: string,
    sessionId?: string,
  ): Promise<ChatResult> => {
    let session;

    let activeSessionId;

    if (sessionId) {
      session =
        getSession(
          sessionId,
        );

      if (!session) {
        throw new Error(
          "SESSION_NOT_FOUND",
        );
      }

      activeSessionId =
        sessionId;
    } else {
      const created =
        createSession();

      session =
        created.session;

      activeSessionId =
        created.sessionId;
    }

    const repository =
      getSessionRepository(
        activeSessionId,
      );

    const context:
      GitArchitectContext = {
        repository,
      };

    const result =
      await runner.run(
        gitArchitectAgent,
        message,
        {
          session,

          context,
        },
      );

    return {
      sessionId:
        activeSessionId,

      response:
        result.finalOutput ??
        "GitArchitect was unable to generate a response.",
    };
  };