import { Link } from "react-router-dom";

export function MyCourses() {
  const courses = [
    {
      id: "cs-101",
      title: "Introduction to Data Science",
      code: "DS-101",
      progress: 85,
      instructor: "Prof. Sarah Jenkins",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=400",
      status: "On Track"
    },
    {
      id: "ds-201",
      title: "Advanced Machine Learning",
      code: "DS-201",
      progress: 42,
      instructor: "Dr. Alan Turing",
      thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800&h=400",
      status: "Needs Attention"
    }
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 flex items-center justify-between group hover:border-primary/30 transition-all">
          <div>
            <p className="text-4xl font-black text-on-surface mb-1">03</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Total Enrolled</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 flex items-center justify-between group hover:border-emerald-300/30 transition-all">
          <div>
            <p className="text-4xl font-black text-on-surface mb-1">01</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Completed</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 flex items-center justify-between group hover:border-orange-300/30 transition-all">
          <div>
            <p className="text-4xl font-black text-on-surface mb-1">02</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60">In Progress</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
            <span className="material-symbols-outlined text-2xl">pending</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content: Course Cards */}
        <div className="lg:col-span-8 space-y-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 overflow-hidden group hover:border-primary/20 transition-all">
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-5 h-64 md:h-auto relative overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-on-surface text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                      {course.code}
                    </span>
                  </div>
                </div>
                <div className="md:col-span-7 p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black text-on-surface leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                      <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                        <img src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`} alt={course.instructor} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-secondary mb-8">Lead Instructor: <span className="text-on-surface">{course.instructor}</span></p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Overall Progress</p>
                        <p className="text-sm font-black text-primary">{course.progress}%</p>
                      </div>
                      <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-4">
                    <Link to={`/student/course/${course.id}`} className="flex-1 py-4 bg-primary text-white font-black text-sm rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-center">
                      Continue Learning
                    </Link>
                    <button className="w-14 h-14 bg-surface-container-low text-on-surface rounded-2xl flex items-center justify-center hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Side Content: Assignments */}
        <div className="lg:col-span-4">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 sticky top-28">
            <h3 className="text-xl font-black text-on-surface mb-8">Recent Assignments</h3>
            <div className="space-y-6">
              {[
                { title: "Data Model Design", course: "DS-101", due: "Due Tomorrow", status: "pending", color: "text-orange-500 bg-orange-50 border-orange-100" },
                { title: "Neural Net Paper", course: "DS-201", due: "Submitted", status: "completed", color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
                { title: "SQL Optimization", course: "DS-101", due: "Due in 3 days", status: "pending", color: "text-primary bg-primary/5 border-primary/10" }
              ].map((item, idx) => (
                <div key={idx} className={`p-6 rounded-[1.5rem] border ${item.color} group cursor-pointer hover:scale-[1.02] transition-transform`}>
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{item.course}</p>
                    <span className="material-symbols-outlined text-lg">{item.status === 'completed' ? 'verified' : 'pending_actions'}</span>
                  </div>
                  <p className="font-black text-on-surface group-hover:text-primary transition-colors mb-1">{item.title}</p>
                  <p className="text-xs font-bold opacity-60">{item.due}</p>
                </div>
              ))}
            </div>
            <button className="mt-10 w-full py-4 border-2 border-outline-variant/30 text-on-surface font-black text-sm rounded-2xl hover:bg-surface-container-low transition-all">
              View All Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
