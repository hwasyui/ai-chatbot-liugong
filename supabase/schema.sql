create extension if not exists vector;

create table if not exists public.liugong_rag_faq_chunks (
  chunk_key   text        primary key,
  category    text        not null,
  question    text        not null,
  answer      text        not null,
  content     text        not null,
  embedding   vector(768) not null,
  created_at  timestamptz not null default now()
);

alter table public.liugong_rag_faq_chunks enable row level security;

drop policy if exists "liugong_rag_faq_chunks_anon_select" on public.liugong_rag_faq_chunks;
create policy "liugong_rag_faq_chunks_anon_select"
  on public.liugong_rag_faq_chunks
  for select to anon
  using (true);

drop policy if exists "liugong_rag_faq_chunks_anon_insert" on public.liugong_rag_faq_chunks;
create policy "liugong_rag_faq_chunks_anon_insert"
  on public.liugong_rag_faq_chunks
  for insert to anon
  with check (true);

drop policy if exists "liugong_rag_faq_chunks_anon_update" on public.liugong_rag_faq_chunks;
create policy "liugong_rag_faq_chunks_anon_update"
  on public.liugong_rag_faq_chunks
  for update to anon
  using (true)
  with check (true);

grant select, insert, update on public.liugong_rag_faq_chunks to anon;

create or replace function public.match_liugong_rag_faq_chunks(
  query_embedding vector(768),
  match_count int default 5,
  match_threshold float default 0.3
)
returns table (
  category text,
  question text,
  answer text,
  similarity float
)
language sql stable
as $$
  select
    category,
    question,
    answer,
    1 - (embedding <=> query_embedding) as similarity
  from public.liugong_rag_faq_chunks
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;

grant execute on function public.match_liugong_rag_faq_chunks(vector, int, float) to anon;

create table if not exists public.liugong_rag_chat_messages (
  id          uuid        primary key default gen_random_uuid(),
  session_id  uuid        not null,
  role        text        not null check (role in ('user', 'assistant')),
  content     text        not null check (char_length(content) between 1 and 10000),
  created_at  timestamptz not null default now()
);

create index if not exists liugong_rag_chat_messages_session_idx
  on public.liugong_rag_chat_messages (session_id, created_at);

alter table public.liugong_rag_chat_messages enable row level security;

drop policy if exists "liugong_rag_chat_messages_anon_select" on public.liugong_rag_chat_messages;
create policy "liugong_rag_chat_messages_anon_select"
  on public.liugong_rag_chat_messages
  for select to anon
  using (true);

drop policy if exists "liugong_rag_chat_messages_anon_insert" on public.liugong_rag_chat_messages;
create policy "liugong_rag_chat_messages_anon_insert"
  on public.liugong_rag_chat_messages
  for insert to anon
  with check (true);

grant select, insert on public.liugong_rag_chat_messages to anon;
