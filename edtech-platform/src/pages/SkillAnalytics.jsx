export function SkillAnalytics() {
  return (
    <div className="space-y-10 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Competency Matrix */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-3xl font-black text-on-surface tracking-tight">Core Competency Matrix</h3>
              <p className="text-secondary font-bold text-sm mt-1">Global proficiency verification across quadrants.</p>
            </div>
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
              Live Feedback
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: "Logic & Algorithms", value: 88, icon: "psychology", color: "bg-primary" },
              { label: "Technical Stack", value: 92, icon: "code", color: "bg-emerald-500" },
              { label: "Speed & Efficiency", value: 74, icon: "bolt", color: "bg-orange-500" },
              { label: "Collaboration Score", value: 95, icon: "hub", color: "bg-primary" }
            ].map((item) => (
              <div key={item.label} className="p-8 bg-surface-container-low/50 rounded-[2rem] border border-outline-variant/10 group hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-on-surface shadow-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <span className="text-4xl font-black text-on-surface">{item.value}%</span>
                </div>
                <p className="text-sm font-black text-on-surface mb-4">{item.label}</p>
                <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-inner">
                  <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Efficiency */}
        <div className="lg:col-span-4 bg-primary p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(108,92,231,0.2)] text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-4xl font-black mb-4">Efficiency</h3>
            <p className="text-primary-container font-bold text-sm leading-relaxed">
              Real-time learning velocity and outcome mapping.
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <span className="text-8xl font-black">94.2%</span>
              <span className="absolute -top-4 -right-12 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                Peak Form
              </span>
            </div>
            {/* Simple Line Chart SVG */}
            <svg className="w-full h-32 mt-8 overflow-visible" viewBox="0 0 400 100">
              <path d="M0,80 Q100,70 200,40 T400,10" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" className="opacity-40" />
              <path d="M0,80 Q100,70 200,40 T400,10" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeDasharray="400" strokeDashoffset="0" />
              <circle cx="400" cy="10" r="6" fill="white" className="animate-pulse" />
            </svg>
          </div>

          <div className="relative z-10 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 mt-8">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-lg">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <p className="text-xs font-bold leading-relaxed">
                  Projected to reach <span className="font-black">Senior Voyager</span> status by Mid-October.
                </p>
             </div>
          </div>

          {/* Background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Knowledge Growth */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-3xl font-black text-on-surface tracking-tight">Knowledge Growth</h3>
              <p className="text-secondary font-bold text-sm mt-1">Learning proficiency over the last 30 days</p>
            </div>
            <div className="flex bg-surface-container-low p-1.5 rounded-2xl gap-2">
              <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-on-surface transition-colors">Monthly</button>
              <button className="px-4 py-1.5 bg-white shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface">Weekly</button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-4">
            {[30, 45, 35, 60, 40, 75, 50, 90, 70, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className={`w-full rounded-full transition-all duration-500 ${i === 10 ? 'bg-primary' : 'bg-primary/10 group-hover:bg-primary/30'}`} 
                  style={{ height: `${h}%` }}
                ></div>
                {i === 10 && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                    Peak
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skill Balance */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20">
          <h3 className="text-xl font-black text-on-surface text-center mb-1">Skill Balance</h3>
          <p className="text-[10px] font-black text-secondary uppercase tracking-widest text-center mb-8">Technical</p>
          
          <div className="relative aspect-square flex items-center justify-center">
            {/* Mock Radar Chart */}
            <div className="absolute inset-0 border border-outline-variant/10 rounded-full"></div>
            <div className="absolute inset-[20%] border border-outline-variant/10 rounded-full"></div>
            <div className="absolute inset-[40%] border border-outline-variant/10 rounded-full"></div>
            <svg className="absolute inset-0 w-full h-full drop-shadow-xl overflow-visible" viewBox="0 0 100 100">
               <polygon 
                points="50,10 90,50 50,90 10,50" 
                fill="rgba(108, 92, 231, 0.15)" 
                stroke="#6C5CE7" 
                strokeWidth="2" 
                className="animate-[pulse_4s_infinite]"
              />
              <circle cx="50" cy="10" r="2" fill="#6C5CE7" />
              <circle cx="90" cy="50" r="2" fill="#6C5CE7" />
              <circle cx="50" cy="90" r="2" fill="#6C5CE7" />
              <circle cx="10" cy="50" r="2" fill="#6C5CE7" />
            </svg>
            <span className="absolute -top-4 text-[8px] font-black uppercase text-secondary">Backend</span>
            <span className="absolute -right-4 text-[8px] font-black uppercase text-secondary">Frontend</span>
            <span className="absolute -bottom-4 text-[8px] font-black uppercase text-secondary">DevOps</span>
            <span className="absolute -left-4 text-[8px] font-black uppercase text-secondary">Design</span>
          </div>
        </div>
      </div>
    </div>
  );
}
