// ============================================================
// ATELIER ACADEMY — STUDENT PORTAL MOCK DATA
// RLS simulation: only returns data for the logged-in student.
// ============================================================

export {
  MOCK_USERS, MOCK_COURSES, MOCK_BATCHES, MOCK_ENROLLMENTS,
  MOCK_SESSIONS, MOCK_ATTENDANCE, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS,
  MOCK_ROADMAP_WEEKS, MOCK_CERTIFICATES, MOCK_CREDENTIALS,
  getCourseById, getUserById, getBatchById,
  getCertificatesForStudent, verifyCertificate, getRoadmapForBatch,
} from "./sharedMockData";

import {
  MOCK_ENROLLMENTS, MOCK_SESSIONS, MOCK_ATTENDANCE, MOCK_ASSIGNMENTS,
  MOCK_SUBMISSIONS, MOCK_BATCHES, MOCK_CERTIFICATES,
  getCourseById, getUserById, getBatchById,
  getSessionsForBatch, getAttendanceForStudent, getMentorNotesForStudent,
  getRoadmapForBatch,
} from "./sharedMockData";

// RLS: only this student's enrollments
export function getMyEnrollments(studentId) {
  return MOCK_ENROLLMENTS.filter((e) => e.student_id === studentId).map((e) => {
    const batch = MOCK_BATCHES.find((b) => b.id === e.batch_id);
    const course = batch ? getCourseById(batch.course_id) : null;
    return { ...e, batch, course };
  });
}

// Sessions for student's enrolled batches
export function getMyUpcomingSessions(studentId) {
  const batchIds = MOCK_ENROLLMENTS.filter((e) => e.student_id === studentId).map((e) => e.batch_id);
  return MOCK_SESSIONS.filter((s) => batchIds.includes(s.batch_id)).map((s) => {
    const batch = MOCK_BATCHES.find((b) => b.id === s.batch_id);
    const course = batch ? getCourseById(batch.course_id) : null;
    const scheduledAt = s.scheduled_at ? new Date(s.scheduled_at) : null;
    const now = new Date();
    const minutesDiff = scheduledAt ? (scheduledAt - now) / 60000 : Infinity;
    const isLive = minutesDiff >= -90 && minutesDiff <= 30; // within 30 min before to 90 min after
    return { ...s, batch, course, scheduledAt, isLive };
  }).sort((a, b) => (a.scheduledAt || 0) - (b.scheduledAt || 0));
}

// Student's own attendance records
export function getMyAttendanceSummary(studentId) {
  const batchIds = MOCK_ENROLLMENTS.filter((e) => e.student_id === studentId).map((e) => e.batch_id);
  const totalSessions = MOCK_SESSIONS.filter((s) => batchIds.includes(s.batch_id)).length;
  const myAttendance = getAttendanceForStudent(studentId);
  const presentCount = myAttendance.filter((a) => a.status === "present").length;
  const pct = totalSessions ? Math.round((presentCount / totalSessions) * 100) : 0;
  return { total: totalSessions, present: presentCount, pct };
}

// Assignments for student's batches
export function getMyAssignments(studentId) {
  const batchIds = MOCK_ENROLLMENTS.filter((e) => e.student_id === studentId).map((e) => e.batch_id);
  return MOCK_ASSIGNMENTS.filter((a) => batchIds.includes(a.batch_id)).map((a) => {
    const submission = MOCK_SUBMISSIONS.find((s) => s.assignment_id === a.id && s.student_id === studentId);
    return { ...a, submission: submission || null };
  });
}

// Student's skill analytics
export function getSkillAnalytics(studentId) {
  const submissions = MOCK_SUBMISSIONS.filter((s) => s.student_id === studentId && s.status === "reviewed" && s.score !== null);
  const byCategory = {};
  submissions.forEach((sub) => {
    const asgn = MOCK_ASSIGNMENTS.find((a) => a.id === sub.assignment_id);
    const cat = asgn?.skill_category || "General";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(sub.score / (asgn?.max_score || 100) * 100);
  });
  return Object.entries(byCategory).map(([category, scores]) => ({
    category,
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    count: scores.length,
  }));
}

// Leaderboard for student's batch
export function getLeaderboard(studentId) {
  const batchIds = MOCK_ENROLLMENTS.filter((e) => e.student_id === studentId).map((e) => e.batch_id);
  if (!batchIds.length) return [];
  const batchId = batchIds[0];
  const batchStudentIds = MOCK_ENROLLMENTS.filter((e) => e.batch_id === batchId).map((e) => e.student_id);
  return batchStudentIds.map((sid) => {
    const student = getUserById(sid);
    const assignments = MOCK_ASSIGNMENTS.filter((a) => a.batch_id === batchId);
    const reviews = MOCK_SUBMISSIONS.filter((s) => s.student_id === sid && s.status === "reviewed" && s.score !== null && assignments.some((a) => a.id === s.assignment_id));
    const avgScore = reviews.length ? Math.round(reviews.reduce((sum, s) => sum + s.score, 0) / reviews.length) : 0;
    const attendance = getAttendanceForStudent(sid);
    const sessions = MOCK_SESSIONS.filter((s) => s.batch_id === batchId);
    const attendancePct = sessions.length ? Math.round((attendance.filter((a) => a.status === "present").length / sessions.length) * 100) : 0;
    return { student, avgScore, attendancePct, isMe: sid === studentId };
  }).sort((a, b) => b.avgScore - a.avgScore).map((item, idx) => ({ ...item, rank: idx + 1 }));
}
