import { callGroqChat } from "@/lib/groq-client";
import type { ChatMessage } from "@/lib/types";

// import { getGeminiClient } from "@/lib/gemini-client";
//
// export async function rewriteQuery(history: ChatMessage[], question: string): Promise<string> {
//   if (history.length === 0) return question;
//
//   const model = process.env.GEMINI_MODEL;
//   if (!model) throw new Error("GEMINI_MODEL is not set (see README)");
//
//   const transcript = history.map((msg) => `${msg.role}: ${msg.content}`).join("\n");
//   const prompt = `Conversation so far:\n${transcript}\n\nFollow-up question: ${question}\n\nRewrite the follow-up question as a standalone question that includes all context needed to understand it on its own. Keep it in the same language as the follow-up question. Reply with ONLY the rewritten question, nothing else.`;
//
//   const response = await getGeminiClient().models.generateContent({
//     model,
//     contents: prompt,
//     config: { temperature: 0 },
//   });
//
//   return (response.text ?? "").trim() || question;
// }

// turns a follow-up question into a standalone one using groq, based on the chat history
export async function rewriteQuery(history: ChatMessage[], question: string): Promise<string> {
  if (history.length === 0) return question;

  const transcript = history.map((msg) => `${msg.role}: ${msg.content}`).join("\n");

  const prompt = `Conversation so far:\n${transcript}\n\nFollow-up question: ${question}\n\nRewrite the follow-up question as a standalone question that includes all context needed to understand it on its own. Keep it in the same language as the follow-up question. Reply with ONLY the rewritten question, nothing else.`;

  const rewritten = await callGroqChat([{ role: "user", content: prompt }], 0);

  return rewritten || question;
}
