import React, { useState, useEffect } from 'react';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col items-center justify-center text-center animate-pulse h-full">
      <div className="w-32 h-32 rounded-[2rem] bg-slate-200 mb-6" />
      <div className="w-32 h-6 bg-slate-200 rounded-full mb-2" />
      <div className="w-24 h-4 bg-slate-100 rounded-full mb-6" />
      <div className="w-28 h-12 bg-slate-100 rounded-2xl" />
    </div>
  );
}

const PODIUM_STYLES = {
  1: {
    wrapperClass: 'order-1 md:order-2 h-full scale-105 z-10 bg-white rounded-[3rem] border border-amber-200/60 p-8 flex flex-col items-center justify-center text-center relative group hover:-translate-y-2 transition-all duration-300 shadow-2xl shadow-amber-100 mt-16 md:mt-0',
    avatarWrap: 'relative w-32 h-32 rounded-[2rem] bg-gradient-to-br from-amber-300 to-amber-500 p-1 shadow-xl shadow-amber-300/40',
    badge: 'absolute -bottom-3 -right-3 w-10 h-10 bg-amber-500 shadow-lg shadow-amber-500/40 rounded-2xl flex items-center justify-center text-white font-black border-2 border-white text-lg z-20',
    roleBadge: 'text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-6',
    scoreBox: 'px-8 py-4 bg-amber-50 rounded-2xl border border-amber-100 group-hover:bg-amber-100',
    scoreLabel: 'text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1',
    scoreText: 'text-3xl font-black text-amber-900',
    nameClass: 'text-3xl font-black text-slate-800 tracking-tight leading-tight mb-1 group-hover:text-amber-600 transition-colors duration-300',
    roleLabel: 'Current Champion',
    inset: <div className="absolute inset-0 bg-gradient-to-t from-amber-50 to-transparent rounded-[3rem] pointer-events-none" />,
  },
  2: {
    wrapperClass: 'order-2 md:order-1 h-[80%] opacity-95 hover:opacity-100 bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col items-center justify-center text-center relative group hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-slate-200/40 mt-16 md:mt-0',
    avatarWrap: 'relative w-32 h-32 rounded-[2rem] bg-gradient-to-br from-slate-300 to-slate-400 p-1 shadow-lg shadow-slate-300/40',
    badge: 'absolute -bottom-3 -right-3 w-10 h-10 bg-slate-800 shadow-lg shadow-slate-800/30 rounded-2xl flex items-center justify-center text-white font-black border-2 border-white text-lg z-20',
    roleBadge: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6',
    scoreBox: 'px-8 py-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-violet-50 group-hover:border-violet-100',
    scoreLabel: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-violet-500 transition-colors',
    scoreText: 'text-3xl font-black text-slate-800 group-hover:text-violet-700 transition-colors',
    nameClass: 'text-2xl font-black text-slate-800 tracking-tight leading-tight mb-1 group-hover:text-violet-600 transition-colors duration-300',
    roleLabel: 'Elite Performer',
    inset: null,
  },
  3: {
    wrapperClass: 'order-3 md:order-3 h-[80%] opacity-95 hover:opacity-100 bg-white rounded-[3rem] border border-slate-100 p-8 flex flex-col items-center justify-center text-center relative group hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-slate-200/40 mt-16 md:mt-0',
    avatarWrap: 'relative w-32 h-32 rounded-[2rem] bg-gradient-to-br from-orange-300 to-orange-400 p-1 shadow-lg shadow-orange-300/40',
    badge: 'absolute -bottom-3 -right-3 w-10 h-10 bg-slate-800 shadow-lg shadow-slate-800/30 rounded-2xl flex items-center justify-center text-white font-black border-2 border-white text-lg z-20',
    roleBadge: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6',
    scoreBox: 'px-8 py-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-violet-50 group-hover:border-violet-100',
    scoreLabel: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-violet-500 transition-colors',
    scoreText: 'text-3xl font-black text-slate-800 group-hover:text-violet-700 transition-colors',
    nameClass: 'text-2xl font-black text-slate-800 tracking-tight leading-tight mb-1 group-hover:text-violet-600 transition-colors duration-300',
    roleLabel: 'Elite Performer',
    inset: null,
  },
};

function getInitials(name = '') {
  const parts = (name || '').trim().split(' ').filter(Boolean);
  if (!parts.length) return '?';
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
}

