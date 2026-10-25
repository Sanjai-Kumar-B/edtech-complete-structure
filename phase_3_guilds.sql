-- ============================================================
-- JUNOSPACE PHASE 3 — COLLABORATIVE GUILDS & SOCIAL NODES
-- ============================================================

-- 1. GUILDS TABLE
create table if not exists public.guilds (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  icon text default 'groups',
  color text default '#6366f1',
  created_at timestamptz default now()
);

-- 2. GUILD MEMBERSHIP
create table if not exists public.guild_members (
  guild_id uuid references public.guilds(id) on delete cascade,
  student_id uuid references public.users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (guild_id, student_id)
);

-- 3. INITIAL SEED DATA
insert into public.guilds (name, description, icon, color) values
('Full-Stack Alchemists', 'Mastering the bridge between architecture and interface.', 'architecture', '#6366f1'),
('Neural Nexus', 'Exploring the frontiers of AI and machine intelligence.', 'psychology', '#a855f7'),
('DevOps Sentinels', 'Ensuring the stability of the deployment stratosphere.', 'terminal', '#0d9488'),
('Creative UI Voyagers', 'Designing the high-fidelity experiences of the future.', 'palette', '#db2777')
on conflict (name) do nothing;

-- 4. RLS POLICIES
alter table public.guilds enable row level security;
alter table public.guild_members enable row level security;

create policy "Guilds are visible to everyone" on public.guilds for select using (true);
create policy "Students can join guilds" on public.guild_members for insert with check (auth.uid() = student_id);
create policy "Students can see their memberships" on public.guild_members for select using (true);

-- 5. NOTIFICATION TRIGGER FOR GUILD JOIN
create or replace function public.on_guild_join()
returns trigger as $$
begin
  insert into public.notifications (user_id, title, message, type)
  values (new.student_id, '🛡️ Guild Joined', 'Welcome to the guild! Collaborate with your peers to unlock advanced projects.', 'guild');
  return new;
end;
$$ language plpgsql;

create trigger after_guild_join
  after insert on public.guild_members
  for each row execute procedure public.on_guild_join();
