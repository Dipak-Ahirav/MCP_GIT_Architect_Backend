import {
  Runner,
} from "@openai/agents";

import {
  repositoryDiscoveryAgent,
} from "../agents/repositoryDiscovery.agent.js";

import {
  architectureAnalyzerV2Agent,
} from "../agents/architectureAnalyzerV2.agent.js";

import {
  securityAnalyzerAgent,
} from "../agents/securityAnalyzer.agent.js";

import {
  testingAnalyzerAgent,
} from "../agents/testingAnalyzer.agent.js";

import {
  technologySpecialistAgent,
} from "../agents/technologySpecialist.agent.js";

import {
  repositoryReportAggregatorAgent,
} from "../agents/repositoryReportAggregator.agent.js";

import {
  selectTechnologySpecialists,
} from "./specialist-router.service.js";

import {
  mergeSpecialistScores,
  calculateOverallScore,
} from "./repository-score.service.js";

import {
  getSessionRecord,
  getSessionRepository,
} from "./session.service.js";

import type {
  GitArchitectContext,
} from "../types/agent-context.js";

import type {
  RepositoryIntelligenceContext,
} from "../types/repository-intelligence-context.js";

import type {
  SpecialistAnalysis,
} from "../schemas/specialist-analysis.schema.js";

const runner =
  new Runner();

export const analyzeRepositoryV2 =
  async (
    sessionId: string,
  ) => {
    /*
     * --------------------------------
     * Validate session/repository
     * --------------------------------
     */

    const session =
      getSessionRecord(
        sessionId,
      );

    if (!session) {
      throw new Error(
        "SESSION_NOT_FOUND",
      );
    }

    const repository =
      getSessionRepository(
        sessionId,
      );

    if (!repository) {
      throw new Error(
        "REPOSITORY_NOT_SELECTED",
      );
    }

    /*
     * --------------------------------
     * PHASE 1
     * Repository Discovery
     * --------------------------------
     */

    const discoveryContext:
      GitArchitectContext = {
        repository,
      };

    const discoveryResult =
      await runner.run(
        repositoryDiscoveryAgent,
        `
Discover the technology and structural map of:

${repository.fullName}

Use GitHub MCP and return evidence-based
repository discovery.
`,
        {
          context:
            discoveryContext,

          maxTurns: 15,
        },
      );

    if (
      !discoveryResult.finalOutput
    ) {
      throw new Error(
        "DISCOVERY_FAILED",
      );
    }

    const discovery =
      discoveryResult.finalOutput;

    /*
     * --------------------------------
     * PHASE 2
     * Deterministic routing
     * --------------------------------
     */

    const specialists =
      selectTechnologySpecialists(
        discovery,
      );

    const baseContext:
      RepositoryIntelligenceContext = {
        repository,
        discovery,
      };

    /*
     * --------------------------------
     * PHASE 3
     * Generic specialists
     *
     * These analyses are independent,
     * so run them concurrently.
     * --------------------------------
     */

    const [
      architectureResult,
      securityResult,
      testingResult,
    ] =
      await Promise.all([
        runner.run(
          architectureAnalyzerV2Agent,
          `
Perform the architecture analysis for
${repository.fullName}.
`,
          {
            context:
              baseContext,

            maxTurns: 20,
          },
        ),

        runner.run(
          securityAnalyzerAgent,
          `
Perform the source-level security review for
${repository.fullName}.
`,
          {
            context:
              baseContext,

            maxTurns: 20,
          },
        ),

        runner.run(
          testingAnalyzerAgent,
          `
Analyze the testing strategy for
${repository.fullName}.
`,
          {
            context:
              baseContext,

            maxTurns: 20,
          },
        ),
      ]);

    if (
      !architectureResult.finalOutput ||
      !securityResult.finalOutput ||
      !testingResult.finalOutput
    ) {
      throw new Error(
        "SPECIALIST_ANALYSIS_FAILED",
      );
    }

    /*
     * --------------------------------
     * PHASE 4
     * Technology specialists
     * --------------------------------
     */

    const technologyResults =
      await Promise.all(
        specialists.map(
          async (
            specialist,
          ) => {
            const context:
              RepositoryIntelligenceContext = {
                repository,
                discovery,
                specialist,
              };

            const result =
              await runner.run(
                technologySpecialistAgent,
                `
Perform the ${specialist} specialist review for
${repository.fullName}.

Inspect actual repository evidence before
producing findings.
`,
                {
                  context,

                  maxTurns:
                    20,
                },
              );

            if (
              !result.finalOutput
            ) {
              throw new Error(
                `TECHNOLOGY_ANALYSIS_FAILED:${specialist}`,
              );
            }

            return result.finalOutput;
          },
        ),
      );

    /*
     * --------------------------------
     * PHASE 5
     * Combine specialist outputs
     * --------------------------------
     */

    const allAnalyses:
      SpecialistAnalysis[] = [
        architectureResult.finalOutput,
        securityResult.finalOutput,
        testingResult.finalOutput,
        ...technologyResults,
      ];

    const scores =
      mergeSpecialistScores(
        allAnalyses,
      );

    /*
     * --------------------------------
     * PHASE 6
     * Aggregate report
     * --------------------------------
     */

    const aggregateInput = {
      repository:
        repository.fullName,

      discovery,

      specialistsRun:
        specialists,

      scores,

      specialistAnalyses:
        allAnalyses,
    };

    const aggregateResult =
      await runner.run(
        repositoryReportAggregatorAgent,
        JSON.stringify(
          aggregateInput,
        ),
        {
          maxTurns: 5,
        },
      );

    if (
      !aggregateResult.finalOutput
    ) {
      throw new Error(
        "AGGREGATION_FAILED",
      );
    }

    /*
     * Enforce deterministic scores.
     *
     * Aggregator cannot modify them.
     */
    const analysis = {
      ...aggregateResult.finalOutput,

      scores,
    };

    const overallScore =
      calculateOverallScore(
        scores,
      );

    return {
      engineVersion:
        "v2",

      repository:
        repository.fullName,

      defaultBranch:
        repository.defaultBranch,

      specialistsRun:
        specialists,

      overallScore,

      discovery,

      analysis,
    };
  };