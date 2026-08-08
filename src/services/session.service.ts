import { MemorySession } from "@openai/agents";
import { randomUUID } from "node:crypto";

const sessions = new Map<
  string,
  MemorySession
>();

export const createSession = () => {
  const sessionId = randomUUID();

  const session = new MemorySession({
    sessionId,
  });

  sessions.set(
    sessionId,
    session,
  );

  return {
    sessionId,
    session,
  };
};

export const getSession = (
  sessionId: string,
) => {
  return sessions.get(sessionId);
};

export const deleteSession = async (
  sessionId: any,
) => {
  const session =
    sessions.get(sessionId);

  if (!session) {
    return false;
  }

  await session.clearSession();

  sessions.delete(sessionId);

  return true;
};