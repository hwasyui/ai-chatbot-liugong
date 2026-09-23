import { getGeminiClient } from "@/lib/gemini-client";

export const EMBEDDING_DIMENSIONS = 768;

// turns a piece of text into a 768-number vector using gemini's embedding model
export async function embedText(text: string, taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY"): Promise<number[]> {
  const model = process.env.GEMINI_EMBEDDING_MODEL;
  if (!model) throw new Error("GEMINI_EMBEDDING_MODEL is not set (see README)");

  const response = await getGeminiClient().models.embedContent({
    model,
    contents: [text],
    config: { taskType, outputDimensionality: EMBEDDING_DIMENSIONS },
  });

  const values = response.embeddings?.[0]?.values;
  if (!values) throw new Error("embedding response was empty");

  return values;
}
