import { getSupabaseClient } from "@/lib/supabase";
import type { ChatMessage, Role } from "@/lib/types";

const TABLE = "liugong_rag_chat_messages";

type MessageRow = { id: string; session_id: string; role: Role; content: string; created_at: string };

// loads every saved message for a session, oldest first
export async function getMessages(sessionId: string): Promise<ChatMessage[]> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE)
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`failed to load chat history: ${error.message}`);

  return ((data ?? []) as MessageRow[]).map((row) => ({ id: row.id, role: row.role, content: row.content, createdAt: row.created_at }));
}

// appends new messages to a session's saved history
export async function saveMessages(sessionId: string, newMessages: ChatMessage[]): Promise<void> {
  const rows: MessageRow[] = newMessages.map((message) => ({ id: message.id, session_id: sessionId, role: message.role, content: message.content, created_at: message.createdAt }));

  const { error } = await getSupabaseClient().from(TABLE).insert(rows);
  if (error) throw new Error(`failed to save chat history: ${error.message}`);
}
