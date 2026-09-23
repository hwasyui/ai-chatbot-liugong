# Acme Assistant (RAG)

Technical Test Assignment: IT Specialist Position. A chatbot that answers questions from a company FAQ using Retrieval-Augmented Generation. The FAQ is stored as vectors in Supabase pgvector, and each question only pulls the few entries that actually match it. Chatbot will not answer questions outside of the knowledge base or guess something it doesn't know.

**Live demo:** https://ai-chatbot-liugong-rag.vercel.app/

## Notes

I understand that context injection, putting all the FAQ data into the prompt, is actually a simpler, more straightforward approach in this case since the FAQ file (`company_faq.json`) only has less than 20 entries.

However, since this is a technical test, I also built the RAG version to show the retrieval approach and how it scales once the FAQ data grows. That is what lives on the [`main`](https://github.com/hwasyui/ai-chatbot-liugong/tree/main) and [`rag`](https://github.com/hwasyui/ai-chatbot-liugong/tree/rag) branches.

To check the context injection version, visit the [`context-injection`](https://github.com/hwasyui/ai-chatbot-liugong/tree/context-injection) branch, or try the [live version](https://ai-chatbot-liugong-context.vercel.app/).

## Tech stack

- Next.js 16 (React, TypeScript, Tailwind CSS) for frontend and backend
- Groq for chat replies and query rewriting
- Google Gemini for embeddings
- Supabase (Postgres + pgvector) for vector search and chat history

## How it works

**Setting up the knowledge base** (once or whenever the FAQ changes): `scripts/ingest.mjs` embeds each FAQ question/answer pair with Gemini and stores it in `liugong_rag_faq_chunks` (pgvector).

**Answering a question** (every message):

1. `lib/rewrite.ts` turns a follow-up question into a standalone one using the chat history, via Groq.
2. `lib/embeddings.ts` embeds that standalone question with Gemini.
3. `lib/retrieval.ts` finds the closest FAQ chunks in Supabase.
4. Only those matched chunks (not the whole FAQ) go into the system prompt sent to Groq for the final answer.

Gemini handles embeddings and Groq handles chat and rewriting: Groq has no embedding API, and its free tier allows far more chat requests per minute than Gemini's.

## Setup

1. `npm install`
2. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) (used for embeddings).
3. Get a free Groq API key from [console.groq.com/keys](https://console.groq.com/keys) (used for chat and query rewriting).
4. Create a free project at [supabase.com](https://supabase.com) (pgvector is built in), then go to **Project Settings → Data API** and copy the Project URL and anon public key.
5. In the Supabase dashboard, open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it.
6. `cp .env.example .env.local`, then fill in all six variables using the values from steps 2-4.
7. `npm run ingest` to embed the FAQ and store it in Supabase. This has to run once before the chatbot can answer anything.
8. `npm run dev`, then open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | What it is |
| --- | --- |
| `GEMINI_API_KEY` | Free key from Google AI Studio, used for embeddings |
| `GEMINI_EMBEDDING_MODEL` | Which Gemini embedding model to use |
| `GROQ_API_KEY` | Free key from Groq, used for chat and query rewriting |
| `GROQ_MODEL` | Which Groq model to use |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/public key |