import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@junospace/supabase-client'
import { useAuth } from '../context/AuthContext'
import {
  Brain, Code2, Zap, Users2, TrendingUp,
  TrendingDown, Minus, BarChart3, Activity,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
  Area, AreaChart,
} from 'recharts'

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const COMPETENCY_MAP = [
  {
    key: 'Logic & Algorithms',
    label: 'Logic & Algorithms',
    icon: Brain,
    color: 'text-violet-600',
    barColor: 'bg-violet-500',
    bg: 'bg-violet-50',
    chartColor: '#7C3AED',
    fallbackScore: 0,
  },
  {
    key: 'Technical Stack',
    label: 'Technical Stack',
    icon: Code2,
    color: 'text-blue-600',
    barColor: 'bg-blue-500',
    bg: 'bg-blue-50',
    chartColor: '#3B82F6',
    fallbackScore: 0,
  },
  {
    key: 'Speed & Efficiency',
    label: 'Speed & Efficiency',
    icon: Zap,
    color: 'text-amber-600',
    barColor: 'bg-amber-500',
    bg: 'bg-amber-50',
    chartColor: '#F59E0B',
    fallbackScore: 0,
    highlight: true,
  },
  {
    key: 'Collaboration Score',
    label: 'Collaboration Score',
    icon: Users2,
    color: 'text-emerald-600',
    barColor: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    chartColor: '#10B981',
    fallbackScore: 0,
  },
]

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function Skeleton({ className = '' }) {
  return <div className={`bg-slate-200 animate-pulse rounded-xl ${className}`} />
}

function getWeekLabel(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isoWeekStart(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

function getTrend(data) {
  if (!data || data.length < 2) return null
  const last = data[data.length - 1]?.score ?? 0
  const prev = data[data.length - 2]?.score ?? 0
  return last - prev
}

// ─────────────────────────────────────────────
// Custom Tooltip
// ─────────────────────────────────────────────
function CustomLineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl">
      <p className="font-black text-white">{label}</p>
      <p className="text-violet-300 font-bold mt-0.5">
        Score: {payload[0]?.value?.toFixed(1)}%
      </p>
    </div>
  )
}

function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl">
      <p className="font-black text-white">{label}</p>
      <p className="text-violet-300 font-bold mt-0.5">
        Avg Score: {payload[0]?.value?.toFixed(1)}%
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────
// CompetencyMatrix
// ─────────────────────────────────────────────
function CompetencyCard({ meta, score, loading }) {
  const Icon = meta.icon
  const isLow = score < 50
  const isHigh = score >= 80

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-100 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <Skeleton className="w-14 h-5 rounded-full" />
        </div>
        <Skeleton className="h-7 w-20 mt-2" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl p-5 border-2 transition-all ${
      meta.highlight && isLow
        ? 'border-amber-300 shadow-amber-100 shadow-md'
        : 'border-slate-100'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center`}>
          <Icon size={18} className={meta.color} />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
          isHigh
            ? 'bg-emerald-50 text-emerald-600'
            : isLow
              ? 'bg-red-50 text-red-600'
              : 'bg-slate-50 text-slate-500'
        }`}>
          {isHigh ? 'Elite' : isLow ? 'Needs Work' : 'Core'}
        </span>
      </div>

      <p className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
        {score.toFixed(0)}<span className="text-lg text-slate-400">%</span>
      </p>
      <p className="text-xs font-bold text-slate-500 mt-1.5 mb-3">{meta.label}</p>

      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${meta.barColor} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  )
}

