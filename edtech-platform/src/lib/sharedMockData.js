// ============================================================
// ATELIER ACADEMY — SHARED MOCK DATA
// Simulates all 12 Supabase tables. Used by Admin portal.
// Admin sees ALL data (no RLS filtering).
// ============================================================

export const MOCK_USERS = [
  // Admin
  {
    id: "admin-001",
    email: "admin@atelier.com",
    name: "Julian Richter",
    role: "admin",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian",
    created_at: "2024-01-01T00:00:00Z",
  },
  // Instructors
  {
    id: "inst-001",
    email: "instructor@atelier.com",
    name: "Dr. Aris Thorne",
    role: "instructor",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aris",
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "inst-002",
    email: "sarah.jenkins@atelier.com",
    name: "Dr. Sarah Jenkins",
    role: "instructor",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "inst-003",
    email: "marcus.thorne@atelier.com",
    name: "Marcus Thorne",
    role: "instructor",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    created_at: "2024-02-01T00:00:00Z",
  },
  // Students
  {
    id: "stu-001",
    email: "student@atelier.com",
    name: "Alex Johnson",
    role: "student",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    created_at: "2024-02-10T00:00:00Z",
  },
  {
    id: "stu-002",
    email: "elena.ro@atelier.com",
    name: "Elena Rodriguez",
    role: "student",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    created_at: "2024-02-12T00:00:00Z",
  },
  {
    id: "stu-003",
    email: "liam.vance@atelier.com",
    name: "Liam Vance",
    role: "student",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    created_at: "2024-02-14T00:00:00Z",
  },
  {
    id: "stu-004",
    email: "priya.mehta@atelier.com",
    name: "Priya Mehta",
    role: "student",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    created_at: "2024-02-16T00:00:00Z",
  },
  {
    id: "stu-005",
    email: "karan.das@atelier.com",
    name: "Karan Das",
    role: "student",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan",
    created_at: "2024-02-18T00:00:00Z",
  },
];

export const MOCK_COURSES = [
  {
    id: "course-001",
    title: "Full-Stack Architecture",
    description: "End-to-end web application design with Node.js, React, and cloud deployment.",
    department: "Engineering",
    status: "active",
    created_by: "admin-001",
    created_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "course-002",
    title: "Advanced UX Frameworks",
    description: "Design systems, user research, and prototyping at enterprise scale.",
    department: "Design",
    status: "active",
    created_by: "admin-001",
    created_at: "2024-01-22T00:00:00Z",
  },
  {
    id: "course-003",
    title: "Data Science Mastery",
    description: "Python, pandas, machine learning fundamentals, and data storytelling.",
    department: "Analytics",
    status: "active",
    created_by: "admin-001",
    created_at: "2024-01-25T00:00:00Z",
  },
  {
    id: "course-004",
    title: "Cloud Computing 101",
    description: "AWS, GCP, containerization, and CI/CD pipelines.",
    department: "Infrastructure",
    status: "draft",
    created_by: "admin-001",
    created_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "course-005",
    title: "Algorithmic Ethics",
    description: "Fairness, accountability, and transparency in AI systems.",
    department: "CS Theory",
    status: "active",
    created_by: "admin-001",
    created_at: "2024-02-05T00:00:00Z",
  },
];

export const MOCK_COURSE_MODULES = [
  { id: "mod-001", course_id: "course-001", title: "HTML & CSS Foundations", week_number: 1 },
  { id: "mod-002", course_id: "course-001", title: "JavaScript Deep Dive", week_number: 2 },
  { id: "mod-003", course_id: "course-001", title: "React & State Management", week_number: 3 },
  { id: "mod-004", course_id: "course-001", title: "Node.js & REST APIs", week_number: 4 },
  { id: "mod-005", course_id: "course-001", title: "Database Design & SQL", week_number: 5 },
  { id: "mod-006", course_id: "course-001", title: "Cloud Deployment", week_number: 6 },
  { id: "mod-007", course_id: "course-002", title: "Design Thinking Process", week_number: 1 },
  { id: "mod-008", course_id: "course-002", title: "User Research Methods", week_number: 2 },
];

