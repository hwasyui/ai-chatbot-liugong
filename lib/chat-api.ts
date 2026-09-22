import type {
  ChatMessage,
  ChatResponse,
  ErrorResponse,
  HistoryResponse,
} from "@/lib/types";

const NETWORK_ERROR =
  "We couldn't reach the server. Please check your internet connection and try again.";
const GENERIC_ERROR = "Something went wrong. Please try again.";

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as Partial<ErrorResponse>;
    return data.error || GENERIC_ERROR;
  } catch {
    return GENERIC_ERROR;
  }
}

export async function sendMessage(
  sessionId: string,
  message: string
): Promise<ChatMessage> {
  let response: Response;

  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message }),
    });
  } catch {
    throw new Error(NETWORK_ERROR);
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  let data: Partial<ChatResponse>;
  try {
    data = await response.json();
  } catch {
    throw new Error(GENERIC_ERROR);
  }

  if (!data.reply || !data.reply.content) {
    throw new Error("We got an empty answer. Please try again.");
  }

  return data.reply;
}

export async function loadHistory(sessionId: string): Promise<ChatMessage[]> {
  try {
    const response = await fetch(
      `/api/history?sessionId=${encodeURIComponent(sessionId)}`
    );
    if (!response.ok) return [];

    const data = (await response.json()) as Partial<HistoryResponse>;
    return data.messages ?? [];
  } catch {
    return [];
  }
}
