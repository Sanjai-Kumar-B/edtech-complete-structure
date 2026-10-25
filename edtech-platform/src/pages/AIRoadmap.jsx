import { useAuth } from "../context/AuthContext";
import { getRoadmapForBatch, getMyEnrollments } from "../lib/mockData";

export function AIRoadmap() {
  const ideas = [
    { id: 1, title: "Self-Sustaining Sky Gardens", author: "Elena Rodriguez", category: "Concept", upvotes: 124, description: "Vertical farming integrated into residential skyscrapers using automated hydroponics.", tags: ["Sustainability", "Urban"], status: "Trending" },
    { id: 2, title: "Modular Kinetic Facades", author: "Alex Chen", category: "Prototype", upvotes: 89, description: "Dynamic exterior panels that adjust based on sunlight intensity to optimize energy usage.", tags: ["Energy", "Smart Glass"], status: "New" },
    { id: 3, title: "Subterranean Logistic Hubs", author: "Marcus Thorne", category: "Concept", upvotes: 56, description: "Underground drone docking stations to reduce surface level traffic congestion.", tags: ["Logistics", "Infrastructure"], status: "Review" }
  ];

  return (
    <div className="space-y-10 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-on-surface tracking-tight font-headline">Innovation Board</h1>
          <p className="text-secondary font-bold text-sm mt-2">The Ideation Station: Explore and upvote community concepts.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-primary text-white font-black text-sm rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all">
            + New Proposal
          </button>
        </div>
      </header>

      <div className="flex border-b border-outline-variant/30 gap-8">
        {["Live Board", "Your Ideas", "Hall of Fame"].map((tab, i) => (
          <button key={tab} className={`pb-4 px-2 text-sm font-black tracking-widest uppercase transition-all relative ${i === 0 ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}>
            {tab}
            {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"></div>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 flex flex-col justify-between group hover:border-primary/20 transition-all cursor-pointer">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${idea.category === 'Prototype' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  {idea.category}
                </span>
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-sm">thumb_up</span>
                  <span className="text-xs font-black">{idea.upvotes}</span>
                </div>
              </div>
              <h3 className="text-2xl font-black text-on-surface mb-3 group-hover:text-primary transition-colors">{idea.title}</h3>
              <p className="text-sm text-secondary font-medium leading-relaxed mb-6">{idea.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {idea.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-surface-container-low text-[10px] font-bold text-secondary rounded-lg">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-white shadow-sm overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${idea.author}&background=random`} alt={idea.author} className="w-full h-full object-cover" />
                </div>
                <p className="text-[10px] font-black text-on-surface uppercase tracking-tight">{idea.author}</p>
              </div>
              <button className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