export const MOCK_BATCHES = [
  {
    id: "batch-001",
    name: "FSA-24-A",
    course_id: "course-001",
    instructor_id: "inst-001",
    start_date: "2024-02-01",
    end_date: "2024-07-31",
    schedule: "Mon, Wed, Fri  •  09:00 – 11:00 AM",
    max_students: 50,
    status: "active",
    created_by: "admin-001",
  },
  {
    id: "batch-002",
    name: "UXF-24-B",
    course_id: "course-002",
    instructor_id: "inst-002",
    start_date: "2024-03-01",
    end_date: "2024-08-31",
    schedule: "Tue, Thu  •  02:00 – 05:00 PM",
    max_students: 30,
    status: "active",
    created_by: "admin-001",
  },
  {
    id: "batch-003",
    name: "DSM-24-C",
    course_id: "course-003",
    instructor_id: null,
    start_date: "2024-04-01",
    end_date: "2024-09-30",
    schedule: "Saturday  •  10:00 AM – 01:00 PM",
    max_students: 40,
    status: "pending",
    created_by: "admin-001",
  },
];

export const MOCK_ENROLLMENTS = [
  { id: "enr-001", batch_id: "batch-001", student_id: "stu-001", enrolled_by: "admin-001", status: "active", enrolled_at: "2024-02-01T00:00:00Z" },
  { id: "enr-002", batch_id: "batch-001", student_id: "stu-002", enrolled_by: "admin-001", status: "active", enrolled_at: "2024-02-01T00:00:00Z" },
  { id: "enr-003", batch_id: "batch-001", student_id: "stu-003", enrolled_by: "admin-001", status: "active", enrolled_at: "2024-02-01T00:00:00Z" },
  { id: "enr-004", batch_id: "batch-001", student_id: "stu-004", enrolled_by: "admin-001", status: "completed", enrolled_at: "2024-02-01T00:00:00Z" },
  { id: "enr-005", batch_id: "batch-002", student_id: "stu-005", enrolled_by: "admin-001", status: "active", enrolled_at: "2024-03-01T00:00:00Z" },
];

export const MOCK_SESSIONS = [
  { id: "sess-001", batch_id: "batch-001", title: "Kickoff: Project Planning", zoom_url: "https://zoom.us/j/123456789", scheduled_at: "2024-04-17T09:00:00+05:30", duration_min: 90, created_by: "inst-001" },
  { id: "sess-002", batch_id: "batch-001", title: "React Hooks Deep Dive", zoom_url: "https://zoom.us/j/234567890", scheduled_at: "2024-04-19T09:00:00+05:30", duration_min: 90, created_by: "inst-001" },
  { id: "sess-003", batch_id: "batch-001", title: "REST API Design", zoom_url: "https://zoom.us/j/345678901", scheduled_at: "2024-04-21T09:00:00+05:30", duration_min: 90, created_by: "inst-001" },
  { id: "sess-004", batch_id: "batch-002", title: "Design Thinking Workshop", zoom_url: "https://zoom.us/j/456789012", scheduled_at: "2024-04-18T14:00:00+05:30", duration_min: 180, created_by: "inst-002" },
];

