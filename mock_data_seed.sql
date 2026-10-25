-- ============================================================
-- JUNOSPACE COMPREHENSIVE MOCK DATA SEED
-- This script populates the platform with a full-fidelity dataset
-- for testing analytics, guilds, certifications, and reporting.
-- ============================================================

-- 1. SEED COURSES
insert into public.courses (title, description, code, status) values
('Full-Stack Web Engineering', 'Comprehensive mastery of modern architecture and interfaces.', 'FS-2026', 'active'),
('Applied Artificial Intelligence', 'Deep dive into neural networks, LLMs, and cognitive systems.', 'AI-2026', 'active')
on conflict (code) do nothing;

-- 2. SEED USERS (MOCK PERSONNEL)
-- Note: These IDs are generated for public profile testing.
insert into public.users (id, email, full_name, role, login_id, avatar_initials, avatar_color, is_active) values
('7c3aed00-0000-0000-0000-000000000001', 'instructor@mail.com', 'Dr. Aris Thorne', 'instructor', 'INST-001', 'AT', '#4f46e5', true),
('7c3aed00-0000-0000-0000-000000000002', 'student1@mail.com', 'Leo Varna', 'student', 'STU-001', 'LV', '#10b981', true),
('7c3aed00-0000-0000-0000-000000000003', 'student2@mail.com', 'Maya Kross', 'student', 'STU-002', 'MK', '#f59e0b', true),
('7c3aed00-0000-0000-0000-000000000004', 'student3@mail.com', 'Soren Blake', 'student', 'STU-003', 'SB', '#ef4444', true),
('7c3aed00-0000-0000-0000-000000000005', 'student4@mail.com', 'Elena Sol', 'student', 'STU-004', 'ES', '#8b5cf6', true)
on conflict (id) do nothing;

-- 3. SEED BATCHES (COHORTS)
insert into public.batches (batch_code, course_id, instructor_id, max_students, start_date, end_date, status, schedule) values
('FS-ALPHA-26', (select id from public.courses where code='FS-2026'), '7c3aed00-0000-0000-0000-000000000001', 20, '2026-01-01', '2026-04-01', 'active', 'Mon/Wed/Fri 10AM'),
('AI-BETA-26', (select id from public.courses where code='AI-2026'), '7c3aed00-0000-0000-0000-000000000001', 15, '2026-02-01', '2026-06-01', 'active', 'Tue/Thu 2PM')
on conflict (batch_code) do nothing;

-- 4. SEED ENROLLMENTS
insert into public.enrollments (batch_id, student_id, status) values
((select id from public.batches where batch_code='FS-ALPHA-26'), '7c3aed00-0000-0000-0000-000000000002', 'active'),
((select id from public.batches where batch_code='FS-ALPHA-26'), '7c3aed00-0000-0000-0000-000000000003', 'active'),
((select id from public.batches where batch_code='FS-ALPHA-26'), '7c3aed00-0000-0000-0000-000000000004', 'active'),
((select id from public.batches where batch_code='AI-BETA-26'), '7c3aed00-0000-0000-0000-000000000005', 'active')
on conflict do nothing;

-- 5. SEED ASSIGNMENTS
insert into public.assignments (batch_id, title, description, max_score, due_date, is_published) values
((select id from public.batches where batch_code='FS-ALPHA-26'), 'System Architecture Design', 'Design a scalable multi-node architecture for a global fintech platform.', 100, '2026-02-15', true),
((select id from public.batches where batch_code='FS-ALPHA-26'), 'Advanced State Orchestration', 'Implement a redundant state management system using global observers.', 100, '2026-03-01', true)
on conflict do nothing;

-- 6. SEED SUBMISSIONS (FOR ANALYTICS)
insert into public.assignment_submissions (student_id, assignment_id, score, status, feedback) values
('7c3aed00-0000-0000-0000-000000000002', (select id from public.assignments where title='System Architecture Design'), 95, 'reviewed', 'Exceptional depth in node redundancy.'),
('7c3aed00-0000-0000-0000-000000000003', (select id from public.assignments where title='System Architecture Design'), 82, 'reviewed', 'Good flow, but watch out for latency bottlenecks.'),
('7c3aed00-0000-0000-0000-000000000004', (select id from public.assignments where title='System Architecture Design'), 70, 'reviewed', 'Needs more focus on security headers.')
on conflict do nothing;

-- 7. SEED ATTENDANCE (FOR SKILLS)
-- Insert mock sessions and attendance records
insert into public.sessions (batch_id, title, session_date, session_time, duration_minutes) values
((select id from public.batches where batch_code='FS-ALPHA-26'), 'Inaugural Node: Infrastructure', '2026-01-05', '10:00:00', 120),
((select id from public.batches where batch_code='FS-ALPHA-26'), 'Logic Flow: State Management', '2026-01-08', '10:00:00', 120);

insert into public.attendance (session_id, student_id, status) values
((select id from public.sessions where title='Inaugural Node: Infrastructure'), '7c3aed00-0000-0000-0000-000000000002', 'present'),
((select id from public.sessions where title='Inaugural Node: Infrastructure'), '7c3aed00-0000-0000-0000-000000000003', 'present'),
((select id from public.sessions where title='Inaugural Node: Infrastructure'), '7c3aed00-0000-0000-0000-000000000004', 'absent');

-- 8. SEED ROADMAP WEEKS
insert into public.roadmap_weeks (batch_id, week_number, title, description, status) values
((select id from public.batches where batch_code='FS-ALPHA-26'), 1, 'Foundation Node', 'Establishing the core environment and architectural patterns.', 'completed'),
((select id from public.batches where batch_code='FS-ALPHA-26'), 2, 'Reactive Logic', 'Mastering the flow of state across global components.', 'active'),
((select id from public.batches where batch_code='FS-ALPHA-26'), 3, 'Data Stratosphere', 'Scaling databases and ensuring high-velocity data retrieval.', 'locked');

-- 9. REFRESH ANALYTICS
-- If materialized views exist, refresh them
-- select public.refresh_analytics();
