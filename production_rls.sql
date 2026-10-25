-- ==============================================================================
-- Junospace Production RLS Policies
-- Execute this in the Supabase SQL Editor to enforce strict security rules.
-- ==============================================================================

-- Enable RLS on all tables
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
alter table public.roadmap enable row level security;
alter table public.certificates enable row level security;
alter table public.leaderboard_manual_points enable row level security;
alter table public.notifications enable row level security;

-- Drop any existing "Allow all for dev" policies (assuming standard names, adjust if needed)
drop policy if exists "Allow all for dev" on public.users;
drop policy if exists "Allow all for dev" on public.courses;
drop policy if exists "Allow all for dev" on public.batches;
drop policy if exists "Allow all for dev" on public.enrollments;
drop policy if exists "Allow all for dev" on public.sessions;
drop policy if exists "Allow all for dev" on public.attendance;
drop policy if exists "Allow all for dev" on public.assignments;
drop policy if exists "Allow all for dev" on public.assignment_submissions;
drop policy if exists "Allow all for dev" on public.assessments;
drop policy if exists "Allow all for dev" on public.assessment_questions;
drop policy if exists "Allow all for dev" on public.assessment_submissions;

-- 1. USERS
-- Users can read their own profile, instructors/admins can read all profiles
create policy "Users can read own profile"
on public.users for select
using (auth.uid() = id or role in ('admin', 'instructor'));

create policy "Users can update own profile"
on public.users for update
using (auth.uid() = id);

-- 2. COURSES & BATCHES
-- All authenticated users can view courses and batches
create policy "Courses are viewable by all users"
on public.courses for select
using (auth.role() = 'authenticated');

create policy "Batches are viewable by all users"
on public.batches for select
using (auth.role() = 'authenticated');

-- 3. ENROLLMENTS
-- Students can only read their own enrollments. Admins/Instructors can read all.
create policy "Students can read own enrollments"
on public.enrollments for select
using (
  student_id = auth.uid() or 
  exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'instructor'))
);

-- 4. SESSIONS & ATTENDANCE
-- Sessions are viewable if a student is enrolled in the batch
create policy "Students can view sessions for their batches"
on public.sessions for select
using (
  exists (select 1 from public.enrollments where student_id = auth.uid() and batch_id = sessions.batch_id) or
  exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'instructor'))
);

-- Students can view only their own attendance
create policy "Students can view own attendance"
on public.attendance for select
using (
  student_id = auth.uid() or 
  exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'instructor'))
);

-- 5. ASSIGNMENTS & SUBMISSIONS
-- Assignments are viewable if they are published and student is in the batch
create policy "Students can view published assignments for their batches"
on public.assignments for select
using (
  (is_published = true and exists (select 1 from public.enrollments where student_id = auth.uid() and batch_id = assignments.batch_id)) or
  exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'instructor'))
);

-- Students can read/insert/update their own submissions
create policy "Students can manage own assignment submissions"
on public.assignment_submissions for all
using (student_id = auth.uid())
with check (student_id = auth.uid());

-- 6. ASSESSMENTS
-- Assessments viewable if published and in student's batch
create policy "Students can view published assessments for their batches"
on public.assessments for select
using (
  (is_published = true and exists (select 1 from public.enrollments where student_id = auth.uid() and batch_id = assessments.batch_id)) or
  exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'instructor'))
);

create policy "Students can view questions for published assessments"
on public.assessment_questions for select
using (
  exists (
    select 1 from public.assessments a 
    join public.enrollments e on a.batch_id = e.batch_id 
    where a.id = assessment_questions.assessment_id and a.is_published = true and e.student_id = auth.uid()
  ) or
  exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'instructor'))
);

-- Students can manage their own assessment submissions
create policy "Students can manage own assessment submissions"
on public.assessment_submissions for all
using (student_id = auth.uid())
with check (student_id = auth.uid());

-- 7. LEADERBOARD & NOTIFICATIONS
-- Leaderboard manual points are readable by everyone in the batch (used for views)
create policy "Leaderboard points viewable by all"
on public.leaderboard_manual_points for select
using (auth.role() = 'authenticated');

-- Notifications
create policy "Users can manage own notifications"
on public.notifications for all
using (user_id = auth.uid());
