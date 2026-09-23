import AssistantAvatar from "@/components/assistant-avatar";

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2" role="status">
      <AssistantAvatar />

      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-4">
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 motion-reduce:animate-none" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms] motion-reduce:animate-none" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms] motion-reduce:animate-none" />
      </div>

      <span className="sr-only">The assistant is typing</span>
    </div>
  );
}
