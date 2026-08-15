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
  sessionId:
    string;

  response:
    string;
}

export const chatWithGitArchitect =
  async (
    message:
      string,

    sessionId?:
      string,
  ): Promise<ChatResult> => {

    let session;

    let activeSessionId:
      string;

    /*
     * ===================================
     * Existing session
     * ===================================
     */

    if (sessionId) {

      session =
        await getSession(
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

      /*
       * ===================================
       * New session
       * ===================================
       */

      const created =
        await createSession();

      session =
        created.session;

      activeSessionId =
        created.sessionId;
    }

    /*
     * ===================================
     * Repository context
     * ===================================
     */

    const repository =
      await getSessionRepository(
        activeSessionId,
      );

    const context:
      GitArchitectContext = {
        repository,
      };

    /*
     * Temporary safety check.
     *
     * You can remove this later.
     */

    if (
      typeof session.getItems
      !== "function"
    ) {
      console.error(
        "Invalid session passed to Runner:",
        session,
      );

      throw new Error(
        "INVALID_SESSION_OBJECT",
      );
    }

    /*
     * ===================================
     * Run GitArchitect
     * ===================================
     */

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