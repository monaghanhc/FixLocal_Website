import { aiResultSchema } from "@/lib/validators/report";
import type { AIProvider, AIReportInput, AIReportResult } from "./types";
import { mockProvider } from "./mockProvider";
import { openaiProvider } from "./openaiProvider";

function providerForEnvironment(): AIProvider {
  return process.env.OPENAI_API_KEY ? openaiProvider : mockProvider;
}

export async function analyzeIssue(input: AIReportInput): Promise<AIReportResult> {
  const provider = providerForEnvironment();

  try {
    const result = await provider.analyzeAndGenerate(input);
    return aiResultSchema.parse(result);
  } catch (error) {
    console.warn(`AI provider failed, falling back to mock provider: ${String(error)}`);
    return mockProvider.analyzeAndGenerate(input);
  }
}
