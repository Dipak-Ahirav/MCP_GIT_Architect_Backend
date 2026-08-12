import { z } from "zod";

export const repositoryDiscoverySchema =
  z.object({
    repositoryPurpose:
      z.string(),

    projectType:
      z.enum([
        "frontend",
        "backend",
        "fullstack",
        "library",
        "monorepo",
        "cli",
        "mobile",
        "infrastructure",
        "unknown",
      ]),

    languages:
      z.array(z.string()),

    frameworks:
      z.array(z.string()),

    runtimes:
      z.array(z.string()),

    packageManagers:
      z.array(z.string()),

    buildTools:
      z.array(z.string()),

    testingTools:
      z.array(z.string()),

    databases:
      z.array(z.string()),

    stateManagement:
      z.array(z.string()),

    ciPlatforms:
      z.array(z.string()),

    sourceRoots:
      z.array(z.string()),

    testRoots:
      z.array(z.string()),

    importantFiles:
      z.array(
        z.object({
          path: z.string(),

          purpose: z.string(),
        }),
      ),

    importantDirectories:
      z.array(
        z.object({
          path: z.string(),

          purpose: z.string(),
        }),
      ),

    architectureHints:
      z.array(z.string()),

    evidenceFiles:
      z.array(z.string()),

    limitations:
      z.array(z.string()),
  });

export type RepositoryDiscovery =
  z.infer<
    typeof repositoryDiscoverySchema
  >;