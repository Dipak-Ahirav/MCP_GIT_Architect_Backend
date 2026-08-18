import {
  resolveSrv,
} from "node:dns/promises";

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

const mongodbSrvPrefix =
  "mongodb+srv://";

const srvLookupTimeoutMs =
  5000;


const isDnsSrvFailure =
  (
    error:
      unknown,
  ) =>
    error instanceof Error &&
    "code" in error &&
    (
      error.code === "ECONNREFUSED" ||
      error.code === "ENOTFOUND" ||
      error.code === "ETIMEOUT" ||
      error.code === "ESERVFAIL"
    );


const getSrvLookupHost =
  (
    uri:
      string,
  ) => {
    const parsedUri =
      new URL(
        uri,
      );

    return `_mongodb._tcp.${parsedUri.hostname}`;
  };


const createTimeoutError =
  (
    message:
      string,
  ) =>
    Object.assign(
      new Error(
        message,
      ),
      {
        code:
          "ETIMEOUT",
      },
    );


const assertSrvDnsReachable =
  async (
    uri:
      string,
  ) => {
    if (
      !uri.startsWith(
        mongodbSrvPrefix,
      )
    ) {
      return;
    }

    const lookupHost =
      getSrvLookupHost(
        uri,
      );

    let timeout:
      NodeJS.Timeout | undefined;

    try {
      await Promise.race([
        resolveSrv(
          lookupHost,
        ),

        new Promise<never>(
          (
            _resolve,
            reject,
          ) => {
            timeout =
              setTimeout(
                () =>
                  reject(
                    createTimeoutError(
                      `MongoDB SRV DNS lookup timed out for ${lookupHost}`,
                    ),
                  ),
                srvLookupTimeoutMs,
              );
          },
        ),
      ]);
    } finally {
      if (timeout) {
        clearTimeout(
          timeout,
        );
      }
    }
  };


const shouldTryLocalFallback =
  (
    error:
      unknown,
  ) =>
    env.NODE_ENV === "development" &&
    env.MONGODB_URI.startsWith(
      mongodbSrvPrefix,
    ) &&
    isDnsSrvFailure(
      error,
    );


const createClient =
  (
    uri:
      string,
  ) =>
    new MongoClient(
      uri,
      {
        serverSelectionTimeoutMS:
          8000,
      },
    );


const connectWithUri =
  async (
    uri:
      string,
  ) => {
    await assertSrvDnsReachable(
      uri,
    );

    const mongoClient =
      createClient(
        uri,
      );

    await mongoClient.connect();

    return mongoClient;
  };


export const connectMongoDB =
  async () => {
    if (database) {
      return database;
    }

    try {
      client =
        await connectWithUri(
          env.MONGODB_URI,
        );
    } catch (
      error
    ) {
      if (
        !shouldTryLocalFallback(
          error,
        )
      ) {
        throw error;
      }

      console.warn(
        "MongoDB Atlas SRV DNS lookup failed. Falling back to local MongoDB for development.",
      );

      console.warn(
        `Fallback URI: ${env.MONGODB_LOCAL_FALLBACK_URI}`,
      );

      try {
        client =
          await connectWithUri(
            env.MONGODB_LOCAL_FALLBACK_URI,
          );
      } catch (
        fallbackError
      ) {
        throw new Error(
          [
            "MongoDB connection failed.",
            "Atlas SRV DNS lookup was refused, and the local fallback did not connect.",
            "Start a local MongoDB server or replace MONGODB_URI with a non-SRV mongodb:// URI.",
            `Local fallback URI: ${env.MONGODB_LOCAL_FALLBACK_URI}`,
          ].join(
            " ",
          ),
          {
            cause:
              fallbackError,
          },
        );
      }
    }

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
