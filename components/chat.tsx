"use client";

import { useEffect, useRef, useState } from "react";
import AssistantAvatar from "@/components/assistant-avatar";
import ChatInput from "@/components/chat-input";
import MessageBubble from "@/components/message-bubble";
import SuggestedQuestions from "@/components/suggested-questions";
import TypingIndicator from "@/components/typing-indicator";
import { loadHistory, sendMessage } from "@/lib/chat-api";
import { createMessage } from "@/lib/message";
import { createNewSessionId, getSessionId } from "@/lib/session";
import type { ChatMessage } from "@/lib/types";

type ChatProps = { suggestedQuestions?: string[] };

export default function Chat({ suggestedQuestions = [] }: ChatProps) {
  const sessionIdRef = useRef("");
  const listRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedText, setFailedText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    sessionIdRef.current = getSessionId();
    loadHistory(sessionIdRef.current).then((saved) => {
      if (cancelled) return;
      setMessages(saved);
      setIsLoadingHistory(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, isSending, error]);

  // asks the backend for a reply to the given text and updates state with the result
  async function requestReply(text: string) {
    setIsSending(true);
    setError(null);
    setFailedText(null);

    try {
      const reply = await sendMessage(sessionIdRef.current, text);
      setMessages((previous) => [...previous, reply]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setFailedText(text);
    } finally {
      setIsSending(false);
    }
  }

  // shows the user's message right away, then kicks off requestReply for the ai's answer
  function handleSend(text: string) {
    const cleanText = text.trim();
    if (!cleanText || isSending) return;

    setMessages((previous) => [...previous, createMessage("user", cleanText)]);
    requestReply(cleanText);
  }

  // starts a fresh conversation, old messages stay in the database. which not shown
  function handleNewChat() {
    sessionIdRef.current = createNewSessionId();
    setMessages([]);
    setError(null);
    setFailedText(null);
  }

  const hasMessages = messages.length > 0;
  const showWelcome = !hasMessages && !isLoadingHistory;

  return (
    <main className="flex h-dvh justify-center bg-slate-100 sm:p-6">
      <div className="flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-sm">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <AssistantAvatar size="lg" />
            <div>
              <h1 className="text-base font-semibold text-slate-900">Acme Assistant</h1>
              <p className="text-sm text-slate-500">Guide to Acme Tech Solutions FAQ</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            disabled={!hasMessages || isSending}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New chat
          </button>
        </header>

        <div
          ref={listRef}
          role="log"
          aria-live="polite"
          className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6"
        >
          {isLoadingHistory && (
            <p className="py-10 text-center text-sm text-slate-500">Loading your conversation...</p>
          )}

          {showWelcome && (
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
              <AssistantAvatar size="lg" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">Hi there! How can I help?</h2>
                <p className="text-[15px] leading-relaxed text-slate-600">
                  Ask me about working hours, leave, medical benefits or IT support. Pick a
                  question below or type your own.
                </p>
              </div>
              {suggestedQuestions.length > 0 && (
                <SuggestedQuestions
                  questions={suggestedQuestions}
                  onPick={handleSend}
                  disabled={isSending}
                />
              )}
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isSending && <TypingIndicator />}

          {error && (
            <div
              role="alert"
              className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              <p>{error}</p>
              {failedText && (
                <button
                  type="button"
                  onClick={() => requestReply(failedText)}
                  className="mt-3 rounded-full bg-red-600 px-4 py-1.5 font-medium text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                >
                  Try again
                </button>
              )}
            </div>
          )}
        </div>

        <footer className="border-t border-slate-200 px-4 pb-3 pt-4 sm:px-6">
          <ChatInput onSend={handleSend} disabled={isSending} />
          <p className="mt-2 text-center text-xs text-slate-500">
            Answers come from the company FAQ. For anything important, please double-check with HR.
          </p>
        </footer>
      </div>
    </main>
  );
}
