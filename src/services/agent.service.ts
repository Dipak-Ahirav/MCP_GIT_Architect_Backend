import { run } from "@openai/agents";

import { gitArchitectAgent } from "../agents/gitArchitect.agent.js";

export const chatWithGitArchitect = async (
  message: string,
): Promise<string> => {
  const result = await run(
    gitArchitectAgent,
    message,
  );

  return (
    result.finalOutput ??
    "GitArchitect was unable to generate a response."
  );
};