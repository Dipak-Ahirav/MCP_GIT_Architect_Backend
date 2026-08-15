import {
  MongoClient,
  type Db,
} from "mongodb";

import {
  env,
} from "./env.js";

import type {
  AgentSessionDocument,
  SessionItemDocument,
  GitHubApprovalDocument,
} from "../database/mongodb.types.js";

let client:
  MongoClient | null =
  null;

let database:
  Db | null =
  null;


export const connectMongoDB =
  async () => {
    if (database) {
      return database;
    }

    client =
      new MongoClient(
        env.MONGODB_URI,
      );

    await client.connect();

    database =
      client.db(
        env.MONGODB_DB_NAME,
      );

    await database.command({
      ping: 1,
    });

    /*
     * Create useful indexes.
     */
    const sessionItems =
      getSessionItemsCollection();

    const approvals =
      getGitHubApprovalsCollection();

    await sessionItems
      .createIndex(
        {
          sessionId: 1,
          sequence: 1,
        },
        {
          unique: true,
        },
      );

    await sessionItems
      .createIndex({
        sessionId: 1,
      });

    await approvals
      .createIndex({
        sessionId: 1,
      });

    await approvals
      .createIndex({
        status: 1,
      });

    console.log(
      `🍃 MongoDB connected: ${env.MONGODB_DB_NAME}`,
    );

    return database;
  };


export const getMongoDB =
  () => {
    if (!database) {
      throw new Error(
        "MONGODB_NOT_CONNECTED",
      );
    }

    return database;
  };


export const closeMongoDB =
  async () => {
    if (client) {
      await client.close();

      client = null;
      database = null;
    }
  };


export const getAgentSessionsCollection =
  () =>
    getMongoDB()
      .collection<AgentSessionDocument>(
        "agent_sessions",
      );


export const getSessionItemsCollection =
  () =>
    getMongoDB()
      .collection<SessionItemDocument>(
        "session_items",
      );


export const getGitHubApprovalsCollection =
  () =>
    getMongoDB()
      .collection<GitHubApprovalDocument>(
        "github_approvals",
      );