export function LeaderboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [myEntry, setMyEntry] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        // Get global leaderboard: aggregate total_score across all batches per student
        // We use the leaderboard_scores view and sum per student
        const { data: rows, error: err } = await supabase
          .from('leaderboard_scores')
          .select('student_id, full_name, avatar_initials, avatar_color, total_score, batch_id');

        if (err) throw err;

        // Aggregate across batches: sum total_score per student
        const byStudent = {};
        (rows || []).forEach((r) => {
          if (!byStudent[r.student_id]) {
            byStudent[r.student_id] = {
              student_id: r.student_id,
              full_name: r.full_name,
              avatar_initials: r.avatar_initials || getInitials(r.full_name),
              avatar_color: r.avatar_color || '#6C35DE',
              total_score: 0,
              batch_count: 0,
            };
          }
          byStudent[r.student_id].total_score += Number(r.total_score || 0);
          byStudent[r.student_id].batch_count += 1;
        });

        // Sort descending and add global rank
        const sorted = Object.values(byStudent)
          .sort((a, b) => b.total_score - a.total_score)
          .map((s, i) => ({ ...s, rank: i + 1, total_score: Math.round(s.total_score) }));

        setLeaderboard(sorted);

        if (user?.id) {
          const mine = sorted.find((s) => s.student_id === user.id);
          setMyEntry(mine || null);
        }
      } catch (e) {
        setError(e.message || 'Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Arrange podium: 2, 1, 3
  const podiumOrder = [
    top3.find((s) => s.rank === 2),
    top3.find((s) => s.rank === 1),
    top3.find((s) => s.rank === 3),
  ].filter(Boolean);

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Innovation Board</h2>
          <p className="text-slate-500 font-medium mt-3">Recognizing the elite minds and consistent builders of Junospace.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Rankings</span>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-6 text-sm font-bold">
          {error}
        </div>
      )}

      {/* PODIUM */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 h-auto lg:h-[500px] items-end px-4 mt-16 lg:mt-0">
        {loading ? (
          [1, 2, 3].map((i) => <SkeletonCard key={i} />)
        ) : top3.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-slate-400 font-bold">
            No leaderboard data yet. Complete assignments and assessments to appear here!
          </div>
        ) : (
          podiumOrder.map((s) => {
            const st = PODIUM_STYLES[s.rank];
            if (!st) return null;
            return (
              <div key={s.student_id} className={st.wrapperClass}>
                {st.inset}
                <div className="absolute -top-16">
                  <div className={st.avatarWrap}>
                    <div
                      className="w-full h-full rounded-[1.8rem] flex items-center justify-center text-4xl font-black text-white overflow-hidden border-[4px] border-white relative z-10"
                      style={{ backgroundColor: s.avatar_color }}
                    >
                      {s.avatar_initials || getInitials(s.full_name)}
                    </div>
                  </div>
                  <div className={st.badge}>{s.rank}</div>
                </div>
                <div className={`mt-20 relative z-10`}>
                  <h3 className={st.nameClass}>{s.full_name}</h3>
                  <p className={st.roleBadge}>{st.roleLabel}</p>
                  <div className={st.scoreBox}>
                    <p className={st.scoreLabel}>Innovation Score</p>
                    <p className={st.scoreText}>{s.total_score}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* MY STANDING */}
      {!loading && myEntry && (
        <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-slate-900/20 relative overflow-hidden border border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-slate-700 shadow-inner">
              <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1 tracking-widest">Rank</p>
              <p className="text-2xl font-black text-white leading-none">#{myEntry.rank}</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight">{myEntry.full_name}</p>
              <p className="text-[10px] text-violet-300 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                {myEntry.rank <= 3 ? 'You are on the podium!' : 'Keep pushing to reach the top 3!'}
              </p>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-8">
            <div className="text-right">
              <p className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-sm">{myEntry.total_score}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Performance Points</p>
            </div>
          </div>
        </section>
      )}

      {/* GLOBAL STANDINGS (Rank 4+) */}
      {!loading && rest.length > 0 && (
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-2">
            <h3 className="text-xl font-black text-slate-800">Operational Standings</h3>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hidden sm:inline">Live Sync Active</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-left">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4 text-right">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((s) => {
                  const isMe = s.student_id === user?.id;
                  return (
                    <tr
                      key={s.student_id}
                      className={`group hover:bg-slate-50 transition-colors duration-200 ${isMe ? 'bg-violet-50/50 hover:bg-violet-50' : 'bg-white'}`}
                    >
                      <td className="px-6 py-4 text-sm font-black text-slate-400 group-hover:text-slate-600 transition-colors rounded-l-2xl border-y border-l border-slate-100">
                        #{s.rank}
                      </td>
                      <td className="px-6 py-4 border-y border-slate-100">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-9 h-9 rounded-[0.8rem] flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0"
                            style={{ backgroundColor: s.avatar_color || '#6C35DE' }}
                          >
                            {s.avatar_initials || getInitials(s.full_name)}
                          </div>
                          <span className="font-bold text-slate-700 whitespace-nowrap group-hover:text-slate-900 transition-colors">
                            {s.full_name}
                            {isMe && (
                              <span className="ml-2 text-[9px] bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded-md uppercase">You</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-lg font-black text-violet-600 text-right rounded-r-2xl border-y border-r border-slate-100 group-hover:border-slate-200">
                        {s.total_score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!loading && leaderboard.length === 0 && !error && (
        <section className="bg-white rounded-[2.5rem] p-16 border border-slate-100 shadow-sm text-center">
          <span className="material-symbols-outlined text-6xl text-slate-200 block mb-4">leaderboard</span>
          <p className="text-slate-500 font-bold">No ranking data available yet.</p>
          <p className="text-slate-400 text-sm mt-2">Complete assignments and assessments to appear on the leaderboard.</p>
        </section>
      )}
    </div>
  );
}
