export function InstructorTopAppBar() {
  return (
    <header className="flex justify-between items-center px-8 w-[calc(100%-16rem)] h-16 z-30 ml-64 fixed top-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            className="w-full bg-surface-container-highest border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/40 placeholder:text-slate-500 transition-all"
            placeholder="Search students, batches, or records..."
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6 ml-8">
        <div className="flex items-center gap-4">
          <button className="relative text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-secondary hover:bg-slate-50 transition-colors">
            Review Assignments
          </button>
          <button className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-br from-primary to-primary-container rounded shadow-md hover:shadow-lg transition-all">
            Start Class
          </button>
        </div>
      </div>
    </header>
  );
}
