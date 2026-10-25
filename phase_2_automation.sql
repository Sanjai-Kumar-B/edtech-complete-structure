-- ============================================================
-- JUNOSPACE PHASE 2 — INFRASTRUCTURE & AUTOMATION
-- ============================================================

-- 1. AUTH-TO-PROFILE SYNCHRONIZATION
-- Automatically create a public.users profile when a user signs up/is created in Supabase Auth.

create or replace function public.handle_new_auth_user()
returns trigger as $$
declare
  default_role text := 'student';
  meta_role text;
begin
  -- Check if role is provided in metadata
  meta_role := new.raw_user_meta_data->>'role';
  if meta_role is not null then
    default_role := meta_role;
  end if;

  insert into public.users (id, email, full_name, role, avatar_initials, avatar_color)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    default_role,
    upper(substring(split_part(new.email, '@', 1), 1, 2)),
    '#7c3aed'
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
-- Note: You may need to run this as a superuser or via the Supabase Dashboard
-- drop trigger if exists on_auth_user_created on auth.users;
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_auth_user();


-- 2. CERTIFICATION CRITERIA
-- Define requirements for receiving a certificate for a specific course.

create table if not exists public.certification_criteria (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade unique,
  min_attendance_pct int default 80,
  min_assignment_avg int default 70,
  min_assessment_avg int default 75,
  required_skills text[], -- list of skill names that must be > 80
  created_at timestamptz default now()
);

-- 3. AUTOMATED CERTIFICATION ISSUANCE FUNCTION
-- Logic to verify criteria and issue certificates for a batch.

create or replace function public.issue_batch_certifications(p_batch_id uuid)
returns table (issued_count int) as $$
declare
  v_course_id uuid;
  v_criteria record;
  v_student record;
  v_issued_now int := 0;
begin
  -- Get Course ID and Criteria
  select course_id into v_course_id from public.batches where id = p_batch_id;
  select * into v_criteria from public.certification_criteria where course_id = v_course_id;

  if not found then
    -- Default criteria if none defined
    v_criteria := (null, v_course_id, 80, 70, 70, null, now());
  end if;

  -- Iterate through active enrollments
  for v_student in (
    select 
      e.student_id,
      ls.total_score,
      ss.consistency,
      ss.technical,
      ss.conceptual,
      ss.participation
    from public.enrollments e
    join public.leaderboard_scores ls on ls.student_id = e.student_id and ls.batch_id = e.batch_id
    join public.student_skills ss on ss.student_id = e.student_id and ss.batch_id = e.batch_id
    where e.batch_id = p_batch_id and e.status = 'active'
  ) loop
    -- Check Criteria
    if v_student.consistency >= v_criteria.min_attendance_pct and
       v_student.technical >= v_criteria.min_assignment_avg and
       v_student.conceptual >= v_criteria.min_assessment_avg then
       
       -- Issue Certificate
       insert into public.certificates (student_id, batch_id, course_id, status)
       values (v_student.student_id, p_batch_id, v_course_id, 'issued')
       on conflict do nothing;
       
       if found then
         v_issued_now := v_issued_now + 1;
         
         -- Notify Student
         insert into public.notifications (user_id, title, message, type)
         values (v_student.student_id, '🏆 Certificate Issued', 'Your official certification for the course has been generated and is ready for download.', 'certificate');
       end if;
    end if;
  end loop;

  return query select v_issued_now;
end;
$$ language plpgsql security definer;

-- 4. BATCH COMPLETION TRIGGER
-- Automatically check for certs when a batch status is set to 'completed'.

create or replace function public.on_batch_completed()
returns trigger as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    perform public.issue_batch_certifications(new.id);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger after_batch_completed
  after update on public.batches
  for each row execute procedure public.on_batch_completed();

-- 5. PERFORMANCE OPTIMIZATION (Materialized Views)
-- Cache heavy calculations to ensure sub-100ms dashboard loads.

create materialized view if not exists public.mv_leaderboard_scores as
select * from public.leaderboard_scores;

create unique index on public.mv_leaderboard_scores (student_id, batch_id);

create materialized view if not exists public.mv_student_skills as
select * from public.student_skills;

create unique index on public.mv_student_skills (student_id, batch_id);

-- Refresh Function
create or replace function public.refresh_analytics()
returns void as $$
begin
  refresh materialized view concurrently public.mv_leaderboard_scores;
  refresh materialized view concurrently public.mv_student_skills;
end;
$$ language plpgsql security definer;
