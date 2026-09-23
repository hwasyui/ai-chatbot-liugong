import { isValidSessionId } from "@/lib/validation";

const STORAGE_KEY = "acme-chat-session-id";

// gets the saved session id, or makes a new one if there isn't one
export function getSessionId(): string {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && isValidSessionId(saved)) return saved;
  } catch {
  }
  return createNewSessionId();
}

// creates and saves a fresh session id
export function createNewSessionId(): string {
  const id = crypto.randomUUID();
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
  }
  return id;
}
