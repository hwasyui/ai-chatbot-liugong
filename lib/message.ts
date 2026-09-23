import type { ChatMessage, Role } from "@/lib/types";

export function createMessage(role: Role, content: string): ChatMessage {
  return { id: crypto.randomUUID(), role, content, createdAt: new Date().toISOString() };
}
