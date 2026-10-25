-- ============================================================
-- JUNOSPACE ED-TECH PLATFORM — SUPABASE DATABASE SCHEMA
-- ============================================================
-- Connects: Student (HTML/CSS), Instructor (React@5174), Admin (React@5175)
-- Run this in the Supabase SQL Editor
-- ============================================================

-- USERS TABLE (all roles)
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  role text check (role in ('student', 'instructor', 'admin')) not null,
  avatar_url text,
  avatar_initials text,
  avatar_color text default '#6C35DE',
  phone text,
  address text,
  date_of_birth date,
  enrollment_no text unique,
  login_id text unique,
  is_active boolean default true,
  created_at timestamptz default now(),
  created_by uuid references public.users(id)
);

-- COURSES TABLE
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  department text,
  description text,
  status text check (status in ('draft', 'active', 'archived')) default 'draft',
  thumbnail_color text default '#6C35DE',
  tags text[],
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- COURSE MODULES TABLE
create table public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  week_number int not null,
  title text not null,
  description text,
  created_at timestamptz default now()
);

-- BATCHES TABLE
create table public.batches (
  id uuid primary key default gen_random_uuid(),
  batch_code text unique not null,
  course_id uuid references public.courses(id),
  instructor_id uuid references public.users(id),
  max_students int default 50,
  schedule text,
  start_date date,
  end_date date,
  status text check (status in ('pending', 'active', 'completed', 'deactivated')) default 'pending',
  created_at timestamptz default now()
);

-- ENROLLMENTS TABLE
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.batches(id) on delete cascade,
  student_id uuid references public.users(id) on delete cascade,
  status text check (status in ('active', 'dropped', 'completed')) default 'active',
  enrolled_at timestamptz default now(),
  unique(batch_id, student_id)
);

-- SESSIONS TABLE
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.batches(id) on delete cascade,
  title text not null,
  description text,
  session_date date not null,
  session_time time not null,
  duration_minutes int default 90,
  zoom_link text,
  type text check (type in ('class', 'workshop', 'assessment', 'review')) default 'class',
  created_at timestamptz default now()
);

-- ATTENDANCE TABLE
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  student_id uuid references public.users(id) on delete cascade,
  status text check (status in ('present', 'absent', 'late', 'unmarked')) default 'unmarked',
  marked_at timestamptz default now(),
  marked_by uuid references public.users(id),
  unique(session_id, student_id)
);

-- ASSIGNMENTS TABLE
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.batches(id) on delete cascade,
  title text not null,
  description text,
  due_date timestamptz,
  max_score int default 100,
  skill_category text,
  is_published boolean default false,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- ASSIGNMENT SUBMISSIONS TABLE
create table public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid references public.assignments(id) on delete cascade,
  student_id uuid references public.users(id) on delete cascade,
  file_url text,
  submitted_at timestamptz default now(),
  status text check (status in ('pending', 'reviewed', 'returned')) default 'pending',
  score int,
  feedback text,
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  unique(assignment_id, student_id)
);

-- ASSESSMENTS TABLE
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.batches(id) on delete cascade,
  title text not null,
  description text,
  due_date timestamptz,
  duration_minutes int default 30,
  is_published boolean default false,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- ASSESSMENT QUESTIONS TABLE
create table public.assessment_questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references public.assessments(id) on delete cascade,
  question_text text not null,
  code_block text,
  options text[] not null,
  correct_answer int not null,
  topic text,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) default 'medium',
  order_index int default 0
);

-- ASSESSMENT SUBMISSIONS TABLE
create table public.assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references public.assessments(id) on delete cascade,
  student_id uuid references public.users(id) on delete cascade,
  answers int[],
  score int,
  total_questions int,
  submitted_at timestamptz default now(),
  time_taken_minutes int,
  unique(assessment_id, student_id)
);

-- ROADMAP WEEKS TABLE
create table public.roadmap_weeks (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.batches(id) on delete cascade,
  week_number int not null,
  title text not null,
  description text,
  status text check (status in ('locked', 'active', 'completed')) default 'locked',
  unlocked_at timestamptz,
  unique(batch_id, week_number)
);

