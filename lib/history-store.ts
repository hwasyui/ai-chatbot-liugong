import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ChatMessage, Role } from "@/lib/types";

const TABLE = "liugong_chat_messages";

type MessageRow = { id: string; session_id: string; role: Role; content: string; created_at: string };

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_KEY must be set (see .env.example)");

  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

// loads every saved message for a session, oldest first
export async function getMessages(sessionId: string): Promise<ChatMessage[]> {
  const { data, error } = await getClient()
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

  const { error } = await getClient().from(TABLE).insert(rows);
  if (error) throw new Error(`failed to save chat history: ${error.message}`);
}
