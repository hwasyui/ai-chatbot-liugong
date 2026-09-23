import AssistantAvatar from "@/components/assistant-avatar";
import type { ChatMessage } from "@/lib/types";

type MessageBubbleProps = { message: ChatMessage };

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const time = new Date(message.createdAt).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit",});

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <AssistantAvatar />}

      <div className={`flex min-w-0 max-w-[80%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <span className="sr-only">{isUser ? "You said:" : "Assistant said:"}</span>

        <div
          className={`min-w-0 max-w-full whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
            isUser
              ? "rounded-br-md bg-indigo-600 text-white"
              : "rounded-bl-md bg-slate-100 text-slate-900"
          }`}
        >
          {message.content}
        </div>

        <span className="mt-1 px-1 text-xs text-slate-500">{time}</span>
      </div>
    </div>
  );
}