export const MOCK_ATTENDANCE = [
  { id: "att-001", session_id: "sess-001", student_id: "stu-001", status: "present", marked_by: "inst-001" },
  { id: "att-002", session_id: "sess-001", student_id: "stu-002", status: "present", marked_by: "inst-001" },
  { id: "att-003", session_id: "sess-001", student_id: "stu-003", status: "absent", marked_by: "inst-001" },
  { id: "att-004", session_id: "sess-001", student_id: "stu-004", status: "late", marked_by: "inst-001" },
  { id: "att-005", session_id: "sess-002", student_id: "stu-001", status: "present", marked_by: "inst-001" },
  { id: "att-006", session_id: "sess-002", student_id: "stu-002", status: "late", marked_by: "inst-001" },
  { id: "att-007", session_id: "sess-002", student_id: "stu-003", status: "present", marked_by: "inst-001" },
  { id: "att-008", session_id: "sess-003", student_id: "stu-001", status: "present", marked_by: "inst-001" },
  { id: "att-009", session_id: "sess-003", student_id: "stu-002", status: "absent", marked_by: "inst-001" },
];

export const MOCK_ASSIGNMENTS = [
  { id: "asgn-001", batch_id: "batch-001", title: "React Component Library", description: "Build a reusable component library with Storybook.", due_date: "2024-04-25T23:59:00Z", max_score: 100, skill_category: "Frontend", created_by: "inst-001" },
  { id: "asgn-002", batch_id: "batch-001", title: "REST API Design Project", description: "Design and document a RESTful API for an e-commerce platform.", due_date: "2024-04-30T23:59:00Z", max_score: 100, skill_category: "Backend", created_by: "inst-001" },
  { id: "asgn-003", batch_id: "batch-001", title: "Database Schema Design", description: "Model a normalized relational schema for a social media app.", due_date: "2024-05-05T23:59:00Z", max_score: 100, skill_category: "Database", created_by: "inst-001" },
  { id: "asgn-004", batch_id: "batch-002", title: "User Research Report", description: "Conduct user interviews and synthesize findings.", due_date: "2024-04-28T23:59:00Z", max_score: 100, skill_category: "Research", created_by: "inst-002" },
];

export const MOCK_SUBMISSIONS = [
  { id: "sub-001", assignment_id: "asgn-001", student_id: "stu-001", file_url: "https://storage.atelier.com/submissions/sub-001.zip", status: "reviewed", score: 92, feedback: "Excellent component design. Consider adding accessibility props.", reviewed_by: "inst-001", reviewed_at: "2024-04-20T10:00:00Z", submitted_at: "2024-04-19T22:00:00Z" },
  { id: "sub-002", assignment_id: "asgn-001", student_id: "stu-002", file_url: "https://storage.atelier.com/submissions/sub-002.zip", status: "reviewed", score: 78, feedback: "Good effort but missing dark mode support.", reviewed_by: "inst-001", reviewed_at: "2024-04-20T11:00:00Z", submitted_at: "2024-04-19T20:00:00Z" },
  { id: "sub-003", assignment_id: "asgn-001", student_id: "stu-003", file_url: "https://storage.atelier.com/submissions/sub-003.zip", status: "pending", score: null, feedback: null, reviewed_by: null, reviewed_at: null, submitted_at: "2024-04-20T09:00:00Z" },
  { id: "sub-004", assignment_id: "asgn-002", student_id: "stu-001", file_url: "https://storage.atelier.com/submissions/sub-004.pdf", status: "reviewed", score: 88, feedback: "Well-structured API. Rate limiting documentation needs more detail.", reviewed_by: "inst-001", reviewed_at: "2024-04-22T09:00:00Z", submitted_at: "2024-04-21T18:00:00Z" },
  { id: "sub-005", assignment_id: "asgn-003", student_id: "stu-001", file_url: "https://storage.atelier.com/submissions/sub-005.pdf", status: "pending", score: null, feedback: null, reviewed_by: null, reviewed_at: null, submitted_at: "2024-04-22T21:00:00Z" },
];

