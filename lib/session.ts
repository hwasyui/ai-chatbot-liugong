import { isValidSessionId } from "@/lib/validation";

const STORAGE_KEY = "acme-chat-session-id";

export function getSessionId(): string {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && isValidSessionId(saved)) return saved;
  } catch {
  }
  return createNewSessionId();
}

export function createNewSessionId(): string {
  const id = crypto.randomUUID();
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
  }
  return id;
}