function CompetencyMatrix({ skillMap, loading }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Core Competency Matrix
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Live skill assessment</p>
        </div>
        <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Feedback
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {COMPETENCY_MAP.map(meta => (
          <CompetencyCard
            key={meta.key}
            meta={meta}
            score={skillMap[meta.key] ?? 0}
            loading={loading}
          />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// EfficiencyCard
// ─────────────────────────────────────────────
function EfficiencyCard({ efficiencyScore, weeklyData, loading }) {
  const trend = getTrend(weeklyData)
  const projectedLevel = efficiencyScore >= 85 ? 'Master' : efficiencyScore >= 70 ? 'Expert' : efficiencyScore >= 50 ? 'Proficient' : 'Core'
  const projDate = new Date()
  projDate.setMonth(projDate.getMonth() + 2)
  const projDateStr = projDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const sparkData = weeklyData.length > 0
    ? weeklyData
    : [{ week: '', score: 0 }, { week: '', score: 0 }]

  if (loading) {
    return (
      <div className="bg-[#6C35DE] rounded-2xl p-6 space-y-4">
        <Skeleton className="h-4 w-32 bg-white/20" />
        <Skeleton className="h-14 w-24 bg-white/20" />
        <Skeleton className="h-20 w-full bg-white/20" />
        <Skeleton className="h-4 w-48 bg-white/20" />
      </div>
    )
  }

  return (
    <div className="bg-[#6C35DE] rounded-2xl p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">
            Efficiency Score
          </p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-5xl font-black text-white tracking-tighter leading-none">
              {efficiencyScore.toFixed(0)}
            </span>
            <span className="text-xl font-bold text-white/60 mb-1">%</span>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[9px] font-black text-[#6C35DE] bg-white px-2.5 py-1 rounded-full uppercase tracking-widest shrink-0">
          <Zap size={9} className="fill-[#6C35DE]" />
          Peak Form
        </span>
      </div>

      {/* Trend indicator */}
      {trend !== null && (
        <div className="flex items-center gap-1.5 mb-3">
          {trend > 0 ? (
            <TrendingUp size={14} className="text-emerald-300" />
          ) : trend < 0 ? (
            <TrendingDown size={14} className="text-red-300" />
          ) : (
            <Minus size={14} className="text-white/50" />
          )}
          <p className="text-xs text-white/70 font-bold">
            {trend > 0
              ? `+${trend.toFixed(1)}% from last week`
              : trend < 0
                ? `${trend.toFixed(1)}% from last week`
                : 'Stable this week'}
          </p>
        </div>
      )}

      {/* Sparkline */}
      <div className="h-20 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="score"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth={2}
              fill="url(#sparkGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#fff', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Projection */}
      <p className="text-[11px] text-white/60 font-medium leading-relaxed mt-2">
        Projected to reach{' '}
        <span className="text-white font-black">{projectedLevel}</span>{' '}
        level by{' '}
        <span className="text-white font-black">{projDateStr}</span>
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────
// KnowledgeGrowthChart
// ─────────────────────────────────────────────
function KnowledgeGrowthChart({ weeklyData, monthlyData, loading }) {
  const [view, setView] = useState('monthly')
  const data = view === 'weekly' ? weeklyData : monthlyData
  const avgScore = data.length
    ? (data.reduce((s, d) => s + (d.score || 0), 0) / data.length).toFixed(1)
    : 0

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <div className="flex justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
        <Skeleton className="h-52 w-full" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Knowledge Growth
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Learning proficiency over the last 30 days
          </p>
          <p className="text-2xl font-black text-slate-800 tracking-tighter mt-2">
            {avgScore}
            <span className="text-sm text-slate-400 font-bold">% avg</span>
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-0.5 bg-slate-100 rounded-full p-0.5">
          {['monthly', 'weekly'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-150 ${
                view === v
                  ? 'bg-white text-[#6C35DE] shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {data.length < 2 ? (
        <div className="h-52 flex flex-col items-center justify-center text-center gap-2">
          <Activity size={28} className="text-slate-200" />
          <p className="text-xs font-bold text-slate-400">Not enough data yet</p>
          <p className="text-[11px] text-slate-300">Submit some assessments to see your growth.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6C35DE" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip content={<CustomLineTooltip />} />
            <ReferenceLine y={avgScore} stroke="#e2e8f0" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#lineGrad)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#6C35DE', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#6C35DE', strokeWidth: 2, stroke: '#ede9fe' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// SkillBalanceChart
// ─────────────────────────────────────────────
function SkillBalanceChart({ skillMap, loading }) {
  const data = Object.entries(skillMap)
    .map(([category, score]) => ({ category, score: parseFloat(score.toFixed(1)) }))
    .sort((a, b) => b.score - a.score)

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-52 w-full" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Skill Balance
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Average score per skill category</p>
        </div>
        <BarChart3 size={16} className="text-slate-300" />
      </div>

      {data.length === 0 ? (
        <div className="h-52 flex flex-col items-center justify-center text-center gap-2">
          <BarChart3 size={28} className="text-slate-200" />
          <p className="text-xs font-bold text-slate-400">No skill data yet</p>
          <p className="text-[11px] text-slate-300">Complete graded assignments to see your skill balance.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(180, data.length * 48)}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
            barSize={18}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6C35DE" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 10, fill: '#475569', fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              width={130}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8f7fc' }} />
            <Bar
              dataKey="score"
              fill="url(#barGrad)"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// AnalyticsPage — Main
// ─────────────────────────────────────────────
export function AnalyticsPage() {
  const { user } = useAuth()

  const [skillMap,       setSkillMap]       = useState({})
  const [weeklyData,     setWeeklyData]     = useState([])
  const [monthlyData,    setMonthlyData]    = useState([])
  const [efficiencyScore, setEfficiencyScore] = useState(0)
  const [loading,        setLoading]        = useState(true)

  const fetchAll = useCallback(async (studentId) => {
    setLoading(true)
    await Promise.all([
      fetchSkills(studentId),
      fetchGrowthData(studentId),
    ])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!user?.id) return
    fetchAll(user.id)
  }, [user, fetchAll])

  // ── Skills from mv_student_skills
  async function fetchSkills(studentId) {
    const { data } = await supabase
      .from('mv_student_skills')
      .select('skill_category, avg_score')
      .eq('student_id', studentId)

    if (!data) return

    const map = {}
    for (const row of data) {
      map[row.skill_category] = parseFloat(row.avg_score) || 0
    }
    setSkillMap(map)
  }

  // ── Assessment submissions for growth + efficiency
  async function fetchGrowthData(studentId) {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoff = thirtyDaysAgo.toISOString()

    const { data } = await supabase
      .from('assessment_submissions')
      .select('score, submitted_at')
      .eq('student_id', studentId)
      .not('score', 'is', null)
      .gte('submitted_at', cutoff)
      .order('submitted_at', { ascending: true })

    if (!data || !data.length) return

    // Efficiency = overall avg
    const overall = data.reduce((sum, r) => sum + (parseFloat(r.score) || 0), 0) / data.length
    setEfficiencyScore(overall)

    // Group by ISO week for weekly view
    const weekBuckets = {}
    for (const row of data) {
      const weekKey = isoWeekStart(row.submitted_at)
      if (!weekBuckets[weekKey]) weekBuckets[weekKey] = []
      weekBuckets[weekKey].push(parseFloat(row.score) || 0)
    }

    const weekly = Object.entries(weekBuckets)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([key, scores]) => ({
        week: getWeekLabel(key),
        score: scores.reduce((s, v) => s + v, 0) / scores.length,
      }))

    setWeeklyData(weekly)

    // Group by day for monthly view (aggregate by date label)
    const dayBuckets = {}
    for (const row of data) {
      const day = row.submitted_at.split('T')[0]
      if (!dayBuckets[day]) dayBuckets[day] = []
      dayBuckets[day].push(parseFloat(row.score) || 0)
    }

    const monthly = Object.entries(dayBuckets)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([key, scores]) => ({
        week: getWeekLabel(key),
        score: scores.reduce((s, v) => s + v, 0) / scores.length,
      }))

    setMonthlyData(monthly)
  }

  return (
    <div className="space-y-5">

      {/* ── Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Your live performance matrix and growth trajectory.
        </p>
      </div>

      {/* ── Row 1: Competency Matrix + Efficiency Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <CompetencyMatrix skillMap={skillMap} loading={loading} />
        </div>
        <div>
          <EfficiencyCard
            efficiencyScore={efficiencyScore}
            weeklyData={weeklyData}
            loading={loading}
          />
        </div>
      </div>

      {/* ── Row 2: Knowledge Growth + Skill Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <KnowledgeGrowthChart
          weeklyData={weeklyData}
          monthlyData={monthlyData}
          loading={loading}
        />
        <SkillBalanceChart skillMap={skillMap} loading={loading} />
      </div>

    </div>
  )
}
