import { generateReply } from "@/lib/chat";
import { getMessages, saveMessages } from "@/lib/history-store";
import { errorResponse } from "@/lib/http";
import { createMessage } from "@/lib/message";
import { MAX_MESSAGE_LENGTH, isValidSessionId } from "@/lib/validation";
import type { ChatResponse } from "@/lib/types";

const HISTORY_LIMIT = 10;

// handles a chat message: validates, asks groq for a reply, saves, and sends it back
export async function POST(request: Request) {
  let body: { sessionId?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("We couldn't read your request. Please try again.", 400);
  }

  const { sessionId, message } = body;

  if (typeof sessionId !== "string" || !isValidSessionId(sessionId)) {
    return errorResponse("Your session is invalid. Please refresh the page.", 400);
  }
  if (typeof message !== "string" || message.trim() === "") {
    return errorResponse("Please type a message first.", 400);
  }

  const text = message.trim();
  if (text.length > MAX_MESSAGE_LENGTH) {
    return errorResponse(`Your message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`, 400);
  }

  try {
    const history = await getMessages(sessionId);

    const replyText = await generateReply(history.slice(-HISTORY_LIMIT), text);

    if (!replyText) return errorResponse("The assistant couldn't come up with an answer. Please try again.", 502);

    const userMessage = createMessage("user", text);
    const reply = createMessage("assistant", replyText);

    try {
      await saveMessages(sessionId, [userMessage, reply]);
    } catch (saveError) {
      console.error("failed to save chat history:", saveError);
    }

    const response: ChatResponse = { reply };
    return Response.json(response);
  } catch (error) {
    console.error("chat request failed:", error);

    const status = (error as { status?: number }).status;
    if (status === 429 || status === 503) {
      return errorResponse("The assistant is very busy right now. Please wait a moment and try again.", 503);
    }

    return errorResponse("Something went wrong on our side. Please try again.", 500);
  }
}
