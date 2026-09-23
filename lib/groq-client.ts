const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

type GroqMessage = { role: "system" | "user" | "assistant"; content: string };

// sends a chat completion request to groq and returns the reply text
export async function callGroqChat(messages: GroqMessage[], temperature: number): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  const model = process.env.GROQ_MODEL;
  if (!model) throw new Error("GROQ_MODEL is not set (see README for the options)");

  const response = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, temperature }),
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`groq request failed: ${response.status} ${body}`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return (data.choices?.[0]?.message?.content ?? "").trim();
}
