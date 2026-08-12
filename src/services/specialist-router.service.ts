import type {
  RepositoryDiscovery,
} from "../schemas/repository-discovery.schema.js";

export type TechnologySpecialist =
  | "angular"
  | "react"
  | "nodejs"
  | "springboot"
  | "generic";

export const selectTechnologySpecialists =
  (
    discovery:
      RepositoryDiscovery,
  ): TechnologySpecialist[] => {
    const detected =
      [
        ...discovery.frameworks,
        ...discovery.runtimes,
        ...discovery.languages,
      ]
        .join(" ")
        .toLowerCase();

    const specialists =
      new Set<
        TechnologySpecialist
      >();

    if (
      detected.includes(
        "angular",
      )
    ) {
      specialists.add(
        "angular",
      );
    }

    if (
      detected.includes(
        "react",
      ) ||
      detected.includes(
        "next.js",
      ) ||
      detected.includes(
        "nextjs",
      )
    ) {
      specialists.add(
        "react",
      );
    }

    if (
      detected.includes(
        "node",
      ) ||
      detected.includes(
        "express",
      ) ||
      detected.includes(
        "nestjs",
      )
    ) {
      specialists.add(
        "nodejs",
      );
    }

    if (
      detected.includes(
        "spring boot",
      ) ||
      detected.includes(
        "springboot",
      )
    ) {
      specialists.add(
        "springboot",
      );
    }

    if (
      specialists.size === 0
    ) {
      specialists.add(
        "generic",
      );
    }

    return [
      ...specialists,
    ];
  };