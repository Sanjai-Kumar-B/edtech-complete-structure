import { useState, useEffect } from 'react'
import { supabase } from '@junospace/supabase-client'
import { Avatar, Badge, SkeletonBlock as Skeleton } from '@junospace/ui'
import { useAuth } from '../context/AuthContext'
import {
  Edit3, Check, X, Shield, Star, Zap, Flame, Award, Lightbulb,
  Lock, ExternalLink, MessageCircle, FileText
} from 'lucide-react'

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

function calculateStreak(dates) {
  if (!dates || dates.length === 0) return 0
  const uniqueDates = [...new Set(dates.map(d => d.split('T')[0]))].sort((a, b) => new Date(b) - new Date(a))
  let streak = 0
  let current = new Date()
  current.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const d = new Date(uniqueDates[i])
    d.setHours(0, 0, 0, 0)
    const diff = Math.floor((current - d) / (1000 * 60 * 60 * 24))
    
    if (diff === 0 || diff === 1) {
      streak++
      current = d
    } else {
      break
    }
  }
  return streak
}

// ─────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────

function ProfileHeader({ profile, leaderboard, streak, loading, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    department: '',
    specialization: '',
    bio: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile && !isEditing) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        address: profile.address || '',
        department: profile.department || '',
        specialization: profile.specialization || '',
        bio: profile.bio || ''
      })
    }
  }, [profile, isEditing])

  const handleSave = async () => {
    setSaving(true)
    await onSave(form)
    setSaving(false)
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 flex flex-col md:flex-row gap-6">
        <Skeleton className="w-32 h-32 rounded-3xl shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-full h-16" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="w-24 h-10" />
            <Skeleton className="w-24 h-10" />
            <Skeleton className="w-24 h-10" />
          </div>
        </div>
      </div>
    )
  }

  const avatarColor = profile?.avatar_color || '#6C35DE'
  const level = Math.floor((leaderboard?.total_points || 0) / 500) + 1

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 flex flex-col md:flex-row gap-6 items-start">
      {/* Avatar Box */}
      <Avatar name={profile?.full_name} size="lg" className="w-32 h-32 rounded-3xl shadow-lg shrink-0 text-4xl" />

      <div className="flex-1 min-w-0 w-full">
        {/* Role Badge */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant="warning" label="Current Champion" />
          
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-[#6C35DE] transition-colors p-1"
            >
              <Edit3 size={18} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-slate-100 rounded-lg"
              >
                <X size={16} />
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="text-emerald-600 hover:text-white hover:bg-emerald-500 p-1 bg-emerald-50 rounded-lg transition-colors"
              >
                <Check size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Edit Form or Display */}
        {isEditing ? (
          <div className="space-y-4 mb-6">
            <input 
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full text-2xl font-black text-slate-800 bg-slate-50 border-transparent focus:border-[#6C35DE] focus:ring-0 rounded-xl px-4 py-2"
              placeholder="Your Name"
            />
            <textarea 
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={2}
              className="w-full text-sm text-slate-600 bg-slate-50 border-transparent focus:border-[#6C35DE] focus:ring-0 rounded-xl px-4 py-2 resize-none"
              placeholder="Write a short bio..."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#6C35DE] focus:ring-0" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Date of Birth</label>
                <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#6C35DE] focus:ring-0" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Address</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#6C35DE] focus:ring-0" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Department</label>
                <input name="department" value={form.department} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#6C35DE] focus:ring-0" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Specialization</label>
                <input name="specialization" value={form.specialization} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#6C35DE] focus:ring-0" />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-1">
              {profile?.full_name || 'Student'}
            </h1>
            <p className="text-xs font-bold text-[#6C35DE] mb-3 uppercase tracking-wider">
              {profile?.specialization ? `${profile.specialization} · ` : ''}{profile?.department || 'General Enrollment'}
            </p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mb-4">
              {profile?.bio || <span className="italic opacity-60">No bio written yet. Click the edit icon to add one.</span>}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs font-medium text-slate-500 border-t border-slate-100 pt-4">
              {profile?.email && <div><span className="text-slate-400 font-bold uppercase text-[9px] block">Email</span>{profile.email}</div>}
              {profile?.phone && <div><span className="text-slate-400 font-bold uppercase text-[9px] block">Phone</span>{profile.phone}</div>}
              {profile?.date_of_birth && <div><span className="text-slate-400 font-bold uppercase text-[9px] block">DOB</span>{profile.date_of_birth}</div>}
              {profile?.address && <div><span className="text-slate-400 font-bold uppercase text-[9px] block">Location</span>{profile.address}</div>}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex flex-wrap gap-3 mt-6">
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 flex items-center gap-3">
            <Shield size={16} className="text-blue-500" />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Level</p>
              <p className="text-lg font-black text-slate-700 leading-tight">{level}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 flex items-center gap-3">
            <Flame size={16} className="text-orange-500" />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Streak</p>
              <p className="text-lg font-black text-slate-700 leading-tight">{streak} <span className="text-xs font-bold text-slate-400">Days</span></p>
            </div>
          </div>

          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 flex items-center gap-3">
            <Award size={16} className="text-emerald-500" />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Rank</p>
              <p className="text-lg font-black text-slate-700 leading-tight">#{leaderboard?.rank || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExperienceBar({ totalPoints, loading }) {
  if (loading) {
    return <Skeleton className="h-48 w-full" />
  }

  const points = totalPoints || 0
  const levelPoints = 500
  const currentLevelXP = points % levelPoints
  const xpNeeded = levelPoints - currentLevelXP
  const pct = Math.round((currentLevelXP / levelPoints) * 100)

  return (
    <div className="bg-[#6C35DE] rounded-2xl p-6 lg:p-8 text-white flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      
      <div>
        <div className="flex justify-between items-end mb-2">
          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Experience</p>
          <p className="text-2xl font-black">{currentLevelXP} <span className="text-sm text-white/70 font-bold">/ {levelPoints} XP</span></p>
        </div>
        
        <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden mt-2 mb-4">
          <div 
            className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        
        <p className="text-xs font-medium text-white/80">
          Only <span className="font-bold text-white">{xpNeeded} XP</span> more to reach the next level!
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl border border-white/10">
        <Zap size={16} className="text-amber-300 fill-amber-300" />
        <p className="text-xs font-bold">
          <span className="text-amber-300">+15% productivity</span> this week
        </p>
      </div>
    </div>
  )
}

function AchievementGrid({ achievements, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 h-full">
        <Skeleton className="w-32 h-4 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="w-full h-32 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Achievements</h3>
        <button className="text-[10px] font-bold text-[#6C35DE] hover:underline uppercase tracking-wider">
          View All Badges
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {achievements.map((a, i) => (
          <div 
            key={i} 
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
              a.earned 
                ? `${a.bg} ${a.border}`
                : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm ${
              a.earned ? a.iconBg : 'bg-slate-200'
            }`}>
              {a.earned ? <a.icon size={20} className={a.iconColor} /> : <Lock size={16} className="text-slate-400" />}
            </div>
            
            <p className={`text-xs font-black tracking-tight leading-tight ${a.earned ? 'text-slate-800' : 'text-slate-400'}`}>
              {a.title}
            </p>
            
            {!a.earned && (
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5 bg-slate-100 px-2 py-0.5 rounded-full">
                Locked
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectPortfolio({ projects, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 h-full">
        <Skeleton className="w-40 h-5 mb-2" />
        <Skeleton className="w-64 h-3 mb-6" />
        <div className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="w-full h-24 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">Project Portfolio</h3>
        <p className="text-xs text-slate-500 mt-1">A curated showcase of best academic work</p>
      </div>

      {projects.length === 0 ? (
        <div className="py-10 flex flex-col items-center text-center">
          <FileText size={32} className="text-slate-200 mb-3" />
          <p className="text-sm font-bold text-slate-600">No projects yet</p>
          <p className="text-xs text-slate-400 mt-1">Score 80+ on assignments to feature them here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <div key={idx} className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#6C35DE]/30 hover:bg-[#6C35DE]/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-[#6C35DE]/10 transition-colors">
                  <FileText size={18} className="text-blue-500 group-hover:text-[#6C35DE]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">{proj.title}</p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">
                    Score: {proj.score}%
                  </p>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-sm hover:text-[#6C35DE] transition-all shrink-0">
                <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// ProfilePage — Main
// ─────────────────────────────────────────────
export function ProfilePage() {
  const { user, profile } = useAuth()
  
  const [leaderboard, setLeaderboard] = useState(null)
  const [streak, setStreak] = useState(0)
  const [achievements, setAchievements] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (user?.id) fetchAllData(user.id)
  }, [user, refreshTrigger])

  async function fetchAllData(studentId) {
    setLoading(true)

    // 1. Leaderboard
    const { data: lbData } = await supabase
      .from('mv_leaderboard_scores')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle()
    
    setLeaderboard(lbData)

    // 2. Attendance (for streak and Fire Scholar)
    const { data: attData } = await supabase
      .from('attendance')
      .select('marked_at')
      .eq('student_id', studentId)
      .eq('status', 'present')
      .order('marked_at', { ascending: false })
    
    const attDates = (attData || []).map(a => a.marked_at)
    const currentStreak = calculateStreak(attDates)
    setStreak(currentStreak)

    // 3. Assessment Submissions (for Polymathematic)
    const { data: asmts } = await supabase
      .from('assessment_submissions')
      .select('score')
      .eq('student_id', studentId)
    
    const avgAsmtScore = asmts?.length 
      ? asmts.reduce((s, a) => s + (parseFloat(a.score)||0), 0) / asmts.length 
      : 0

    // 4. Enrollments -> Sessions (for Lab Leader)
    const { data: enr } = await supabase
      .from('enrollments')
      .select('batch_id')
      .eq('student_id', studentId)
    
    let totalSessionsEnrolled = 0
    if (enr && enr.length > 0) {
      const { count } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .in('batch_id', enr.map(e => e.batch_id))
      totalSessionsEnrolled = count || 0
    }

    // Determine Achievements
    const hasFireScholar = currentStreak >= 30
    const hasPolymathematic = avgAsmtScore > 80 && asmts.length >= 5
    const hasLabLeader = totalSessionsEnrolled >= 10

    setAchievements([
      {
        title: 'Fire Scholar',
        earned: hasFireScholar,
        icon: Flame,
        bg: 'bg-orange-50',
        border: 'border-orange-100',
        iconBg: 'bg-orange-500',
        iconColor: 'text-white'
      },
      {
        title: 'Polymathematic',
        earned: hasPolymathematic,
        icon: Lightbulb,
        bg: 'bg-violet-50',
        border: 'border-violet-100',
        iconBg: 'bg-[#6C35DE]',
        iconColor: 'text-white'
      },
      {
        title: 'Lab Leader',
        earned: hasLabLeader,
        icon: Shield,
        bg: 'bg-teal-50',
        border: 'border-teal-100',
        iconBg: 'bg-teal-500',
        iconColor: 'text-white'
      },
      {
        title: 'Elite Architect',
        earned: false, // Locked for everyone currently
        icon: Star,
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        iconBg: 'bg-slate-200',
        iconColor: 'text-slate-400'
      }
    ])

    // 5. Project Portfolio
    const { data: subs } = await supabase
      .from('assignment_submissions')
      .select(`
        score,
        submitted_at,
        assignments (title)
      `)
      .eq('student_id', studentId)
      .gte('score', 80)
      .order('submitted_at', { ascending: false })
      .limit(5)

    const mappedProjects = (subs || []).map(s => ({
      title: s.assignments?.title || 'Unknown Assignment',
      score: s.score,
      date: s.submitted_at
    }))

    setProjects(mappedProjects)
    setLoading(false)
  }

  const handleUpdateProfile = async (formData) => {
    if (!user?.id) return
    await supabase.from('users').update({ 
      full_name: formData.full_name, 
      phone: formData.phone,
      date_of_birth: formData.date_of_birth,
      address: formData.address,
      department: formData.department,
      specialization: formData.specialization,
      bio: formData.bio
    }).eq('id', user.id)
    // Force re-fetch so AuthContext or local state is in sync
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="relative pb-24">
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* ── Top Row: Header + XP Bar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ProfileHeader 
              profile={profile} 
              leaderboard={leaderboard} 
              streak={streak} 
              loading={loading}
              onSave={handleUpdateProfile}
            />
          </div>
          <div className="xl:col-span-1">
            <ExperienceBar totalPoints={leaderboard?.total_points} loading={loading} />
          </div>
        </div>

        {/* ── Bottom Row: Achievements + Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <AchievementGrid achievements={achievements} loading={loading} />
          </div>
          <div>
            <ProjectPortfolio projects={projects} loading={loading} />
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#6C35DE] hover:bg-[#5a2bc4] rounded-full shadow-lg shadow-[#6C35DE]/30 flex items-center justify-center text-white transition-transform hover:scale-110 z-50">
        <MessageCircle size={24} />
      </button>
    </div>
  )
}
