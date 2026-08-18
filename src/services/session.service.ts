import {
  randomUUID,
} from "node:crypto";

import {
  MongoDBSession,
} from "../sessions/mongodb.session.js";

import {
  getAgentSessionsCollection,
  getSessionItemsCollection,
  getGitHubApprovalsCollection,
} from "../config/mongodb.js";

import type {
  RepositoryContext,
} from "../types/agent-context.js";

const isRepositoryContext =
  (
    repository:
      unknown,
  ): repository is RepositoryContext => {
    if (
      !repository ||
      typeof repository !== "object"
    ) {
      return false;
    }

    const candidate =
      repository as Partial<
        RepositoryContext
      >;

    return (
      typeof candidate.id ===
        "number" &&
      typeof candidate.owner ===
        "string" &&
      candidate.owner.trim()
        .length > 0 &&
      typeof candidate.repo ===
        "string" &&
      candidate.repo.trim()
        .length > 0 &&
      typeof candidate.fullName ===
        "string" &&
      candidate.fullName.trim()
        .length > 0 &&
      typeof candidate.defaultBranch ===
        "string" &&
      candidate.defaultBranch.trim()
        .length > 0 &&
      typeof candidate.isPrivate ===
        "boolean" &&
      typeof candidate.url ===
        "string"
    );
  };


/*
 * ========================================
 * CREATE SESSION
 * ========================================
 */

export const createSession =
  async () => {

    const sessionId =
      randomUUID();

    const collection =
      getAgentSessionsCollection();

    const now =
      new Date();

    await collection
      .insertOne({
        _id:
          sessionId,

        nextItemSequence:
          0,

        createdAt:
          now,

        updatedAt:
          now,
      });

    return {
      sessionId,

      session:
        new MongoDBSession(
          sessionId,
        ),
    };
  };


/*
 * ========================================
 * GET SESSION
 * ========================================
 */

export const getSession =
  async (
    sessionId:
      string,
  ) => {

    const exists =
      await getAgentSessionsCollection()
        .findOne(
          {
            _id:
              sessionId,
          },

          {
            projection: {
              _id: 1,
            },
          },
        );

    if (!exists) {
      return undefined;
    }

    return new MongoDBSession(
      sessionId,
    );
  };


export const getSessionRecord =
  async (
    sessionId:
      string,
  ) => {

    return getAgentSessionsCollection()
      .findOne({
        _id:
          sessionId,
      });
  };


/*
 * ========================================
 * REPOSITORY CONTEXT
 * ========================================
 */

export const setSessionRepository =
  async (
    sessionId:
      string,

    repository:
      RepositoryContext,
  ) => {

    const result =
      await getAgentSessionsCollection()
        .updateOne(
          {
            _id:
              sessionId,
          },

          {
            $set: {
              repository,

              updatedAt:
                new Date(),
            },
          },
        );

    return (
      result.matchedCount > 0
    );
  };


export const getSessionRepository =
  async (
    sessionId:
      string,
  ): Promise<
    RepositoryContext |
    undefined
  > => {

    const session =
      await getAgentSessionsCollection()
        .findOne(
          {
            _id:
              sessionId,
          },

          {
            projection: {
              repository: 1,
            },
          },
        );

    const repository =
      session?.repository;

    if (
      !isRepositoryContext(
        repository,
      )
    ) {
      return undefined;
    }

    return repository;
  };


export const clearSessionRepository =
  async (
    sessionId:
      string,
  ) => {

    const result =
      await getAgentSessionsCollection()
        .updateOne(
          {
            _id:
              sessionId,
          },

          {
            $unset: {
              repository:
                "",
            },

            $set: {
              updatedAt:
                new Date(),
            },
          },
        );

    return (
      result.matchedCount > 0
    );
  };


/*
 * ========================================
 * DELETE SESSION
 * ========================================
 */

export const deleteSession =
  async (
    sessionId:
      string,
  ) => {

    const exists =
      await getSessionRecord(
        sessionId,
      );

    if (!exists) {
      return false;
    }

    /*
     * MongoDB doesn't provide relational
     * cascade deletion, so we clean up
     * the associated documents ourselves.
     */

    await Promise.all([
      getSessionItemsCollection()
        .deleteMany({
          sessionId,
        }),

      getGitHubApprovalsCollection()
        .deleteMany({
          sessionId,
        }),
    ]);

    await getAgentSessionsCollection()
      .deleteOne({
        _id:
          sessionId,
      });

    return true;
  };
