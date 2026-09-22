import { getMessages } from "@/lib/history-store";
import { errorResponse } from "@/lib/http";
import { isValidSessionId } from "@/lib/validation";
import type { HistoryResponse } from "@/lib/types";

// returns the saved chat history for one session
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("sessionId");

  if (!sessionId || !isValidSessionId(sessionId)) {
    return errorResponse("Your session is invalid. Please refresh the page.", 400);
  }

  try {
    const messages = await getMessages(sessionId);
    const response: HistoryResponse = { messages };
    return Response.json(response);
  } catch (error) {
    console.error("failed to load chat history:", error);
    return errorResponse("We couldn't load your chat history.", 500);
  }
}
