import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

// creates the gemini client once and reuses it, used for embeddings
export function getGeminiClient(): GoogleGenAI {
  if (client) return client;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  client = new GoogleGenAI({ apiKey });
  return client;
}