-- CERTIFICATES TABLE
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id),
  batch_id uuid references public.batches(id),
  course_id uuid references public.courses(id),
  issued_by uuid references public.users(id),
  issued_at timestamptz default now(),
  verify_code text unique default gen_random_uuid()::text,
  cert_url text,
  status text check (status in ('issued', 'revoked')) default 'issued'
);

-- LEADERBOARD POINTS TABLE
create table public.leaderboard_points (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.users(id),
  batch_id uuid references public.batches(id),
  bonus_points int default 0,
  penalty_points int default 0,
  notes text,
  updated_by uuid references public.users(id),
  updated_at timestamptz default now(),
  unique(student_id, batch_id)
);

-- NOTIFICATIONS TABLE
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  title text not null,
  message text,
  type text check (type in ('assignment', 'assessment', 'session', 'certificate', 'system')) default 'system',
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.batches enable row level security;
alter table public.enrollments enable row level security;
alter table public.sessions enable row level security;
alter table public.attendance enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_questions enable row level security;
alter table public.assessment_submissions enable row level security;
alter table public.roadmap_weeks enable row level security;
alter table public.certificates enable row level security;
alter table public.leaderboard_points enable row level security;
alter table public.notifications enable row level security;

-- ============================================================
-- LEADERBOARD VIEW (calculated scores)
-- ============================================================
create or replace view public.leaderboard_scores as
select
  e.student_id,
  e.batch_id,
  u.full_name,
  u.avatar_initials,
  u.avatar_color,
  coalesce(
    round(
      (
        coalesce((
          select count(*) filter (where a.status = 'present') * 100.0 / nullif(count(*), 0)
          from public.attendance a
          join public.sessions s on s.id = a.session_id
          where s.batch_id = e.batch_id and a.student_id = e.student_id
        ), 0) * 0.2
      ) +
      (
        coalesce((
          select avg(sub.score)
          from public.assignment_submissions sub
          join public.assignments asn on asn.id = sub.assignment_id
          where asn.batch_id = e.batch_id and sub.student_id = e.student_id and sub.score is not null
        ), 0) * 0.4
      ) +
      (
        coalesce((
          select avg(asmt.score)
          from public.assessment_submissions asmt
          join public.assessments a2 on a2.id = asmt.assessment_id
          where a2.batch_id = e.batch_id and asmt.student_id = e.student_id
        ), 0) * 0.3
      ) +
      (
        coalesce((
          select (lp.bonus_points - lp.penalty_points)
          from public.leaderboard_points lp
          where lp.batch_id = e.batch_id and lp.student_id = e.student_id
        ), 0) * 0.1
      )
    )
  , 0) as total_score,
  rank() over (
    partition by e.batch_id
    order by
      coalesce((select count(*) filter (where a.status = 'present') * 100.0 / nullif(count(*), 0) from public.attendance a join public.sessions s on s.id = a.session_id where s.batch_id = e.batch_id and a.student_id = e.student_id), 0) * 0.2 +
      coalesce((select avg(sub.score) from public.assignment_submissions sub join public.assignments asn on asn.id = sub.assignment_id where asn.batch_id = e.batch_id and sub.student_id = e.student_id and sub.score is not null), 0) * 0.4 +
      coalesce((select avg(asmt.score) from public.assessment_submissions asmt join public.assessments a2 on a2.id = asmt.assessment_id where a2.batch_id = e.batch_id and asmt.student_id = e.student_id), 0) * 0.3 +
      coalesce((select (lp.bonus_points - lp.penalty_points) from public.leaderboard_points lp where lp.batch_id = e.batch_id and lp.student_id = e.student_id), 0) * 0.1
    desc
  ) as rank
from public.enrollments e
join public.users u on u.id = e.student_id;

