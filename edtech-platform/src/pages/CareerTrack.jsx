export function CareerTrack() {
  const milestones = [
    {
      id: 1,
      title: "Foundation: HTML, CSS, JavaScript",
      status: "completed",
      date: "Sep 2025",
      skills: ["Semantic HTML", "CSS Grid", "ES6+"],
      desc: "Mastered the core pillars of the web, focusing on semantic markup, accessible styling architectures, and functional programming paradigms in modern JavaScript."
    },
    {
      id: 2,
      title: "Component Architecture with React",
      status: "completed",
      date: "Dec 2025",
      skills: ["React 18", "Hooks", "Context API"],
      desc: "Transitioned to declarative UI development. Built complex single-page applications managing local and global state reliably."
    },
    {
      id: 3,
      title: "Full Stack Integration",
      status: "active",
      date: "Current Focus",
      skills: ["Node.js", "Express", "PostgreSQL", "REST APIs"],
      desc: "Connecting the client tier to robust backend services. Designing resilient SQL schemas and implementing secure, stateless authentication."
    },
    {
      id: 4,
      title: "System Design & DevOps",
      status: "locked",
      date: "Spring 2026",
      skills: ["Docker", "CI/CD", "AWS Basics"],
      desc: "Scaling applications for production. Understanding containerization and automated deployment pipelines."
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16 pl-6 pt-6">
      
      <header className="mb-16">
        <h1 className="text-[3.5rem] leading-none font-headline font-black text-on-surface tracking-tight mb-4">Career Projection</h1>
        <p className="text-on-surface-variant text-lg font-body max-w-2xl">
          Your personalized roadmap to becoming a Senior Full Stack Engineer. Follow the trajectory and focus on mastering each milestone.
        </p>
      </header>

      {/* The Digital Atelier Timeline */}
      <div className="relative border-l border-outline-variant/15 ml-4 space-y-16 pb-12">
        {milestones.map((ms) => (
          <div key={ms.id} className="relative pl-12 pr-6">
            
            {/* Timeline Node */}
            {ms.status === 'completed' && (
              <div className="absolute top-0 -left-[14px] w-7 h-7 bg-surface-container-lowest border-4 border-surface rounded-full flex items-center justify-center shadow-sm">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
              </div>
            )}
            
            {ms.status === 'active' && (
              <div className="absolute top-0 -left-[18px] w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-5 h-5 bg-primary rounded-full shadow-[0_0_15px_rgba(0,74,198,0.5)]"></div>
              </div>
            )}
            
            {ms.status === 'locked' && (
              <div className="absolute top-0 -left-[10px] w-5 h-5 bg-surface-container-lowest border-2 border-outline-variant/30 rounded-full"></div>
            )}

            {/* Content Card */}
            <div className={`p-8 rounded-[1rem] transition-all duration-500
              ${ms.status === 'active' 
                ? 'bg-surface-container-lowest shadow-[0_20px_40px_-12px_rgba(19,27,46,0.1)] -translate-y-1 ring-1 ring-primary/10' 
                : 'bg-surface-container-low opacity-90'}
              ${ms.status === 'locked' ? 'opacity-50 grayscale' : ''}
            `}>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h3 className={`text-2xl font-headline font-bold ${ms.status === 'active' ? 'text-primary' : 'text-on-surface'}`}>
                  {ms.title}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant bg-surface px-3 py-1 rounded-sm">
                  {ms.date}
                </span>
              </div>
              
              <p className="text-on-surface-variant font-body leading-relaxed mb-6">
                {ms.desc}
              </p>

              <div className="flex flex-wrap gap-2">
                {ms.skills.map(skill => (
                  <span 
                    key={skill} 
                    className={`text-[10px] font-label uppercase tracking-widest px-3 py-1 rounded-sm
                      ${ms.status === 'active' ? 'bg-primary/5 text-primary font-bold' : 'bg-surface text-on-surface-variant'}
                    `}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {ms.status === 'active' && (
                <div className="mt-8 pt-6 border-t border-outline-variant/15 flex justify-end">
                  <button className="bg-gradient-to-br from-primary to-primary-container text-white text-sm font-headline font-bold px-8 py-3 rounded-full hover:shadow-lg transition-shadow">
                    Resume Module
                  </button>
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}
