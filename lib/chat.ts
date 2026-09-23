import { callGroqChat } from "@/lib/groq-client";
import { buildSystemPrompt } from "@/lib/prompt";
import type { ChatMessage, FaqChunk } from "@/lib/types";

// import { getGeminiClient } from "@/lib/gemini-client";
//
// export async function generateReply(history: ChatMessage[], userMessage: string, chunks: FaqChunk[]): Promise<string> {
//   const model = process.env.GEMINI_MODEL;
//   if (!model) throw new Error("GEMINI_MODEL is not set (see README)");
//
//   const contents = [
//     ...history.map((msg) => ({ role: msg.role === "assistant" ? "model" : "user", parts: [{ text: msg.content }] })),
//     { role: "user", parts: [{ text: userMessage }] },
//   ];
//
//   const response = await getGeminiClient().models.generateContent({
//     model,
//     contents,
//     config: { systemInstruction: buildSystemPrompt(chunks), temperature: 0.2 },
//   });
//
//   return (response.text ?? "").trim();
// }

// sends the conversation + retrieved faq chunks to groq and returns its reply as plain text
export async function generateReply(history: ChatMessage[], userMessage: string, chunks: FaqChunk[]): Promise<string> {
  const messages = [
    { role: "system" as const, content: buildSystemPrompt(chunks) },
    ...history.map((msg) => ({ role: msg.role, content: msg.content })),
    { role: "user" as const, content: userMessage },
  ];

  return callGroqChat(messages, 0.2);
}