export const MOCK_MENTOR_NOTES = [
  { id: "note-001", student_id: "stu-001", batch_id: "batch-001", instructor_id: "inst-001", note_type: "Strength", content: "Alex shows exceptional problem-solving skills. Completed the API design assignment 2 days early with outstanding documentation.", created_at: "2024-04-20T12:00:00Z" },
  { id: "note-002", student_id: "stu-002", batch_id: "batch-001", instructor_id: "inst-001", note_type: "Warning", content: "Elena has been inconsistent with attendance in the last 2 sessions. Need to follow up on personal challenges.", created_at: "2024-04-21T09:00:00Z" },
  { id: "note-003", student_id: "stu-003", batch_id: "batch-001", instructor_id: "inst-001", note_type: "Urgency", content: "Liam has missed the last assignment deadline and has not responded to messages. Intervention required.", created_at: "2024-04-22T10:00:00Z" },
];

export const MOCK_ROADMAP_WEEKS = [
  { id: "rw-001", batch_id: "batch-001", week_number: 1, title: "Web Foundations", description: "HTML5, CSS3, responsive design principles.", status: "completed", unlocked_by: "inst-001", unlocked_at: "2024-02-01T00:00:00Z" },
  { id: "rw-002", batch_id: "batch-001", week_number: 2, title: "JavaScript Mastery", description: "ES6+, async/await, DOM manipulation.", status: "completed", unlocked_by: "inst-001", unlocked_at: "2024-02-08T00:00:00Z" },
  { id: "rw-003", batch_id: "batch-001", week_number: 3, title: "React Ecosystem", description: "Components, hooks, state management with Zustand.", status: "active", unlocked_by: "inst-001", unlocked_at: "2024-04-15T00:00:00Z" },
  { id: "rw-004", batch_id: "batch-001", week_number: 4, title: "Backend Development", description: "Node.js, Express, REST API design patterns.", status: "locked", unlocked_by: null, unlocked_at: null },
  { id: "rw-005", batch_id: "batch-001", week_number: 5, title: "Database Engineering", description: "SQL, PostgreSQL, query optimization.", status: "locked", unlocked_by: null, unlocked_at: null },
  { id: "rw-006", batch_id: "batch-001", week_number: 6, title: "Cloud & Deployment", description: "CI/CD, Docker, AWS Amplify.", status: "locked", unlocked_by: null, unlocked_at: null },
];

export const MOCK_CERTIFICATES = [
  {
    id: "cert-001",
    student_id: "stu-004",
    batch_id: "batch-001",
    issued_by: "admin-001",
    pdf_url: "https://storage.atelier.com/certificates/cert-001.pdf",
    verify_code: "AAC2024PRIYA001",
    issued_at: "2024-04-10T10:00:00Z",
  },
];

// ──────────────────────────────────────────────────────────
// Derived helpers (replaces Supabase joins)
// ──────────────────────────────────────────────────────────
export function getUserById(id) {
  return MOCK_USERS.find((u) => u.id === id) || null;
}

export function getCourseById(id) {
  return MOCK_COURSES.find((c) => c.id === id) || null;
}

export function getBatchById(id) {
  return MOCK_BATCHES.find((b) => b.id === id) || null;
}

export function getEnrollmentsForBatch(batchId) {
  return MOCK_ENROLLMENTS.filter((e) => e.batch_id === batchId).map((e) => ({
    ...e,
    student: getUserById(e.student_id),
  }));
}

export function getSessionsForBatch(batchId) {
  return MOCK_SESSIONS.filter((s) => s.batch_id === batchId);
}

export function getAttendanceForSession(sessionId) {
  return MOCK_ATTENDANCE.filter((a) => a.session_id === sessionId);
}

export function getAttendanceForStudent(studentId) {
  return MOCK_ATTENDANCE.filter((a) => a.student_id === studentId);
}

export function getAssignmentsForBatch(batchId) {
  return MOCK_ASSIGNMENTS.filter((a) => a.batch_id === batchId);
}

export function getSubmissionsForAssignment(assignmentId) {
  return MOCK_SUBMISSIONS.filter((s) => s.assignment_id === assignmentId).map((s) => ({
    ...s,
    student: getUserById(s.student_id),
  }));
}

