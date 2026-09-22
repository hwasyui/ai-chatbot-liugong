# Acme Assistant

A take home assignment for a full stack developer technical test. It is a chatbot that answers questions from a company FAQ. It only answers from the FAQ data and says so when it does not know something.

**Live demo:** link

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
