import {
  randomUUID,
} from "node:crypto";

interface PendingApprovalRecord {
  approvalId:
    string;

  sessionId:
    string;

  serializedState:
    string;

  createdAt:
    string;
}

const approvals =
  new Map<
    string,
    PendingApprovalRecord
  >();

export const createPendingApproval =
  (
    sessionId: string,
    serializedState: string,
  ) => {
    const approvalId =
      randomUUID();

    const record:
      PendingApprovalRecord = {
        approvalId,

        sessionId,

        serializedState,

        createdAt:
          new Date()
            .toISOString(),
      };

    approvals.set(
      approvalId,
      record,
    );

    return record;
  };

export const getPendingApproval =
  (
    approvalId: string,
  ) => {
    return approvals.get(
      approvalId,
    );
  };

export const updatePendingApproval =
  (
    approvalId: string,
    serializedState: string,
  ) => {
    const record =
      approvals.get(
        approvalId,
      );

    if (!record) {
      return false;
    }

    record.serializedState =
      serializedState;

    return true;
  };

export const deletePendingApproval =
  (
    approvalId: string,
  ) => {
    return approvals.delete(
      approvalId,
    );
  };