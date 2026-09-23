# Acme Assistant (RAG)

Technical Test Assignment: IT Specialist Position. It is a chatbot that answers questions from a company FAQ using Retrieval-Augmented Generation: the FAQ is embedded into vectors with Supabase pgvector, retrieved per question, and answered through Groq. It only answers from what it retrieves, and says so when it does not know something.

**Live demo:** https://ai-chatbot-liugong-rag.vercel.app/

## Notes

I understand that context injection, putting all the FAQ data into the prompt, is actually a much simpler and better choice in this case since the FAQ file (`company_faq.json`) only has less than 20 entries.

However, since this is a technical test, I believe it's better to show the RAG approach too, as a demonstration of scalability once the FAQ data grows. The `main` and `rag` branches here are the RAG version of the technical test AI chatbot.

To check the context injection version, visit the [`context-injection`](https://github.com/hwasyui/ai-chatbot-liugong/tree/context-injection) branch, or try the [live version](https://ai-chatbot-liugong-context.vercel.app/).

## Tech stack

- Next.js 16 (App Router) and React, both frontend and backend in one project
- TypeScript, Tailwind CSS
- Groq for chat replies and query rewriting
- Google Gemini for embeddings
- Supabase (Postgres + pgvector) for vector search and chat history

## How it works

**Setting up the knowledge base** (once, or whenever the FAQ changes): `scripts/ingest.mjs` embeds each FAQ question/answer pair with Gemini and stores it in `liugong_rag_faq_chunks` (pgvector).

**Answering a question** (every message):

1. `lib/rewrite.ts` turns a follow-up question into a standalone one using the chat history, via Groq.
2. `lib/embeddings.ts` embeds that standalone question with Gemini.
3. `lib/retrieval.ts` finds the closest FAQ chunks in Supabase.
4. Only those matched chunks (not the whole FAQ) go into the system prompt sent to Groq for the final answer.

Gemini handles embeddings and Groq handles chat and rewriting: Groq has no embedding API, and its free tier allows far more chat requests per minute than Gemini's.

## Setup

1. `npm install`
2. Create a Supabase project (pgvector is built in) and run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor.
3. `cp .env.example .env.local` and fill in the values.
4. `npm run ingest` to embed the FAQ into Supabase.
5. `npm run dev`

## Environment variables

| Variable | What it is |
| --- | --- |
| `GEMINI_API_KEY` | Free key from Google AI Studio, used for embeddings |
| `GEMINI_EMBEDDING_MODEL` | Which Gemini embedding model to use |
| `GROQ_API_KEY` | Free key from Groq, used for chat and query rewriting |
| `GROQ_MODEL` | Which Groq model to use |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Your Supabase anon key |