"use client";

import { useState } from "react";
import { MAX_MESSAGE_LENGTH } from "@/lib/validation";

type ChatInputProps = { onSend: (text: string) => void; disabled: boolean };

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const canSend = text.trim().length > 0 && !disabled;
  const isNearLimit = text.length > MAX_MESSAGE_LENGTH - 100;

  function submit() {
    if (!canSend) return;
    onSend(text);
    setText("");
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="flex items-end gap-2"
    >
      <div className="relative flex-1">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit();
            }
          }}
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          aria-label="Type your question"
          placeholder="Type your question here..."
          className="block max-h-32 min-h-12 w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 [field-sizing:content] placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        {isNearLimit && (
          <span className="absolute -top-5 right-2 text-xs text-slate-500">
            {text.length}/{MAX_MESSAGE_LENGTH}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
}
