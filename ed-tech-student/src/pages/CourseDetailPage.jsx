import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function CourseDetailPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('live');

  // Mock Database mapping courseId to data
  const courseDatabase = {
    'ARC101': {
      title: 'Introduction to Urban Design',
      duration: 'Fall 2023 - Spring 2024',
      description: 'Explore the fundamental concepts of designing urban spaces, focusing on sustainability, community engagement, and architectural integration.',
      tags: ['Architecture', 'Urban Planning', 'Sustainability'],
      instructor: 'Dr. Sarah Jenkins',
      capacity: '30 / 35',
      progress: '73%',
      live_class: {
        today: 'Urban Sprawl Analysis',
        today_desc: 'Analyzing the effects of unchecked urban expansion.',
        tomorrow: 'Community Planning Lab',
        tomorrow_desc: 'Interactive session on gathering community feedback.'
      }
    },
    'UX204': {
      title: 'Human-Computer Interaction in Public Spaces',
      duration: 'Winter 2023 - Summer 2024',
      description: 'Understand how people interact with technology in public environments, covering kiosk design, public displays, and accessibility.',
      tags: ['UX Design', 'HCI', 'Public Spaces'],
      instructor: 'Prof. Marcus Chen',
      capacity: '40 / 50',
      progress: '45%',
      live_class: {
        today: 'Kiosk Interface Prototyping',
        today_desc: 'Designing interfaces for high-traffic environments.',
        tomorrow: 'Accessibility Testing Lab',
        tomorrow_desc: 'Ensuring public interfaces meet WCAG standards.'
      }
    },
    'default': {
      title: 'Advanced Machine Learning',
      duration: 'October 2023 - March 2024',
      description: 'Master the complexities of deep learning architectures, reinforcement learning paradigms, and the mathematical foundations of large-scale neural systems. This course bridges academic theory with industry-scale implementation.',
      tags: ['Neural Networks', 'PyTorch', 'Linear Algebra'],
      instructor: 'Dr. Emily Chen',
      capacity: '45 / 50',
      progress: '90%',
      live_class: {
        today: 'Convolutional Architectures in Practice',
        today_desc: 'Deep dive into ResNet and EfficientNet implementations.',
        tomorrow: 'Recurrent Units & LSTMs',
        tomorrow_desc: 'Foundational sequences for NLP and time-series data.'
      }
    }
  };

  const course = courseDatabase[courseId] || courseDatabase['default'];

  return (
    <div className="space-y-8">
      {/* Course Header Section */}
      <section className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">{course.title}</h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-violet-50 text-violet-600 font-bold text-[10px] rounded-full uppercase tracking-widest border border-violet-100 italic">{course.duration}</span>
            <span className="text-slate-400 text-xs font-medium">• Course Duration</span>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed mt-4">
            {course.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {course.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 shrink-0">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden">
              <img className="w-full h-full object-cover" alt="Dr. Emily Chen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHf9apLJjB-DSxoZoZKR4iU-wuGcnChNsTs0oznVK7coi68frKOA139-GzWXHHwFshcUOewnhs1kIewuFWEXxAfBIEowIL-JulwMnWoFnIMlSAr2Ei4m4Jumwq6pjx_qy4J7uEBOw3u3YVDohG7-d6u6QnAHefoJ_7xsRYC41fxfEzeVAsvM9AgNyhdQIGeJl1gRYob6T_wXOKnOAily6II9U3B-aBrO432fdjzXtiCmqlqqw7-5XMq7CvvHL00XjEdkjUbdSbO_g" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">{course.instructor}</h4>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Course Instructor</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Class Capacity</span>
              <span className="font-bold">{course.capacity}</span>
            </div>
            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-violet-600 rounded-full" style={{ width: course.progress }}></div>
            </div>
            <button onClick={() => navigate('/profile')} className="w-full py-3 border border-violet-600 text-violet-600 font-bold rounded-lg hover:bg-violet-600/5 transition-colors cursor-pointer">
              View Profile
            </button>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="border-b border-slate-200">
        <div className="flex space-x-8 overflow-x-auto pb-0">
          <button onClick={() => setActiveTab('live')} className={`whitespace-nowrap pb-4 border-b-2 font-bold text-sm tracking-wide transition-all ${activeTab === 'live' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-violet-600'}`}>Live Classes</button>
          <button onClick={() => setActiveTab('assignments')} className={`whitespace-nowrap pb-4 border-b-2 font-bold text-sm tracking-wide transition-all ${activeTab === 'assignments' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-violet-600'}`}>Assignments</button>
          <button onClick={() => setActiveTab('materials')} className={`whitespace-nowrap pb-4 border-b-2 font-bold text-sm tracking-wide transition-all ${activeTab === 'materials' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-violet-600'}`}>Materials</button>
          <button onClick={() => setActiveTab('assessments')} className={`whitespace-nowrap pb-4 border-b-2 font-bold text-sm tracking-wide transition-all ${activeTab === 'assessments' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-violet-600'}`}>Assessments</button>
          <button onClick={() => setActiveTab('roadmap')} className={`whitespace-nowrap pb-4 border-b-2 font-bold text-sm tracking-wide transition-all ${activeTab === 'roadmap' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-violet-600'}`}>AI Roadmap</button>
        </div>
      </section>

      {/* Tab Content: Live Classes */}
      <section className="py-6">
        {activeTab === 'live' && (
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Upcoming Schedule</h3>
              <div className="flex space-x-2">
                <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Timeline Element */}
            <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {/* Event 1 */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center border-4 border-[#F8F7FC]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-1">Today • 14:00 PM</p>
                    <h4 className="text-base font-bold text-slate-800">{course.live_class.today}</h4>
                    <p className="text-sm text-slate-500 mt-1">{course.live_class.today_desc}</p>
                  </div>
                  <button className="px-6 py-2 bg-[#6C35DE] hover:bg-[#5a2bc4] text-white text-xs font-bold rounded-full shadow-md shadow-[#6C35DE]/20 active:scale-95 transition-all whitespace-nowrap">
                    Join Now
                  </button>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center border-4 border-[#F8F7FC]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-70">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tomorrow • 10:00 AM</p>
                    <h4 className="text-base font-bold text-slate-800">{course.live_class.tomorrow}</h4>
                    <p className="text-sm text-slate-500 mt-1">{course.live_class.tomorrow_desc}</p>
                  </div>
                  <button className="px-6 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-full cursor-not-allowed whitespace-nowrap border border-slate-200">
                    Locked
                  </button>
                </div>
              </div>
            </div>

            {/* Assignments Status Section */}
            <div className="pt-6">
              <h3 className="text-lg font-black text-slate-800 tracking-tight mb-4">Recent Assignments</h3>
              <div className="space-y-4">
                {/* Assignment Card: Overdue */}
                <div className="group bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-red-500">warning</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="px-2.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full uppercase tracking-widest">Overdue</span>
                          <span className="text-slate-400 text-xs font-medium">Gradient Descent Lab</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-1">Backpropagation Implementation</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">calendar_today</span> Due 2 days ago
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:self-center">
                      <button className="w-full sm:w-auto bg-violet-600 text-white font-bold py-2 px-5 rounded-full text-xs transition-all shadow-md shadow-violet-500/20 hover:bg-violet-700">Submit</button>
                    </div>
                  </div>
                </div>

                {/* Assignment Card: Due Soon */}
                <div className="group bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-orange-500">schedule</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="px-2.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full uppercase tracking-widest">Due Soon</span>
                          <span className="text-slate-400 text-xs font-medium">Linear Algebra Review</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-1">Matrix Transformations Quiz</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">calendar_today</span> Oct 20, 2023
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:self-center">
                      <button className="w-full sm:w-auto bg-violet-600 text-white font-bold py-2 px-5 rounded-full text-xs transition-all shadow-md shadow-violet-500/20 hover:bg-violet-700">Start</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Assignments */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">All Assignments</h3>
            <div className="space-y-4">

              {/* Assignment Card: Overdue */}
              <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-red-500">warning</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full uppercase tracking-widest">Overdue</span>
                        <span className="text-slate-400 text-xs font-medium">Gradient Descent Lab</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-2">Backpropagation Implementation</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">calendar_today</span> Due 2 days ago
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:self-center">
                    <button className="w-full sm:w-auto bg-violet-600 text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all shadow-md shadow-violet-500/20 hover:bg-violet-700">Submit</button>
                  </div>
                </div>
              </div>

              {/* Assignment Card: Due Soon */}
              <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-orange-500">schedule</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full uppercase tracking-widest">Due Soon</span>
                        <span className="text-slate-400 text-xs font-medium">Linear Algebra Review</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-2">Matrix Transformations Quiz</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">calendar_today</span> Oct 20, 2023
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:self-center">
                    <button className="w-full sm:w-auto bg-violet-600 text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all shadow-md shadow-violet-500/20 hover:bg-violet-700">Start</button>
                  </div>
                </div>
              </div>

              {/* Assignment Card: Completed */}
              <div className="group bg-slate-50/50 border border-slate-100 rounded-2xl p-6 transition-all">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full uppercase tracking-widest">Completed</span>
                        <span className="text-slate-400 text-xs font-medium">Calculus for ML</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 opacity-60 mb-2">Partial Derivatives Test</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 font-medium opacity-60">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base">task_alt</span> Submitted Oct 05
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:self-center text-emerald-600 font-bold text-sm">Graded: 98/100</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab Content: Materials */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Course Materials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Card 1: PDF Notes */}
              <div className="group bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-violet-600/10 active:scale-[0.98]">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <button className="bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-sm shadow-violet-200 transition-all flex items-center gap-1">
                    DOWNLOAD <span className="material-symbols-outlined text-[14px]">download</span>
                  </button>
                </div>
                <h4 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">Lecture Notes: Optimization Theory</h4>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">Comprehensive notes covering stochastic gradient descent and momentum variations.</p>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-4">
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">save</span> 4.2 MB
                  </span>
                </div>
              </div>

              {/* Card 2: Research Paper */}
              <div className="group bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-violet-600/10 active:scale-[0.98]">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">article</span>
                  </div>
                  <button className="bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-sm shadow-violet-200 transition-all flex items-center gap-1">
                    READ NOW <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </button>
                </div>
                <h4 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">Stochastic Gradient Descent Refined</h4>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">Foundational paper on efficient training of large-scale neural architectures.</p>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-4">
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">text_snippet</span> 14 Pages
                  </span>
                </div>
              </div>

              {/* Card 3: Dataset */}
              <div className="group bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-violet-600/10 active:scale-[0.98]">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">data_object</span>
                  </div>
                  <button className="bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-sm shadow-violet-200 transition-all flex items-center gap-1">
                    OPEN DATA <span className="material-symbols-outlined text-[14px]">database</span>
                  </button>
                </div>
                <h4 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">MNIST Extended Dataset</h4>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">Compressed dataset for architectural validation in Week 4 tasks.</p>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-4">
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">link</span> External Zip
                  </span>
                </div>
              </div>

              {/* Card 4: Documentation */}
              <div className="group bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-violet-600/10 active:scale-[0.98]">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <button className="bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-sm shadow-violet-200 transition-all flex items-center gap-1">
                    VIEW DOC <span className="material-symbols-outlined text-[14px]">find_in_page</span>
                  </button>
                </div>
                <h4 className="font-bold text-slate-800 group-hover:text-violet-600 transition-colors">Neural Network Paradigms .docx</h4>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">Detailed documentation on the various paradigms discussed in the seminars.</p>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-4">
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">article</span> 2.1 MB
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab Content: Assessments */}
        {activeTab === 'assessments' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Assessments</h3>

            <div className="space-y-6">
              {/* Active Assessment 1 */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[1.2rem] bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                    <span className="material-symbols-outlined text-xl">quiz</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-violet-600 transition-colors">Midterm Evaluation</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">BATCH-24A</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Due Oct 24, 2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-black text-slate-800">45m</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                  </div>
                  <button onClick={() => navigate('/assessments/midterm')} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">Initialize Quest</button>
                </div>
              </div>

              {/* Completed Assessment 1 */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[1.2rem] bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                    <span className="material-symbols-outlined text-xl">verified</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-violet-600 transition-colors">Introductory Module Exam</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">BATCH-24A</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Resolved</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-800">94%</p>
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Success Rate</p>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab Content: AI Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">AI Roadmap Generation</h3>
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-8 rounded-3xl shadow-lg">
              <h4 className="font-bold text-xl mb-2 text-white">Your Personalized Learning Path</h4>
              <p className="text-violet-100 text-sm max-w-lg mb-6">Based on your recent assignment scores, Junospace AI has charted an optimized pathway to master {course.title}.</p>
              <button className="bg-white text-violet-700 px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-slate-50 transition-colors">
                View Generated Roadmap
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
