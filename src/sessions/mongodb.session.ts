import type {
  AgentInputItem,
  Session,
} from "@openai/agents-core";

import type {
  Document,
} from "mongodb";

import {
  getAgentSessionsCollection,
  getSessionItemsCollection,
} from "../config/mongodb.js";


export class MongoDBSession
  implements Session {

  constructor(
    private readonly sessionId:
      string,
  ) {}


  async getSessionId():
    Promise<string> {
    return this.sessionId;
  }


  /*
   * ========================================
   * GET CONVERSATION HISTORY
   * ========================================
   */

  async getItems(
    limit?: number,
  ): Promise<
    AgentInputItem[]
  > {

    if (
      limit !== undefined &&
      limit <= 0
    ) {
      return [];
    }

    const collection =
      getSessionItemsCollection();

    /*
     * Entire conversation
     */
    if (
      limit === undefined
    ) {
      const items =
        await collection
          .find({
            sessionId:
              this.sessionId,
          })
          .sort({
            sequence: 1,
          })
          .toArray();

      return items.map(
        (entry) =>
          structuredClone(
            entry.item,
          ) as unknown as
            AgentInputItem,
      );
    }

    /*
     * Get most recent N items.
     */
    const items =
      await collection
        .find({
          sessionId:
            this.sessionId,
        })
        .sort({
          sequence: -1,
        })
        .limit(limit)
        .toArray();

    return items
      .reverse()
      .map(
        (entry) =>
          structuredClone(
            entry.item,
          ) as unknown as
            AgentInputItem,
      );
  }


  /*
   * ========================================
   * ADD CONVERSATION ITEMS
   * ========================================
   */

  async addItems(
    items:
      AgentInputItem[],
  ): Promise<void> {

    if (
      items.length === 0
    ) {
      return;
    }

    const sessions =
      getAgentSessionsCollection();

    const sessionItems =
      getSessionItemsCollection();

    /*
     * Atomically reserve sequence numbers
     * for these items.
     */
    const session =
      await sessions
        .findOneAndUpdate(
          {
            _id:
              this.sessionId,
          },

          {
            $inc: {
              nextItemSequence:
                items.length,
            },

            $set: {
              updatedAt:
                new Date(),
            },
          },

          {
            returnDocument:
              "after",
          },
        );

    if (!session) {
      throw new Error(
        "SESSION_NOT_FOUND",
      );
    }

    const endSequence =
      session
        .nextItemSequence;

    const startSequence =
      endSequence -
      items.length +
      1;

    await sessionItems
      .insertMany(
        items.map(
          (
            item,
            index,
          ) => ({
            sessionId:
              this.sessionId,

            sequence:
              startSequence +
              index,

            /*
             * Convert SDK object into
             * plain persistable data.
             */
            item:
              JSON.parse(
                JSON.stringify(
                  item,
                ),
              ) as Document,

            createdAt:
              new Date(),
          }),
        ),
      );
  }


  /*
   * ========================================
   * POP LAST CONVERSATION ITEM
   * ========================================
   */

  async popItem():
    Promise<
      AgentInputItem |
      undefined
    > {

    const collection =
      getSessionItemsCollection();

    const lastItem =
      await collection
        .findOne(
          {
            sessionId:
              this.sessionId,
          },

          {
            sort: {
              sequence: -1,
            },
          },
        );

    if (!lastItem) {
      return undefined;
    }

    await collection
      .deleteOne({
        _id:
          lastItem._id,
      });

    return structuredClone(
      lastItem.item,
    ) as unknown as
      AgentInputItem;
  }


  /*
   * ========================================
   * CLEAR CONVERSATION
   * ========================================
   */

  async clearSession():
    Promise<void> {

    const items =
      getSessionItemsCollection();

    const sessions =
      getAgentSessionsCollection();

    await items
      .deleteMany({
        sessionId:
          this.sessionId,
      });

    await sessions
      .updateOne(
        {
          _id:
            this.sessionId,
        },

        {
          $set: {
            nextItemSequence:
              0,

            updatedAt:
              new Date(),
          },
        },
      );
  }
}