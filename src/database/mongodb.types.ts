import type {
  Document,
} from "mongodb";

import type {
  RepositoryContext,
} from "../types/agent-context.js";

export interface AgentSessionDocument
  extends Document {
  _id: string;

  nextItemSequence:
    number;

  repository?:
    RepositoryContext;

  createdAt:
    Date;

  updatedAt:
    Date;
}

export interface SessionItemDocument
  extends Document {
  sessionId:
    string;

  sequence:
    number;

  item:
    Document;

  createdAt:
    Date;
}

export type ApprovalStatus =
  | "PENDING"
  | "COMPLETED"
  | "REJECTED"
  | "FAILED";

export interface GitHubApprovalDocument
  extends Document {
  _id:
    string;

  sessionId:
    string;

  serializedState:
    string;

  status:
    ApprovalStatus;

  createdAt:
    Date;

  updatedAt:
    Date;
}