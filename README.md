# Acme Assistant

Technical Test Assignment: IT Specialist Position. It is a chatbot that answers questions from a company FAQ. It only answers from the FAQ data and says so when it does not know something.

**Live demo:** https://ai-chatbot-liugong-context.vercel.app/

## Notes

This version uses context injection, pasting the whole FAQ into the prompt, which is actually the simpler and more accurate choice here since the FAQ file (`company_faq.json`) only has less than 20 entries.

However, since this is a technical test, I also built a RAG version to show the retrieval approach and how it scales once the FAQ data grows. Check it out on the `main` and `rag` branches of this repo, or try the [live version](https://ai-chatbot-liugong-rag.vercel.app/).

## Tech stack

- Next.js 16 (App Router) and React, both frontend and backend in one project
- TypeScript
- Tailwind CSS
- Google Gemini for the AI replies
- Supabase (Postgres) for chat history

## Setup

1. `npm install`
2. Create a free Supabase project, open the SQL Editor, and run [`supabase/schema.sql`](supabase/schema.sql).
3. `cp .env.example .env.local` and fill in the values.
4. `npm run dev`

## Environment variables

| Variable | What it is |
| --- | --- |
| `GEMINI_API_KEY` | Free key from Google AI Studio |
| `GEMINI_MODEL` | Which Gemini model to use |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Your Supabase anon key |
