import {
  MemorySession,
} from "@openai/agents";

import {
  randomUUID,
} from "node:crypto";

import type {
  RepositoryContext,
} from "../types/agent-context.js";

interface SessionRecord {
  sessionId: any;

  session: MemorySession;

  repository?: RepositoryContext;
}

const sessions =
  new Map<
    string,
    SessionRecord
  >();

export const createSession =
  (): SessionRecord => {
    const sessionId =
      randomUUID();

    const session =
      new MemorySession({
        sessionId,
      });

    const record: SessionRecord = {
      sessionId,
      session,
    };

    sessions.set(
      sessionId,
      record,
    );

    return record;
  };

export const getSession = (
  sessionId: any,
) => {
  return sessions.get(
    sessionId,
  )?.session;
};

export const getSessionRecord = (
  sessionId: any,
) => {
  return sessions.get(
    sessionId,
  );
};

export const setSessionRepository =
  (
    sessionId: any,
    repository: RepositoryContext,
  ) => {
    const record =
      sessions.get(
        sessionId,
      );

    if (!record) {
      return false;
    }

    record.repository =
      repository;

    return true;
  };

export const getSessionRepository =
  (
    sessionId: any,
  ) => {
    return sessions.get(
      sessionId,
    )?.repository;
  };

export const clearSessionRepository =
  (
    sessionId: any,
  ) => {
    const record =
      sessions.get(
        sessionId,
      );

    if (!record) {
      return false;
    }

    delete record.repository;

    return true;
  };

export const deleteSession =
  async (
    sessionId: any,
  ) => {
    const record =
      sessions.get(
        sessionId,
      );

    if (!record) {
      return false;
    }

    await record.session
      .clearSession();

    sessions.delete(
      sessionId,
    );

    return true;
  };