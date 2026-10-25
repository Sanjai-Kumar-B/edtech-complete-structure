export function CourseDetail() {
  return (
    <>
      {/* Course Header Section */}
      <section className="px-10 py-12 flex flex-col lg:flex-row editorial-gap items-start">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">school</span>
            <span>Engineering Faculty</span>
          </div>
          <h1 className="text-5xl font-extrabold text-on-surface tracking-tight leading-tight">Advanced Machine Learning</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl font-body leading-relaxed">
            Master the complexities of deep learning architectures, reinforcement learning paradigms, and the mathematical foundations of large-scale neural systems. This course bridges academic theory with industry-scale implementation.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-4 py-1.5 bg-surface-container text-primary font-manrope font-semibold text-xs rounded-full">Neural Networks</span>
            <span className="px-4 py-1.5 bg-surface-container text-primary font-manrope font-semibold text-xs rounded-full">PyTorch</span>
            <span className="px-4 py-1.5 bg-surface-container text-primary font-manrope font-semibold text-xs rounded-full">Linear Algebra</span>
          </div>
        </div>
        <div className="w-full lg:w-80 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden">
              <img className="w-full h-full object-cover" data-alt="Professional portrait of Dr. Emily Chen, a senior female professor in a modern academic setting with soft natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHf9apLJjB-DSxoZoZKR4iU-wuGcnChNsTs0oznVK7coi68frKOA139-GzWXHHwFshcUOewnhs1kIewuFWEXxAfBIEowIL-JulwMnWoFnIMlSAr2Ei4m4Jumwq6pjx_qy4J7uEBOw3u3YVDohG7-d6u6QnAHefoJ_7xsRYC41fxfEzeVAsvM9AgNyhdQIGeJl1gRYob6T_wXOKnOAily6II9U3B-aBrO432fdjzXtiCmqlqqw7-5XMq7CvvHL00XjEdkjUbdSbO_g" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface">Dr. Emily Chen</h4>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">Course Instructor</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Class Capacity</span>
              <span className="font-bold">45 / 50</span>
            </div>
            <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[90%] rounded-full"></div>
            </div>
            <button className="w-full py-3 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors">
              View Profile
            </button>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="px-10 border-b border-outline-variant/15">
        <div className="flex space-x-10">
          <button className="pb-4 border-b-2 border-primary text-primary font-bold text-sm tracking-wide">Live Classes</button>
          <button className="pb-4 border-b-2 border-transparent text-on-surface-variant hover:text-primary font-semibold text-sm tracking-wide transition-all">Assignments</button>
          <button className="pb-4 border-b-2 border-transparent text-on-surface-variant hover:text-primary font-semibold text-sm tracking-wide transition-all">Materials</button>
          <button className="pb-4 border-b-2 border-transparent text-on-surface-variant hover:text-primary font-semibold text-sm tracking-wide transition-all">Roadmap</button>
        </div>
      </section>

      {/* Tab Content: Live Classes & Materials Bento */}
      <section className="px-10 py-10 grid grid-cols-12 gap-8">
        {/* Left Column: Timeline */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold tracking-tight">Upcoming Schedule</h3>
            <div className="flex space-x-2">
              <button className="p-2 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          {/* Timeline Element */}
          <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/20">
            {/* Event 1 */}
            <div className="relative pl-10">
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-4 border-background">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Today • 14:00 PM</p>
                  <h4 className="text-lg font-bold text-on-surface">Convolutional Architectures in Practice</h4>
                  <p className="text-sm text-on-surface-variant mt-1">Deep dive into ResNet and EfficientNet implementations.</p>
                </div>
                <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-full shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all">
                  Join Now
                </button>
              </div>
            </div>
            {/* Event 2 */}
            <div className="relative pl-10">
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-outline-variant/40 flex items-center justify-center border-4 border-background">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/5 flex items-center justify-between opacity-80">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Tomorrow • 10:00 AM</p>
                  <h4 className="text-lg font-bold text-on-surface">Recurrent Units &amp; LSTMs</h4>
                  <p className="text-sm text-on-surface-variant mt-1">Foundational sequences for NLP and time-series data.</p>
                </div>
                <button className="px-6 py-2.5 bg-surface-container-high text-on-surface-variant font-bold rounded-full cursor-not-allowed">
                  Locked
                </button>
              </div>
            </div>
          </div>
          {/* Assignments Status Section */}
          <div className="pt-10">
            <h3 className="text-xl font-extrabold tracking-tight mb-6">Recent Assignments</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-error shadow-sm">
                <p className="text-[10px] uppercase font-bold text-error tracking-widest mb-2">Pending</p>
                <h5 className="font-bold text-sm">Gradient Descent Lab</h5>
                <p className="text-xs text-on-surface-variant mt-2">Due in 2 days</p>
              </div>
              <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-secondary shadow-sm">
                <p className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-2">Submitted</p>
                <h5 className="font-bold text-sm">Linear Algebra Review</h5>
                <p className="text-xs text-on-surface-variant mt-2">Under review</p>
              </div>
              <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-primary shadow-sm">
                <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-2">Reviewed</p>
                <h5 className="font-bold text-sm">Calculus for ML</h5>
                <p className="text-xs text-on-surface-variant mt-2">Score: 98/100</p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column: Materials & Roadmap */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-inverse-surface p-8 rounded-2xl text-white">
            <h3 className="text-xl font-bold mb-4">AI Roadmap</h3>
            <p className="text-sm text-slate-300 mb-6 font-body">Your personalized path to mastering the Advanced curriculum.</p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <div>
                  <h5 className="text-sm font-bold">Foundations</h5>
                  <p className="text-xs text-slate-400 mt-1">Linear algebra and basic statistics</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                </div>
                <div>
                  <h5 className="text-sm font-bold">Deep Learning Core</h5>
                  <p className="text-xs text-slate-400 mt-1">Backpropagation and MLP</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm text-slate-600">lock</span>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-500">Transformers &amp; Attention</h5>
                  <p className="text-xs text-slate-600 mt-1">Advanced sequence modeling</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight mb-6">Learning Materials</h3>
            <div className="space-y-4">
              {/* Resource Card */}
              <div className="group bg-surface-container-low p-4 rounded-xl flex items-center space-x-4 hover:bg-surface-container transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                  <span className="material-symbols-outlined">play_circle</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold">Lec 04: ConvNets</h5>
                  <p className="text-xs text-on-surface-variant">Video • 45 mins</p>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">download</span>
              </div>
              {/* Resource Card */}
              <div className="group bg-surface-container-low p-4 rounded-xl flex items-center space-x-4 hover:bg-surface-container transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center text-slate-800">
                  <span className="material-symbols-outlined">code</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold">GitHub Repo: PyTorch</h5>
                  <p className="text-xs text-on-surface-variant">Code • Updated 2h ago</p>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">open_in_new</span>
              </div>
              {/* Resource Card */}
              <div className="group bg-surface-container-low p-4 rounded-xl flex items-center space-x-4 hover:bg-surface-container transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined">article</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold">Paper: ResNet Origins</h5>
                  <p className="text-xs text-on-surface-variant">Blog/PDF • 12 pages</p>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">bookmark</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