-- ============================================================
-- STUDENT SKILLS VIEW
-- ============================================================
create or replace view public.student_skills as
select
  e.student_id,
  e.batch_id,
  round(coalesce((
    select count(*) filter (where a.status = 'present') * 100.0 / nullif(count(*), 0)
    from public.attendance a
    join public.sessions s on s.id = a.session_id
    where s.batch_id = e.batch_id and a.student_id = e.student_id
  ), 0)) as consistency,
  round(coalesce((
    select avg(sub.score)
    from public.assignment_submissions sub
    join public.assignments asn on asn.id = sub.assignment_id
    where asn.batch_id = e.batch_id and sub.student_id = e.student_id and sub.score is not null
  ), 0)) as technical,
  round(coalesce((
    select avg(asmt.score)
    from public.assessment_submissions asmt
    join public.assessments a2 on a2.id = asmt.assessment_id
    where a2.batch_id = e.batch_id and asmt.student_id = e.student_id
  ), 0)) as conceptual,
  round(coalesce((
    select count(distinct s.id) * 100.0 / nullif((select count(*) from public.sessions s2 where s2.batch_id = e.batch_id), 0)
    from public.attendance a
    join public.sessions s on s.id = a.session_id
    where s.batch_id = e.batch_id and a.student_id = e.student_id and a.status in ('present', 'late')
  ), 0)) as participation
from public.enrollments e;

-- ============================================================
-- TRIGGER: auto-create login_id for students
-- ============================================================
create or replace function public.generate_login_id()
returns trigger as $$
begin
  if new.role = 'student' and new.login_id is null then
    new.login_id := 'STU-' || upper(substring(replace(new.full_name, ' ', ''), 1, 3)) || '-' || to_char(now(), 'YY') || lpad(floor(random() * 999 + 1)::text, 3, '0');
  elsif new.role = 'instructor' and new.login_id is null then
    new.login_id := 'INS-' || upper(substring(replace(new.full_name, ' ', ''), 1, 3)) || '-' || to_char(now(), 'YY') || lpad(floor(random() * 999 + 1)::text, 3, '0');
  end if;
  if new.avatar_initials is null then
    new.avatar_initials := upper(substring(split_part(new.full_name, ' ', 1), 1, 1) || substring(split_part(new.full_name, ' ', 2), 1, 1));
  end if;
  return new;
end;
$$ language plpgsql;

create trigger before_user_insert
  before insert on public.users
  for each row execute procedure public.generate_login_id();

-- ============================================================
-- SEED DATA
-- ============================================================

-- SEED ADMIN USER
insert into public.users (email, full_name, role, login_id, avatar_initials, avatar_color)
values ('admin@atelier.com', 'Julian Richter', 'admin', 'ADMIN-001', 'JR', '#00288e');

-- SEED INSTRUCTOR
insert into public.users (email, full_name, role, avatar_initials, avatar_color)
values ('instructor@atelier.com', 'Dr. Aris Thorne', 'instructor', 'DT', '#6C35DE');

-- SEED STUDENTS
insert into public.users (email, full_name, role, avatar_initials, avatar_color) values
('student@atelier.com', 'Alex Johnson', 'student', 'AJ', '#6C35DE'),
('elena.ro@atelier.com', 'Elena Rodriguez', 'student', 'ER', '#0F6E56'),
('liam.vance@atelier.com', 'Liam Vance', 'student', 'LV', '#B05538'),
('priya.mehta@atelier.com', 'Priya Mehta', 'student', 'PM', '#185FA5');

-- SEED COURSES
insert into public.courses (code, title, department, description, status, tags) values
('WD-301', 'Full-Stack Architecture', 'Engineering', 'End-to-end web application design with Node.js, React, and cloud deployment.', 'active', array['React', 'Node.js', 'PostgreSQL']),
('DS-101', 'Introduction to Data Science', 'Analytics', 'Python, pandas, machine learning fundamentals, and data storytelling.', 'active', array['Python', 'Statistics', 'ML Basics']),
('DS-201', 'Advanced Machine Learning', 'Analytics', 'Deep learning architectures and reinforcement learning paradigms.', 'active', array['Neural Networks', 'PyTorch', 'Linear Algebra']);
