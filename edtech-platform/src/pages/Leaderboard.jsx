import { useAuth } from "../context/AuthContext";
import { getLeaderboard } from "../lib/mockData";

export function Leaderboard() {
  const { user } = useAuth();
  const studentId = user?.id || "stu-001";
  const leaderboard = getLeaderboard(studentId);

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-orange-500/20 mb-6 relative">
          <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-orange-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
        </div>
        <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-3">Global Leaderboard</h1>
        <p className="text-secondary font-medium max-w-lg mx-auto">See how you rank against your peers based on assignment scores and course participation.</p>
      </header>

      {/* Top 3 Podium Concept */}
      {leaderboard.length >= 3 && (
        <div className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8 mb-16 px-4 h-64">
          {[1, 0, 2].map((idx) => {
            const item = leaderboard[idx];
            if (!item) return null;
            const rank = item.rank;
            const isMe = item.isMe;
            const heights = { 1: "h-56 md:h-64", 2: "h-48 md:h-52 z-10", 3: "h-40 md:h-44" };
            const colors = { 
              1: "from-amber-300 to-orange-500 ring-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.3)]", 
              2: "from-slate-200 to-slate-400 ring-slate-300", 
              3: "from-amber-700 to-amber-900 ring-amber-800"
            };

            return (
              <div key={item.student.id} className={`relative flex flex-col items-center w-full md:w-48 ${heights[rank]} bg-gradient-to-b ${colors[rank]} rounded-t-3xl pt-6 pb-4 px-4 transition-transform hover:-translate-y-2`}>
                <div className={`absolute -top-10 w-20 h-20 rounded-full bg-white p-1 ring-4 ${colors[rank].split(" ")[2]} shadow-lg`}>
                  <div className="w-full h-full rounded-full bg-surface-container flex items-center justify-center font-bold text-xl text-on-surface overflow-hidden">
                    {item.student.name.charAt(0)}
                  </div>
                  {rank === 1 && (
                    <div className="absolute -top-3 -right-3 rotate-12 text-3xl">👑</div>
                  )}
                </div>
                <div className="mt-8 text-center w-full flex flex-col h-full justify-between">
                  <div>
                    <h3 className={`font-headline font-bold truncate ${rank === 1 ? "text-white" : "text-white"}`}>{item.student.name}</h3>
                    {isMe && <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold text-white uppercase backdrop-blur-sm">You</span>}
                  </div>
                  <div className="bg-black/20 rounded-xl py-2 px-3 backdrop-blur-md">
                    <p className="text-2xl font-black text-white">{item.avgScore}</p>
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Points</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Rankings List */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-outline-variant/10">
        <div className="px-8 py-6 bg-surface-container-low/50 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="font-bold text-on-surface uppercase tracking-widest text-sm">Full Rankings</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-secondary">
            <span className="material-symbols-outlined text-sm">schedule</span> Last updated informally
          </div>
        </div>
        <div className="divide-y divide-outline-variant/10">
          {leaderboard.length === 0 && (
            <div className="py-10 text-center text-secondary">No peers in this batch.</div>
          )}
          {leaderboard.slice(3).map((item) => (
            <div key={item.student.id} className={`px-8 py-5 flex items-center gap-6 transition-colors hover:bg-surface-container-low ${item.isMe ? "bg-primary/5 border-l-4 border-primary" : "border-l-4 border-transparent"}`}>
              <div className="w-8 text-center text-lg font-black text-slate-400">
                #{item.rank}
              </div>
              <div className="flex-1 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">
                  {item.student.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-sm flex items-center gap-2">
                    {item.student.name}
                    {item.isMe && <span className="bg-primary px-2 py-0.5 rounded text-[10px] text-white uppercase tracking-wider">You</span>}
                  </h4>
                  <p className="text-xs text-secondary mt-0.5">Attendance: {item.attendancePct}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-primary">{item.avgScore}</p>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-0.5">Points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
