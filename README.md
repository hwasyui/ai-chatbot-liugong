# Acme Assistant (RAG)

A practice project: the same FAQ chatbot, rebuilt with retrieval-augmented generation using Supabase pgvector, manual query rewriting and embeddings (no LangChain).

**Live demo:** _add your Vercel link here_

## How it works

1. `scripts/ingest.mjs` embeds each FAQ question/answer pair with Gemini and stores it in `liugong_rag_faq_chunks` (pgvector).
2. On each message, `lib/rewrite.ts` turns a follow-up question into a standalone one using the chat history, via Groq.
3. `lib/embeddings.ts` embeds that standalone question with Gemini, and `lib/retrieval.ts` finds the closest FAQ chunks in Supabase.
4. Only those matched chunks (not the whole FAQ) go into the system prompt sent to Groq for the final answer.

Gemini is used for embeddings (Groq does not offer an embedding API). Groq is used for the chat and query rewriting steps, since its free tier allows far more requests per minute than Gemini's.

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
