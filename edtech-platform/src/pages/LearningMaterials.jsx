export function LearningMaterials() {
  const materials = [
    {
      id: 1,
      title: "Design Systems & Component Architecture",
      category: "PDF",
      course: "UI/UX Advanced",
      date: "Oct 24",
      size: "2.4 MB",
      icon: "picture_as_pdf",
      color: "text-error",
      bg: "bg-error/10"
    },
    {
      id: 2,
      title: "Lecture 04: The DOM & Virtual DOM",
      category: "Video",
      course: "React Core",
      date: "Oct 22",
      size: "450 MB",
      icon: "play_circle",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      id: 3,
      title: "State Management Notes",
      category: "Doc",
      course: "React Core",
      date: "Oct 20",
      size: "12 KB",
      icon: "article",
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      id: 4,
      title: "Redux Setup Boilerplate",
      category: "Code",
      course: "React Core",
      date: "Oct 18",
      size: "4 KB",
      icon: "data_object",
      color: "text-tertiary",
      bg: "bg-tertiary/10"
    }
  ];

  const categories = ["All", "PDFs", "Videos", "Docs", "Code Snippets"];

  return (
    <div className="max-w-7xl mx-auto space-y-16 pl-6 pt-6">
      
      {/* Editorial Library Header */}
      <header className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <p className="font-label text-sm uppercase tracking-[0.2em] text-primary mb-4 font-bold relative before:absolute before:content-[''] before:w-8 before:h-[2px] before:bg-primary before:-left-12 before:top-1/2 before:-translate-y-1/2 ml-12">
            The Digital Library
          </p>
          <h1 className="text-5xl font-headline font-black text-on-surface tracking-tight leading-tight">
            Learning Materials <br /> &amp; Atelier Resources
          </h1>
        </div>
        <div className="md:col-span-4 flex justify-end">
          <div className="relative w-full max-w-sm">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Search by title or topic..." 
              className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary pl-12 pr-4 py-4 rounded-none outline-none font-body text-sm transition-all shadow-sm ring-1 ring-black/5"
            />
          </div>
        </div>
      </header>

      {/* Asymmetric Category Navigation with Ghost Borders */}
      <nav className="flex gap-10 overflow-x-auto no-scrollbar pb-4 border-b border-outline-variant/15">
        {categories.map((cat, i) => (
          <button 
            key={cat} 
            className={`pb-4 whitespace-nowrap text-sm font-label uppercase tracking-widest transition-colors relative ${i === 0 ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {cat}
            {i === 0 && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></span>
            )}
          </button>
        ))}
      </nav>

      {/* Material Grid / List Hybrid */}
      <section className="bg-surface-container-low rounded-2xl p-8 lg:p-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-headline font-bold text-on-surface">Recent Additions</h2>
          <button className="text-primary font-bold text-sm tracking-wider uppercase font-label">View All</button>
        </div>

        <div className="space-y-4">
          {materials.map((mat) => (
            <div key={mat.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-surface-container-lowest hover:bg-surface-container-high transition-colors rounded-xl duration-300">
              
              <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-5/12">
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 ${mat.bg} ${mat.color}`}>
                  <span className="material-symbols-outlined text-2xl">{mat.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{mat.title}</h3>
                  <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant">{mat.course}</p>
                </div>
              </div>

              <div className="w-full md:w-3/12 flex items-center mb-4 md:mb-0">
                <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-widest rounded-sm">
                  {mat.category}
                </span>
              </div>

              <div className="w-full md:w-2/12 flex items-center text-sm font-medium text-on-surface-variant">
                {mat.size}
              </div>
              
              <div className="w-full md:w-2/12 flex items-center justify-between md:justify-end gap-6 text-sm font-medium text-on-surface-variant">
                <span>{mat.date}</span>
                <button className="text-on-surface hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-lowest">
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Featured Collection Highlight */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary text-white p-12 aspect-[16/9] flex flex-col justify-end">
          {/* Glassmorphism abstract shape */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-sm text-[10px] font-bold uppercase tracking-widest mb-4">Curated Collection</span>
            <h3 className="text-3xl font-headline font-black mb-2 leading-tight">Interaction Design <br/> Masterclass</h3>
            <p className="text-white/80 font-body mb-6 max-w-sm">A 12-part video series breaking down micro-interactions in modern web applications.</p>
            <button className="font-headline font-bold text-sm bg-white text-primary px-6 py-3 rounded-full hover:scale-105 transition-transform">Start Watching</button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-12 flex flex-col justify-center border-none shadow-[0_4px_6px_-1px_rgba(19,27,46,0.04)] ring-1 ring-black/5">
          <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-3xl">lightbulb</span>
          </div>
          <h3 className="text-2xl font-headline font-black text-on-surface mb-3 tracking-tight">Need a custom study guide?</h3>
          <p className="text-on-surface-variant mb-8 leading-relaxed font-body">Our AI assistant can compile a personalized reading list based on your current skill matrix and upcoming assignments.</p>
          <div>
            <button className="text-sm font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-1 hover:text-primary-container hover:border-primary-container transition-colors">
              Generate Guide
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
