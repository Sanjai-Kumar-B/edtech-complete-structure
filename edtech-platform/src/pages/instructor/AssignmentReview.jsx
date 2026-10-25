export function AssignmentReview() {
  return (
    <div className="pt-16 h-screen flex overflow-hidden w-full">
      {/* Left Panel: Student Submissions List (Master) */}
      <section className="w-80 shrink-0 flex flex-col bg-surface-container-low overflow-hidden h-full border-r border-outline-variant/10">
        <div className="p-6 border-b border-outline-variant/10">
          <h2 className="font-headline font-extrabold text-lg text-slate-900">Submissions</h2>
          <p className="text-[12px] text-secondary mt-1">Assignment 04: Quantum Dynamics</p>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {/* Active Student */}
          <div className="px-6 py-4 bg-surface-container-lowest border-l-4 border-primary">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-slate-900">Avery Henderson</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Submitted 2h ago</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full uppercase">Reviewing</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%]"></div>
              </div>
              <span className="text-[10px] font-bold text-primary">85%</span>
            </div>
          </div>
          {/* List Items */}
          <div className="px-6 py-4 hover:bg-surface-container-high transition-colors cursor-pointer border-l-4 border-transparent">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-700">Marcus Sterling</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Submitted 5h ago</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full uppercase">Graded</span>
            </div>
            <p className="mt-2 text-xs font-bold text-slate-900">Score: 92/100</p>
          </div>
          <div className="px-6 py-4 hover:bg-surface-container-high transition-colors cursor-pointer border-l-4 border-transparent">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-700">Elena Rodriguez</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Submitted 1d ago</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full uppercase">Pending</span>
            </div>
            <p className="mt-2 text-xs italic text-slate-400">Not started</p>
          </div>
          <div className="px-6 py-4 hover:bg-surface-container-high transition-colors cursor-pointer border-l-4 border-transparent opacity-75">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-700">Julian Cheng</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Late Submission</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-error-container text-on-error-container rounded-full uppercase">Late</span>
            </div>
          </div>
          <div className="px-6 py-4 hover:bg-surface-container-high transition-colors cursor-pointer border-l-4 border-transparent">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-700">Sarah Jenkins</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Submitted 2d ago</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full uppercase">Graded</span>
            </div>
            <p className="mt-2 text-xs font-bold text-slate-900">Score: 78/100</p>
          </div>
        </div>
      </section>

      {/* Right Panel: The Workspace (Detail) */}
      <section className="flex-1 bg-surface-container-lowest flex flex-col overflow-hidden relative">
        {/* Workspace Top: Preview & Metadata */}
        <header className="px-10 py-6 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
          <div className="flex gap-4">
            <img
              alt="Student Avatar"
              className="w-12 h-12 rounded-xl object-cover shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKy_VxIJHwIYV82JxqANlWUZVbWZkQAN1MshBOFc_7NRr8rjp-poAQITYLQgmVCVM75a35HyLcb9zIxWyoVVIDqlfc_R-ovaIWNxFbrByALlsO4d2IfT1ujxLmWr0rwP1JP7AuJStNUnAXOBuCd95hQkuQpnLHkeBfFsIXIuQFZ9gWomZcY5yyPPnRi1V5Wrwt1Lqvf4o2oOEtlffJohRRe-J20TVeMmfL4fgsR1BXIEv7VAK2I80IqjdLlx5F3KecY09HmkNOXXs"
            />
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Avery Henderson</h1>
              <div className="flex gap-3 items-center mt-1">
                <span className="text-[11px] font-semibold text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">article</span> Submission_v2_final.pdf</span>
                <span className="text-slate-300">|</span>
                <span className="text-[11px] font-semibold text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 14:32 Oct 24, 2023</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-surface-container-low rounded-xl text-slate-600 transition-colors">
              <span className="material-symbols-outlined">download</span>
            </button>
            <button className="p-2 hover:bg-surface-container-low rounded-xl text-slate-600 transition-colors">
              <span className="material-symbols-outlined">fullscreen</span>
            </button>
          </div>
        </header>

        {/* Workspace Center: Feedback & Core Input */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar pb-32">
          {/* Submission Preview Mock */}
          <div className="bg-surface-container-low rounded-xl p-8 min-h-[400px] border border-outline-variant/15">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex justify-between border-b border-slate-300/30 pb-4">
                <h3 className="font-headline font-bold text-lg text-slate-800">1. Kinetic Theory of Gases</h3>
                <span className="text-xs font-bold text-slate-500 uppercase">Page 1 of 4</span>
              </div>
              <p className="text-on-surface leading-relaxed font-body text-sm">
                The fundamental postulate of the kinetic theory is that a gas consists of a large number of molecules in constant, random motion. The average kinetic energy is directly proportional to the absolute temperature. In Henderson's derivation, we see a consistent application of the Boltzmann constant...
              </p>
              <div className="bg-white/50 p-6 rounded-lg border-l-4 border-indigo-400 italic text-slate-600 text-sm">
                "Therefore, the pressure exerted by the gas is P = 1/3 * (N/V) * m * v² where v² is the mean square velocity of the molecules."
              </div>
              <p className="text-on-surface leading-relaxed font-body text-sm">
                While the derivation for ideal gases holds, the transition to real gas models (Van der Waals) requires further explanation regarding intermolecular forces and the volume occupied by the molecules themselves.
              </p>
              <div className="h-40 w-full bg-slate-200/50 rounded flex items-center justify-center border-2 border-dashed border-slate-300">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined">image</span> Graph Placeholder: Pressure-Volume Relation
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Area */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-slate-900 tracking-tight">Instructor Feedback</label>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Final Score</span>
                  <div className="flex items-center">
                    <input className="w-16 h-12 text-center text-xl font-extrabold text-primary bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20" type="text" defaultValue="85" />
                    <span className="ml-2 text-xl font-bold text-slate-300">/ 100</span>
                  </div>
                </div>
              </div>
            </div>
            <textarea
              className="w-full bg-surface-container-highest border-none rounded-xl p-6 text-sm leading-relaxed focus:ring-2 focus:ring-primary/20 resize-none placeholder:text-slate-400"
              placeholder="Write detailed feedback for the student..."
              rows={6}
              defaultValue="Excellent derivation of the base kinetic formula. However, your explanation of the Van der Waals corrections felt rushed. Please revisit the intermolecular attraction section (page 3) and clarify how 'a' constant influences the total pressure. Mathematical steps were flawless."
            />
          </div>
        </div>

        {/* Workspace Bottom: Skills & CTAs */}
        <footer className="px-10 py-6 bg-surface-container-low/50 backdrop-blur-sm border-t border-outline-variant/10 shrink-0">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Skill Tagging */}
            <div className="flex gap-4 items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Assess Skills:</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-sm">
                  <span className="text-xs font-medium text-slate-700">Analytical Depth</span>
                  <span className="material-symbols-outlined text-[16px] text-indigo-500">check_circle</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-sm">
                  <span className="text-xs font-medium text-slate-700">Mathematical Accuracy</span>
                  <span className="material-symbols-outlined text-[16px] text-indigo-500">check_circle</span>
                </div>
                <button className="bg-white/50 border border-dashed border-slate-400 px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:bg-white transition-colors">
                  + Add Competency
                </button>
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-4">
              <button className="px-8 py-3 text-sm font-bold text-secondary hover:bg-surface-container-high rounded-xl transition-all">Save Draft</button>
              <button className="px-10 py-3 bg-primary text-white text-sm font-extrabold rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] hover:bg-primary-container transition-all flex items-center gap-2">
                <span>Save & Next</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </footer>

        {/* Quick Action Floating Nav (Contextual) */}
        <div className="absolute right-10 bottom-32 flex flex-col gap-2 z-10">
          <button className="w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-600 hover:text-primary transition-all group" title="Quick Comments">
            <span className="material-symbols-outlined">add_comment</span>
          </button>
          <button className="w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-600 hover:text-error transition-all" title="Plagiarism Report">
            <span className="material-symbols-outlined">security</span>
          </button>
        </div>
      </section>
    </div>
  );
}
