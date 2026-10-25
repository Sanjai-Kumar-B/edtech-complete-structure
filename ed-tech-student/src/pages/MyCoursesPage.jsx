import { useEffect, useState } from 'react'
import { supabase } from '@junospace/supabase-client'
import { useAuth } from '../context/AuthContext'
import {
  BookOpen, CheckCircle2, Loader2, ChevronRight,
  FileText, Clock, AlertCircle, MoreHorizontal,
  GraduationCap, PlayCircle, BarChart3,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean)
  if (!parts.length) return '?'
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase()
}

function stringToColor(str = '') {
  const palette = [
    '#6C35DE', '#0EA5E9', '#10B981', '#F59E0B',
    '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return palette[Math.abs(hash) % palette.length]
}

function relativeDeadline(dueDateStr) {
  if (!dueDateStr) return { label: 'No deadline', cls: 'text-slate-400' }
  const due = new Date(dueDateStr)
  const now = new Date()
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return { label: 'Overdue', cls: 'text-red-500 font-bold' }
  if (diff === 0) return { label: 'Due Today', cls: 'text-orange-500 font-bold' }
  if (diff === 1) return { label: 'Due Tomorrow', cls: 'text-amber-500 font-bold' }
  return {
    label: `Due ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    cls: 'text-slate-500',
  }
}

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────
function Skeleton({ className = '' }) {
  return <div className={`bg-slate-200 animate-pulse rounded-xl ${className}`} />
}

// ─────────────────────────────────────────────
// StatsRow
// ─────────────────────────────────────────────
function StatsRow({ total, completed, inProgress, loading }) {
  const cards = [
    {
      label: 'Total Enrolled',
      value: total,
      icon: BookOpen,
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      ring: 'ring-violet-200',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      ring: 'ring-emerald-200',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Loader2,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      ring: 'ring-blue-200',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {cards.map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-12 h-7 rounded-lg" />
            </div>
            <Skeleton className="h-3 w-28 mt-2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, bg, text, ring }) => (
        <div
          key={label}
          className={`bg-white rounded-2xl p-5 border border-slate-100 ring-1 ${ring} flex items-center justify-between`}
        >
          <div>
            <p className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
              {value ?? 0}
            </p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1.5">
              {label}
            </p>
          </div>
          <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
            <Icon size={20} className={text} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// CourseCard
// ─────────────────────────────────────────────
function CourseCard({ enrollment, loading }) {
  const [progress, setProgress] = useState(null)
  const [progLoading, setProgLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!enrollment || !user?.id) return
    fetchProgress(user.id, enrollment.batch_id)
  }, [enrollment, user])

  async function fetchProgress(studentId, batchId) {
    setProgLoading(true)
    setTimeout(() => {
      setProgress({
        attendance_pct: 85,
        total_sessions: 12,
        attended_sessions: 10,
        assignments_total: 5,
        assignments_submitted: 3,
        assessments_total: 2,
        assessments_submitted: 1,
        avg_assignment_score: 92
      });
      setProgLoading(false)
    }, 600)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex">
        <Skeleton className="w-36 shrink-0 rounded-none rounded-l-2xl" />
        <div className="flex-1 p-5 space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-2 w-full rounded-full mt-4" />
          <div className="flex gap-3 mt-4">
            <Skeleton className="h-9 w-36 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  const course = enrollment.batches?.courses
  const instructor = enrollment.batches?.users
  const thumbColor = course?.thumbnail_color || '#6C35DE'
  const instName = instructor?.full_name || 'Instructor'
  const instInitials = getInitials(instName)
  const instColor = stringToColor(instName)

  const attendPct = progress?.attendance_pct ?? 0
  const assignPct = progress?.assignments_total
    ? Math.round((progress.assignments_submitted / progress.assignments_total) * 100)
    : 0
  const overallPct = Math.round((attendPct + assignPct) / 2)

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex hover:shadow-md hover:shadow-slate-200/60 transition-shadow duration-200 group">

      {/* ── Thumbnail ── */}
      <div
        className="w-36 shrink-0 relative flex flex-col items-center justify-center p-4 gap-2"
        style={{ backgroundColor: thumbColor }}
      >
        {/* Course code badge */}
        <span className="absolute top-3 left-3 text-[9px] font-black text-white/90 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-widest">
          {course?.code || 'COURSE'}
        </span>
        <BookOpen size={32} className="text-white/70" />
        <span className="text-[10px] font-black text-white/80 text-center leading-snug max-w-[90px] uppercase tracking-wide line-clamp-2">
          {course?.department || ''}
        </span>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div>
          {/* Course title */}
          <h3 className="text-[16px] font-black text-slate-800 leading-snug tracking-tight line-clamp-1 group-hover:text-[#6C35DE] transition-colors">
            {course?.title || 'Untitled Course'}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-black shrink-0"
              style={{ backgroundColor: instColor }}
            >
              {instInitials}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Lead Instructor:{' '}
              <span className="font-bold text-slate-700">{instName}</span>
            </p>
          </div>

          {/* Batch info */}
          <div className="flex items-center gap-3 mt-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full">
              {enrollment.batches?.batch_code || 'BATCH'}
            </span>
            {enrollment.batches?.status && (
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${enrollment.batches.status === 'active'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-slate-50 text-slate-400'
                }`}>
                {enrollment.batches.status}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Overall Progress
            </p>
            {progLoading ? (
              <Skeleton className="h-3 w-8" />
            ) : (
              <span className="text-xs font-black text-[#6C35DE]">{overallPct}%</span>
            )}
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            {progLoading ? (
              <div className="h-full w-1/2 bg-slate-200 animate-pulse rounded-full" />
            ) : (
              <div
                className="h-full bg-[#6C35DE] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${overallPct}%` }}
              />
            )}
          </div>
          {!progLoading && progress && (
            <div className="flex gap-4 mt-2">
              <p className="text-[10px] text-slate-400">
                <span className="font-bold text-slate-600">{progress.attended_sessions}</span>
                /{progress.total_sessions} sessions
              </p>
              <p className="text-[10px] text-slate-400">
                <span className="font-bold text-slate-600">{progress.assignments_submitted}</span>
                /{progress.assignments_total} assignments
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 mt-4">
          <button onClick={() => navigate(`/courses/${enrollment.batches?.courses?.code || '123'}`)} className="flex items-center gap-2 bg-[#6C35DE] hover:bg-[#5a2bc4] text-white px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 shadow-md shadow-[#6C35DE]/20 active:scale-95">
            <PlayCircle size={13} />
            Continue Learning
          </button>
          <button className="w-9 h-9 rounded-full border-2 border-slate-200 hover:border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all duration-150">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* ── Right mini stats panel ── */}
      {!progLoading && progress && (
        <div className="hidden xl:flex flex-col justify-center gap-4 px-5 border-l border-slate-100 min-w-[140px]">
          <MiniStat label="Attendance" value={`${progress.attendance_pct ?? 0}%`} color="text-emerald-600" />
          <MiniStat label="Assignments" value={`${progress.assignments_submitted}/${progress.assignments_total}`} color="text-violet-600" />
          <MiniStat label="Assessments" value={`${progress.assessments_submitted}/${progress.assessments_total}`} color="text-blue-600" />
          {progress.avg_assignment_score != null && (
            <MiniStat label="Avg Score" value={`${progress.avg_assignment_score}`} color="text-amber-600" />
          )}
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
      <p className={`text-base font-black ${color} tracking-tighter mt-0.5`}>{value}</p>
    </div>
  )
}

// ─────────────────────────────────────────────
// RecentAssignmentsList
// ─────────────────────────────────────────────
function AssignmentItem({ item }) {
  const deadline = relativeDeadline(item.due_date)
  const submitted = item.submitted

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0 group cursor-pointer hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-colors">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${submitted ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'
        }`}>
        {submitted ? <CheckCircle2 size={15} /> : <FileText size={15} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          {item.course_code || 'COURSE'}
        </p>
        <p className="text-sm font-bold text-slate-700 leading-snug line-clamp-1 group-hover:text-[#6C35DE] transition-colors">
          {item.title}
        </p>
        <p className={`text-[10px] mt-0.5 ${submitted ? 'text-emerald-600 font-bold' : deadline.cls}`}>
          {submitted ? '✓ Submitted' : deadline.label}
        </p>
      </div>
      <ChevronRight size={13} className="text-slate-300 group-hover:text-[#6C35DE] mt-1 shrink-0 transition-colors" />
    </div>
  )
}

function RecentAssignmentsList({ assignments, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <Skeleton className="h-4 w-40 mb-4" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
            <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-20">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Recent Assignments
        </p>
        {assignments.length > 0 && (
          <span className="text-[9px] font-black text-[#6C35DE] bg-[#6C35DE]/10 px-2 py-0.5 rounded-full">
            {assignments.filter(a => !a.submitted).length} pending
          </span>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="py-10 flex flex-col items-center text-center gap-2">
          <CheckCircle2 size={28} className="text-emerald-400" />
          <p className="text-xs font-bold text-emerald-600">All done!</p>
          <p className="text-[11px] text-slate-400">No assignments yet.</p>
        </div>
      ) : (
        <div>
          {assignments.map((item, i) => (
            <AssignmentItem key={i} item={item} />
          ))}
        </div>
      )}

      {/* Overdue count warning */}
      {assignments.filter(a => !a.submitted && a.due_date && new Date(a.due_date) < new Date()).length > 0 && (
        <div className="mt-3 flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-3 py-2">
          <AlertCircle size={13} />
          <p className="text-[10px] font-bold">
            {assignments.filter(a => !a.submitted && a.due_date && new Date(a.due_date) < new Date()).length} overdue — act now
          </p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// MyCoursesPage — Main
// ─────────────────────────────────────────────
export function MyCoursesPage() {
  const { user } = useAuth()

  const [enrollments, setEnrollments] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [assgnLoading, setAssgnLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    fetchEnrollments(user.id)
    fetchAssignments(user.id)
  }, [user])

  // ── Enrollments with batches → courses → instructor
  async function fetchEnrollments(studentId) {
    setLoading(true)
    setTimeout(() => {
      setEnrollments([
        {
          id: 'mock-1',
          batch_id: 'mock-batch-1',
          status: 'active',
          enrolled_at: new Date().toISOString(),
          batches: {
            batch_code: 'ARC-101-FALL',
            status: 'active',
            courses: {
              code: 'ARC101',
              title: 'Introduction to Urban Design',
              department: 'Architecture',
              thumbnail_color: '#6C35DE',
            },
            users: {
              full_name: 'Dr. Sarah Jenkins',
              avatar_color: '#0EA5E9'
            }
          }
        },
        {
          id: 'mock-2',
          batch_id: 'mock-batch-2',
          status: 'active',
          enrolled_at: new Date().toISOString(),
          batches: {
            batch_code: 'UX-204-WIN',
            status: 'active',
            courses: {
              code: 'UX204',
              title: 'Human-Computer Interaction in Public Spaces',
              department: 'Design',
              thumbnail_color: '#EC4899',
            },
            users: {
              full_name: 'Prof. Marcus Chen',
              avatar_color: '#F59E0B'
            }
          }
        }
      ]);
      setLoading(false)
    }, 800)
  }

  // ── Recent assignments + submission status
  async function fetchAssignments(studentId) {
    setAssgnLoading(true)
    setTimeout(() => {
      setAssignments([
        {
          id: 'a1',
          title: 'Essay: The Future of Smart Cities',
          course_code: 'ARC101',
          due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
          submitted: false
        },
        {
          id: 'a2',
          title: 'Case Study Analysis',
          course_code: 'UX204',
          due_date: new Date(Date.now() - 86400000).toISOString(),
          submitted: false
        },
        {
          id: 'a3',
          title: 'Drafting Assignment 1',
          course_code: 'ARC101',
          due_date: new Date(Date.now() - 86400000 * 5).toISOString(),
          submitted: true
        }
      ])
      setAssgnLoading(false)
    }, 800)
  }

  // Compute stats
  const total = enrollments.length
  const completed = enrollments.filter(e => e.batches?.status === 'completed').length
  const inProgress = enrollments.filter(e => e.batches?.status === 'active').length

  return (
    <div className="space-y-6">

      {/* ── Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">My Courses</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track your progress across all enrolled courses.
        </p>
      </div>

      {/* ── Stats Row */}
      <StatsRow
        total={total}
        completed={completed}
        inProgress={inProgress}
        loading={loading}
      />

      {/* ── Main Layout: Course list + Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Course Cards */}
        <div className="xl:col-span-2 space-y-4">
          {loading ? (
            [1, 2, 3].map(i => <CourseCard key={i} loading={true} />)
          ) : enrollments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 py-16 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                <GraduationCap size={28} className="text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-500">Not enrolled in any courses yet.</p>
              <p className="text-xs text-slate-400 max-w-xs">
                Contact your instructor or admin to get enrolled in a batch.
              </p>
            </div>
          ) : (
            enrollments.map(enrollment => (
              <CourseCard
                key={enrollment.id}
                enrollment={enrollment}
                loading={false}
              />
            ))
          )}
        </div>

        {/* Recent Assignments Sidebar */}
        <div className="xl:col-span-1">
          <RecentAssignmentsList
            assignments={assignments}
            loading={assgnLoading}
          />
        </div>
      </div>
    </div>
  )
}
