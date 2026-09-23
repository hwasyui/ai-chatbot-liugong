# Acme Assistant

Technical Test Assignment: IT Specialist Position. A chatbot that answers questions from a company FAQ, and only from that FAQ. Chatbot will not answer questions outside of the knowledge base or guess something it doesn't know.

**Live demo:** https://ai-chatbot-liugong-context.vercel.app/

## Notes

This version uses context injection, pasting the whole FAQ into the prompt, which is actually a simpler, more straightforward approach here since the FAQ file (`company_faq.json`) only has less than 20 entries.

However, since this is a technical test, I also built a RAG version to show the retrieval approach and how it scales once the FAQ data grows. Check it out on the [`main`](https://github.com/hwasyui/ai-chatbot-liugong/tree/main) and [`rag`](https://github.com/hwasyui/ai-chatbot-liugong/tree/rag) branches of this repo, or try the [live version](https://ai-chatbot-liugong-rag.vercel.app/).

## Tech stack

- Next.js 16 (React, TypeScript, Tailwind CSS), frontend and backend in one project
- Groq for the AI replies
- Supabase (Postgres) for chat history

## Setup

1. `npm install`
2. Get a free Groq API key from [console.groq.com/keys](https://console.groq.com/keys).
3. Create a free project at [supabase.com](https://supabase.com), then go to **Project Settings → Data API** and copy the Project URL and anon public key.
4. In the Supabase dashboard, open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it.
5. `cp .env.example .env.local`, then fill in `GROQ_API_KEY`, `GROQ_MODEL` (e.g. `openai/gpt-oss-120b`), `SUPABASE_URL`, and `SUPABASE_KEY` using the values from steps 2 and 3.
6. `npm run dev`, then open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | What it is |
| --- | --- |
| `GROQ_API_KEY` | Free key from Groq |
| `GROQ_MODEL` | Which Groq model to use |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/public key |