export function getSubmissionsForStudent(studentId) {
  return MOCK_SUBMISSIONS.filter((s) => s.student_id === studentId);
}

export function getMentorNotesForStudent(studentId) {
  return MOCK_MENTOR_NOTES.filter((n) => n.student_id === studentId);
}

export function getRoadmapForBatch(batchId) {
  return MOCK_ROADMAP_WEEKS.filter((w) => w.batch_id === batchId).sort((a, b) => a.week_number - b.week_number);
}

export function getCertificatesForStudent(studentId) {
  return MOCK_CERTIFICATES.filter((c) => c.student_id === studentId);
}

export function verifyCertificate(code) {
  const cert = MOCK_CERTIFICATES.find((c) => c.verify_code === code);
  if (!cert) return null;
  return {
    ...cert,
    student: getUserById(cert.student_id),
    batch: getBatchById(cert.batch_id),
    course: cert.batch_id ? getCourseById(getBatchById(cert.batch_id)?.course_id) : null,
  };
}

// Eligible students for certification: enrollment completed + all assignments reviewed
export function getEligibleStudents() {
  return MOCK_ENROLLMENTS.filter((e) => e.status === "completed").map((e) => {
    const student = getUserById(e.student_id);
    const batch = getBatchById(e.batch_id);
    const course = batch ? getCourseById(batch.course_id) : null;
    const assignments = getAssignmentsForBatch(e.batch_id);
    const submissions = getSubmissionsForStudent(e.student_id).filter((s) =>
      assignments.some((a) => a.id === s.assignment_id)
    );
    const reviewedCount = submissions.filter((s) => s.status === "reviewed").length;
    const pct = assignments.length ? Math.round((reviewedCount / assignments.length) * 100) : 0;
    const alreadyCertified = MOCK_CERTIFICATES.some(
      (c) => c.student_id === e.student_id && c.batch_id === e.batch_id
    );
    return { enrollment: e, student, batch, course, pct, alreadyCertified };
  });
}

// Admin platform stats
export function getAdminStats() {
  const students = MOCK_USERS.filter((u) => u.role === "student");
  const instructors = MOCK_USERS.filter((u) => u.role === "instructor");
  const activeBatches = MOCK_BATCHES.filter((b) => b.status === "active");
  const activeCourses = MOCK_COURSES.filter((c) => c.status === "active");
  const totalSessions = MOCK_SESSIONS.length;
  const presentRows = MOCK_ATTENDANCE.filter((a) => a.status === "present").length;
  const totalAttRows = MOCK_ATTENDANCE.length;
  const avgAttendance = totalAttRows ? Math.round((presentRows / totalAttRows) * 100) : 0;
  const reviewed = MOCK_SUBMISSIONS.filter((s) => s.status === "reviewed").length;
  const totalSubs = MOCK_SUBMISSIONS.length;
  const assignmentCompletion = totalSubs ? Math.round((reviewed / totalSubs) * 100) : 0;
  return {
    totalStudents: students.length,
    totalInstructors: instructors.length,
    activeBatches: activeBatches.length,
    activeCourses: activeCourses.length,
    totalSessions,
    avgAttendance,
    assignmentCompletion,
    certificatesIssued: MOCK_CERTIFICATES.length,
  };
}

// ──────────────────────────────────────────────────────────
// MOCK CREDENTIALS — matches login form
// ──────────────────────────────────────────────────────────
export const MOCK_CREDENTIALS = [
  { email: "admin@atelier.com",       password: "admin123",      userId: "admin-001" },
  { email: "instructor@atelier.com",  password: "instructor123", userId: "inst-001"  },
  { email: "student@atelier.com",     password: "student123",    userId: "stu-001"   },
  // Extra demo accounts
  { email: "sarah.jenkins@atelier.com", password: "instructor123", userId: "inst-002" },
  { email: "elena.ro@atelier.com",      password: "student123",    userId: "stu-002"  },
];
