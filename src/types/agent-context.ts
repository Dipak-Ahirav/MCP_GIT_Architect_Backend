export interface RepositoryContext {
  id: number;

  owner: string;

  repo: string;

  fullName: string;

  defaultBranch: string;

  isPrivate: boolean;

  url: string;

  description: string | null;
}

export interface GitArchitectContext {
  repository?: RepositoryContext;
}