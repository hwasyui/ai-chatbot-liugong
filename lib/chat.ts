import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt } from "@/lib/prompt";
import type { ChatMessage } from "@/lib/types";

// sends the conversation to gemini and returns its reply as plain text
export async function generateReply(history: ChatMessage[], userMessage: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const model = process.env.GEMINI_MODEL;
  if (!model) throw new Error("GEMINI_MODEL is not set (see .env.example for the options)");

  const ai = new GoogleGenAI({ apiKey });

  const contents = [
    ...history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const response = await ai.models.generateContent({
    model,
    contents,
    config: { systemInstruction: buildSystemPrompt(), temperature: 0.2 },
  });

  return (response.text ?? "").trim();
}
