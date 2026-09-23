export type Role = "user" | "assistant";
export type ChatMessage = { id: string; role: Role; content: string; createdAt: string };
export type ChatRequest = { sessionId: string; message: string };
export type ChatResponse = { reply: ChatMessage };
export type HistoryResponse = { messages: ChatMessage[] };
export type ErrorResponse = { error: string };
