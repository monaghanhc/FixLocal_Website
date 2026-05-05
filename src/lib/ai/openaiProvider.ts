import { readFile } from "fs/promises";
import path from "path";
import OpenAI from "openai";
import type { AIProvider, AIReportInput, AIReportResult } from "./types";

function imageMime(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function imageDataUrl(imagePath: string) {
  const safeRelative = imagePath.replace(/^\/+/, "");
  const absolutePath = path.join(process.cwd(), "public", safeRelative);
  const bytes = await readFile(absolutePath);
  return `data:${imageMime(absolutePath)};base64,${bytes.toString("base64")}`;
}

export const openaiProvider: AIProvider = {
  name: "openai",
  async analyzeAndGenerate(input: AIReportInput): Promise<AIReportResult> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const dataUrl = await imageDataUrl(input.imagePath);

    const prompt = `Analyze this local issue report and return strict JSON with:
{
  "analysis": {
    "detectedIssueType": string,
    "severity": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    "confidenceScore": number from 0 to 1,
    "missingDetails": string[],
    "suggestedResponsibleParty": string
  },
  "messages": {
    "subjectLine": string,
    "formalEmail": string,
    "smsMessage": string,
    "printableReport": string,
    "followUpMessage": string
  }
}

Use professional, concise, non-legal language. Mention that the photo is available. Do not claim certainty from the image.

Report input:
${JSON.stringify(input, null, 2)}`;

    const completion = await client.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You generate practical civic issue reports. You are careful, non-legal, and always ask users to review before sending."
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl } }
          ]
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned an empty response.");
    }

    return JSON.parse(content) as AIReportResult;
  }
};
