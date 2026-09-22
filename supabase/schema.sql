create table if not exists public.liugong_chat_messages (
  id          uuid        primary key default gen_random_uuid(),
  session_id  uuid        not null,
  role        text        not null check (role in ('user', 'assistant')),
  content     text        not null check (char_length(content) between 1 and 10000),
  created_at  timestamptz not null default now()
);

create index if not exists liugong_chat_messages_session_idx
  on public.liugong_chat_messages (session_id, created_at);

alter table public.liugong_chat_messages enable row level security;

drop policy if exists "liugong_chat_messages_anon_select" on public.liugong_chat_messages;
create policy "liugong_chat_messages_anon_select"
  on public.liugong_chat_messages
  for select to anon
  using (true);

drop policy if exists "liugong_chat_messages_anon_insert" on public.liugong_chat_messages;
create policy "liugong_chat_messages_anon_insert"
  on public.liugong_chat_messages
  for insert to anon
  with check (true);

grant select, insert on public.liugong_chat_messages to anon;
