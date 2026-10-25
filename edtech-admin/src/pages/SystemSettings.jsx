/*
-- CREATE TABLE IF NOT EXISTS public.leaderboard_archive (
--   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
--   season_label text NOT NULL,
--   student_id uuid,
--   full_name text,
--   total_points integer,
--   rank integer,
--   archived_at timestamptz DEFAULT now()
-- );
*/

import { useState, useEffect } from 'react';
import { supabase } from '@junospace/supabase-client';

const SKILLS = [
  { abbr: "PY", name: "Python Scripting", id: "SKL-4092", cat: "Data Science", dots: 2 },
  { abbr: "UX", name: "User Research", id: "SKL-8821", cat: "Design", dots: 3 },
  { abbr: "ML", name: "Deep Learning", id: "SKL-1102", cat: "AI / ML", dots: 3 },
  { abbr: "FS", name: "REST API Design", id: "SKL-3310", cat: "Engineering", dots: 1 },
  { abbr: "CY", name: "Threat Modelling", id: "SKL-7714", cat: "Cybersecurity", dots: 2 },
];

export function SystemSettings() {
  const [stats, setStats] = useState({ totalPoints: 0, topStudents: [] });
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const [seasonLabel, setSeasonLabel] = useState('');
  const [archiveSuccess, setArchiveSuccess] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadLeaderboardStats();
  }, []);

  async function loadLeaderboardStats() {
    try {
      const { data: ptsData } = await supabase
        .from('leaderboard_points')
        .select('points');

      const total = ptsData ? ptsData.reduce((acc, row) => acc + (row.points || 0), 0) : 0;

      const { data: topData } = await supabase
        .from('mv_leaderboard_scores')
        .select('student_id, full_name, total_points, rank')
        .order('rank', { ascending: true })
        .limit(3);

      setStats({
        totalPoints: total,
        topStudents: topData || []
      });
    } catch (err) {
      console.error("Failed to load leaderboard stats:", err);
    }
  }

  const handleResetLeaderboard = async () => {
    if (resetConfirmText !== 'RESET') {
      alert("Please type exactly 'RESET' to confirm.");
      return;
    }

    setProcessing(true);
    try {
      // Trick to delete all without throwing filter error
      await supabase.from('leaderboard_points').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Note: Materialized view should be refreshed by the backend RPC if setup, 
      // otherwise we try calling it here if it exists.
      await supabase.rpc('refresh_leaderboard_on_points');

      setResetSuccess("Leaderboard reset. New season started.");
      setResetConfirmText('');
      setTimeout(() => setResetSuccess(''), 5000);
      loadLeaderboardStats();
    } catch (err) {
      alert("Reset failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleArchiveSeason = async () => {
    if (!seasonLabel) {
      alert("Please enter a season label (e.g. 'Spring 2026')");
      return;
    }

    setProcessing(true);
    try {
      const { data: currentScores } = await supabase
        .from('mv_leaderboard_scores')
        .select('*');

      if (!currentScores || currentScores.length === 0) {
        throw new Error("No data in leaderboard to archive.");
      }

      const inserts = currentScores.map(s => ({
        season_label: seasonLabel,
        student_id: s.student_id,
        full_name: s.full_name,
        total_points: s.total_points,
        rank: s.rank
      }));

      const { error } = await supabase.from('leaderboard_archive').insert(inserts);
      if (error) throw error;

      setArchiveSuccess(`Season '${seasonLabel}' successfully archived.`);
      setSeasonLabel('');
      setTimeout(() => setArchiveSuccess(''), 5000);
    } catch (err) {
      alert("Archive failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pt-24 px-10 pb-20 min-h-screen max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight font-headline">System Configuration</h2>
        <p className="text-slate-500 text-sm mt-2">Manage the core behavioral rules and taxonomies for the institution's digital ecosystem.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">

        {/* Leaderboard Management & Rules */}
        <section className="col-span-12 lg:col-span-5 space-y-6">

          <div className="bg-white rounded-[2rem] p-8 shadow-sm relative overflow-hidden group border border-slate-100">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 group-hover:w-2 transition-all"></div>

            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-800 font-headline">Leaderboard Management</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mt-1">Current Season Status</p>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">Total Points Awarded:</span>
                <span className="text-xl font-black text-indigo-600">{stats.totalPoints}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Top 3 Students</h4>
                <div className="space-y-2">
                  {stats.topStudents.length === 0 ? (
                    <div className="text-sm text-slate-400 font-medium">No students ranked yet.</div>
                  ) : stats.topStudents.map((s, idx) => (
                    <div key={s.student_id} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-lg text-sm">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-[10px] ${idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : 'bg-amber-700'}`}>
                          {s.rank}
                        </span>
                        <span className="font-bold text-slate-700">{s.full_name}</span>
                      </div>
                      <span className="font-bold text-indigo-600">{s.total_points} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Archive */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Archive Season</h4>
                {archiveSuccess && <div className="text-xs font-bold text-emerald-600 mb-2">{archiveSuccess}</div>}
                <div className="flex gap-2">
                  <input type="text" value={seasonLabel} onChange={e => setSeasonLabel(e.target.value)} placeholder="e.g. Spring 2026" className="w-full bg-slate-50 border-none rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500" />
                  <button onClick={handleArchiveSeason} disabled={processing} className="px-4 py-2 bg-slate-800 text-white font-bold text-sm rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap disabled:opacity-50">
                    Archive
                  </button>
                </div>
              </div>

              {/* Reset */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-red-600 mb-2">Danger Zone: Reset Leaderboard</h4>
                <p className="text-xs text-slate-500 mb-3">This will delete all leaderboard points. Type <strong>RESET</strong> to confirm.</p>
                {resetSuccess && <div className="text-xs font-bold text-emerald-600 mb-2">{resetSuccess}</div>}
                <div className="flex gap-2">
                  <input type="text" value={resetConfirmText} onChange={e => setResetConfirmText(e.target.value)} placeholder="Type RESET" className="w-full bg-red-50 border-none rounded-lg px-3 py-2 text-sm font-bold text-red-700 focus:ring-2 focus:ring-red-500" />
                  <button onClick={handleResetLeaderboard} disabled={processing || resetConfirmText !== 'RESET'} className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap disabled:opacity-50">
                    Wipe Data
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
            <div className="flex items-center mb-4">
              <span className="material-symbols-outlined text-amber-500 mr-2">info</span>
              <h4 className="text-sm font-bold text-slate-800">Data Precision Note</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Changes to scoring rules take effect at the next UTC midnight sync. Historical points will not be recalculated to ensure data integrity.</p>
          </div>
        </section>

        {/* Skill Taxonomy */}
        <section className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-50">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-black text-slate-800 font-headline">Skill Taxonomy</h3>
                  <p className="text-slate-500 text-sm">Defining core competencies across the curriculum</p>
                </div>
                <button className="text-xs font-bold bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors">
                  + Add New Skill
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {["Skill Identity", "Category", "Difficulty", "Actions"].map((h, i) => (
                      <th key={h} className={`px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest ${i === 3 ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {SKILLS.map((sk) => (
                    <tr key={sk.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">{sk.abbr}</div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{sk.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">ID: {sk.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs text-slate-600 font-bold px-3 py-1 bg-slate-100 rounded-md">{sk.cat}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex space-x-1">
                          {[1, 2, 3].map((d) => (
                            <div key={d} className={`w-2 h-2 rounded-full ${d <= sk.dots ? "bg-indigo-600" : "bg-slate-200"}`}></div>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="material-symbols-outlined text-slate-400 hover:text-indigo-600 transition-colors">more_horiz</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Career Tracks */}
          <div>
            <div className="bg-white p-6 rounded-2xl mb-4 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 font-headline">Career Tracks</h3>
              <p className="text-sm text-slate-500 font-medium">Structure student journeys based on skill requirements</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: "cloud", color: "text-indigo-600 bg-indigo-50", title: "Fullstack Architect", skills: 12, milestones: 4, progress: 75, status: "Active" },
                { icon: "monitoring", color: "text-emerald-600 bg-emerald-50", title: "Product Analytics", skills: 8, milestones: 2, progress: 25, status: "Draft" },
                { icon: "security", color: "text-red-600 bg-red-50", title: "Cybersecurity Pro", skills: 10, milestones: 5, progress: 50, status: "Active" },
                { icon: "psychology", color: "text-purple-600 bg-purple-50", title: "AI Research Track", skills: 6, milestones: 3, progress: 10, status: "Draft" },
              ].map((ct) => (
                <div key={ct.title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`material-symbols-outlined p-3 rounded-xl ${ct.color}`}>{ct.icon}</span>
                    <span className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">{ct.status}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-800">{ct.title}</h4>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Core Skills</span><span className="text-slate-700">{ct.skills}</span></div>
                    <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Milestones</span><span className="text-slate-700">{ct.milestones}</span></div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
                      <div className="bg-indigo-600 h-full" style={{ width: `${ct.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
