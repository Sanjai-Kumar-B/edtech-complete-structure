import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function AssessmentDetailPage() {
  const navigate = useNavigate();
  const { assessmentId } = useParams();

  // Timer state
  const [timeLeft, setTimeLeft] = useState(42 * 60 + 18); // 42:18

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    alert('Submitted Successfully!');
    navigate('/assessments');
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      {/* Content: Weekly Assessment Header & Timer */}
      <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 h-20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Algorithm Design</h1>
          </div>
        </div>

        {/* Central Timer Component */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-50 px-6 py-2.5 rounded-full shadow-sm border border-slate-200">
          <span className="material-symbols-outlined text-red-500">timer</span>
          <span className="font-mono text-xl font-bold text-slate-800 tabular-nums">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-500 font-semibold hover:bg-slate-100 transition-colors rounded-lg">
            <span className="material-symbols-outlined">flag</span>
            Review
          </button>
          <button
            onClick={handleSubmit}
            className="bg-violet-600 text-white px-8 py-2 rounded-full font-bold shadow-lg hover:shadow-violet-200 active:scale-95 transition-all"
          >
            Submit
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-8 py-12 grid grid-cols-12 gap-8">
        {/* Question Navigator (Left Rail) */}
        <aside className="col-span-12 md:col-span-3">
          <div className="bg-slate-50 rounded-lg p-6 sticky top-32">
            <h3 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-wider">Question Navigator</h3>
            <div className="grid grid-cols-4 gap-3">
              {/* Dot Logic: Completed, Active, Remaining */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500 text-white font-bold text-sm cursor-pointer hover:scale-105 transition-transform">1</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500 text-white font-bold text-sm cursor-pointer hover:scale-105 transition-transform">2</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-600 text-white font-bold text-sm cursor-pointer ring-4 ring-violet-200">3</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-slate-500 font-bold text-sm cursor-pointer hover:bg-slate-100 transition-colors">4</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-slate-500 font-bold text-sm cursor-pointer hover:bg-slate-100 transition-colors border-2 border-dashed border-slate-300">5</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-slate-500 font-bold text-sm cursor-pointer hover:bg-slate-100 transition-colors">6</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-slate-500 font-bold text-sm cursor-pointer hover:bg-slate-100 transition-colors">7</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-slate-500 font-bold text-sm cursor-pointer hover:bg-slate-100 transition-colors">8</div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4">
                <span>OVERALL PROGRESS</span>
                <span>35%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-[35%] h-full bg-violet-600 shadow-[0_0_8px_rgba(109,40,217,0.4)]"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area: Question & Workspace */}
        <section className="col-span-12 md:col-span-9 space-y-8 pb-32">
          {/* Question Content Card */}
          <div className="bg-white rounded-lg p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-violet-600"></div>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-violet-100 text-violet-800 text-xs font-bold rounded-full">HARD</span>
              <span className="text-slate-500 text-sm font-medium">Topic: Computational Complexity</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 leading-tight">
              Evaluate the following Python function and determine its worst-case time complexity (Big O notation) relative to the input list size <code className="bg-slate-100 px-1.5 rounded text-violet-600">n</code>.
            </h2>

            <div className="bg-slate-900 text-slate-100 rounded-lg p-6 font-mono text-sm mb-8 relative group">
              <div className="absolute top-4 right-4 text-slate-500 text-xs opacity-80">python</div>
              <pre><code>{`def find_duplicates(data):
    results = []
    for i in range(len(data)):
        for j in range(i + 1, len(data)):
            if data[i] == data[j] and data[i] not in results:
                results.append(data[i])
    return results`}</code></pre>
            </div>

            {/* Answer Selection */}
            <div className="space-y-4">
              <label className="group block relative cursor-pointer">
                <input className="hidden peer" name="answer" type="radio" />
                <div className="flex items-center p-5 rounded-xl border border-slate-200 transition-all peer-checked:bg-violet-50 peer-checked:border-violet-600 peer-checked:ring-1 peer-checked:ring-violet-600 hover:bg-slate-50">
                  <span className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-sm font-bold group-hover:border-violet-600 transition-colors peer-checked:bg-violet-600 peer-checked:border-violet-600 peer-checked:text-white">A</span>
                  <span className="ml-4 text-lg font-medium text-slate-700">O(n) - Linear Time</span>
                </div>
              </label>

              <label className="group block relative cursor-pointer">
                <input defaultChecked className="hidden peer" name="answer" type="radio" />
                <div className="flex items-center p-5 rounded-xl border border-slate-200 transition-all peer-checked:bg-violet-50 peer-checked:border-violet-600 peer-checked:ring-1 peer-checked:ring-violet-600 hover:bg-slate-50">
                  <span className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-sm font-bold group-hover:border-violet-600 transition-colors peer-checked:bg-violet-600 peer-checked:border-violet-600 peer-checked:text-white">B</span>
                  <span className="ml-4 text-lg font-medium text-slate-700">O(n²) - Quadratic Time</span>
                </div>
              </label>

              <label className="group block relative cursor-pointer">
                <input className="hidden peer" name="answer" type="radio" />
                <div className="flex items-center p-5 rounded-xl border border-slate-200 transition-all peer-checked:bg-violet-50 peer-checked:border-violet-600 peer-checked:ring-1 peer-checked:ring-violet-600 hover:bg-slate-50">
                  <span className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-sm font-bold group-hover:border-violet-600 transition-colors peer-checked:bg-violet-600 peer-checked:border-violet-600 peer-checked:text-white">C</span>
                  <span className="ml-4 text-lg font-medium text-slate-700">O(log n) - Logarithmic Time</span>
                </div>
              </label>

              <label className="group block relative cursor-pointer">
                <input className="hidden peer" name="answer" type="radio" />
                <div className="flex items-center p-5 rounded-xl border border-slate-200 transition-all peer-checked:bg-violet-50 peer-checked:border-violet-600 peer-checked:ring-1 peer-checked:ring-violet-600 hover:bg-slate-50">
                  <span className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-sm font-bold group-hover:border-violet-600 transition-colors peer-checked:bg-violet-600 peer-checked:border-violet-600 peer-checked:text-white">D</span>
                  <span className="ml-4 text-lg font-medium text-slate-700">O(n log n) - Quasilinear Time</span>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between py-4">
            <button className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-slate-500 hover:bg-slate-200 transition-all active:scale-95">
              <span className="material-symbols-outlined">arrow_back</span>
              Previous
            </button>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-8 py-4 bg-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-300 transition-all">
                Skip Question
              </button>
              <button className="flex items-center gap-2 px-10 py-4 bg-violet-600 text-white rounded-full font-extrabold shadow-lg hover:shadow-violet-400 active:scale-95 transition-all">
                Next Question
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Side Content / Contextual Stats (Floating Bento) */}
      <div className="hidden xl:block fixed right-8 bottom-8 w-72 space-y-4 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <h4 className="font-bold text-sm text-slate-800">Focus Metrics</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Avg. Time per Question</span>
              <span className="font-bold text-slate-700">2m 14s</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Focus Score</span>
              <span className="font-bold text-emerald-600">98/100</span>
            </div>
          </div>
        </div>

        <div className="bg-violet-600 p-6 rounded-lg shadow-xl text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[100px]">auto_awesome</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Scholar Bonus</p>
          <h4 className="text-xl font-bold leading-tight">Double XP Session Active</h4>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-white"></div>
            </div>
            <span className="text-[10px] font-bold">12m</span>
          </div>
        </div>
      </div>

    </div>
  );
}
