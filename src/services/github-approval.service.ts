import {
  randomUUID,
} from "node:crypto";

import {
  getGitHubApprovalsCollection,
} from "../config/mongodb.js";


export const createPendingApproval =
  async (
    sessionId:
      string,

    serializedState:
      string,
  ) => {

    const approvalId =
      randomUUID();

    const now =
      new Date();

    const approval = {
      _id:
        approvalId,

      approvalId,

      sessionId,

      serializedState,

      status:
        "PENDING" as const,

      createdAt:
        now,

      updatedAt:
        now,
    };

    await getGitHubApprovalsCollection()
      .insertOne(
        approval,
      );

    return approval;
  };


export const getPendingApproval =
  async (
    approvalId:
      string,
  ) => {

    return getGitHubApprovalsCollection()
      .findOne({
        _id:
          approvalId,

        status:
          "PENDING",
      });
  };


export const updatePendingApproval =
  async (
    approvalId:
      string,

    serializedState:
      string,
  ) => {

    const result =
      await getGitHubApprovalsCollection()
        .updateOne(
          {
            _id:
              approvalId,

            status:
              "PENDING",
          },

          {
            $set: {
              serializedState,

              updatedAt:
                new Date(),
            },
          },
        );

    return (
      result.matchedCount >
      0
    );
  };


export const completePendingApproval =
  async (
    approvalId:
      string,
  ) => {

    await getGitHubApprovalsCollection()
      .updateOne(
        {
          _id:
            approvalId,
        },

        {
          $set: {
            status:
              "COMPLETED",

            updatedAt:
              new Date(),
          },
        },
      );
  };


export const rejectPendingApproval =
  async (
    approvalId:
      string,
  ) => {

    await getGitHubApprovalsCollection()
      .updateOne(
        {
          _id:
            approvalId,
        },

        {
          $set: {
            status:
              "REJECTED",

            updatedAt:
              new Date(),
          },
        },
      );
  };


export const failPendingApproval =
  async (
    approvalId:
      string,
  ) => {

    await getGitHubApprovalsCollection()
      .updateOne(
        {
          _id:
            approvalId,
        },

        {
          $set: {
            status:
              "FAILED",

            updatedAt:
              new Date(),
          },
        },
      );
  };
