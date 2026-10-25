(async function() {
  const userStr = localStorage.getItem('mock_user');
  if (!userStr) { 
      if (window.parent && window.parent !== window) {
          window.parent.location.href = 'index.html';
      } else {
          window.location.href = 'index.html';
      }
      return; 
  }
  const studentProfile = JSON.parse(userStr);
  window.STUDENT = studentProfile;
  
  const todayIso = new Date().toISOString().split('T')[0];

  // CENTRAL MOCK DATABASE
  const DB = {
      users: [
          studentProfile,
          { id: 'mock-stu-2', full_name: 'Elena Rodriguez', avatar_initials: 'ER', avatar_color: '#10b981', role: 'student' },
          { id: 'mock-inst-1', full_name: 'Dr. Aris Thorne', avatar_initials: 'AT', avatar_color: '#8b5cf6', role: 'instructor' }
      ],
      enrollments: [
          {
              id: 'mock-enrollment-1',
              student_id: studentProfile.id,
              status: 'active',
              batches: {
                  id: 'mock-batch-1',
                  batch_code: 'WD-301-A',
                  courses: { id: 'mock-course-1', title: 'Full-Stack Architecture', code: 'WD-301', description: 'End-to-end web application design with Node.js, React, and cloud deployment.', course_modules: [{ count: 12 }] },
                  users: { id: 'mock-inst-1', full_name: 'Dr. Aris Thorne', avatar_initials: 'AT' }
              }
          },
          {
              id: 'mock-enrollment-2',
              student_id: studentProfile.id,
              status: 'active',
              batches: {
                  id: 'mock-batch-2',
                  batch_code: 'DS-101-B',
                  courses: { id: 'mock-course-2', title: 'Introduction to Data Science', code: 'DS-101', description: 'Python, pandas, machine learning fundamentals, and data storytelling.', course_modules: [{ count: 8 }] },
                  users: { id: 'mock-inst-1', full_name: 'Dr. Aris Thorne', avatar_initials: 'AT' }
              }
          }
      ],
      batches: [
          { id: 'mock-batch-1', batch_code: 'WD-301-A', courses: { id: 'mock-course-1', title: 'Full-Stack Architecture', code: 'WD-301', description: 'Learn to build apps' } }
      ],
      sessions: [
          { id: 's-1', batch_id: 'mock-batch-1', title: 'HTML Foundations', session_date: '2026-06-20', start_time: '10:00:00', type: 'CLASS' },
          { id: 's-2', batch_id: 'mock-batch-1', title: 'React Deep Dive', session_date: todayIso, start_time: '14:00:00', type: 'CLASS', zoom_link: 'https://zoom.us', resource_url: 'https://example.com/react-slides.pdf', batches: { batch_code: 'WD-301-A', courses: { code: 'WD-301' } } },
          { id: 's-3', batch_id: 'mock-batch-1', title: 'Next.js Routing', session_date: '2026-06-28', start_time: '10:00:00', type: 'WORKSHOP' }
      ],
      attendance: [
          { id: 'a-1', session_id: 's-1', student_id: studentProfile.id, status: 'present' },
          { id: 'a-2', session_id: 's-2', student_id: studentProfile.id, status: 'present' }
      ],
      assignments: [
          { id: 'ass-1', batch_id: 'mock-batch-1', title: 'Build a Personal Portfolio', due_date: '2026-06-30T23:59:00Z', is_published: true, max_score: 100, description: 'Create a responsive portfolio using Tailwind CSS.' },
          { id: 'ass-2', batch_id: 'mock-batch-1', title: 'React Hooks Challenge', due_date: '2026-06-21T23:59:00Z', is_published: true, max_score: 100, description: 'Implement custom hooks.' }
      ],
      assignment_submissions: [
          { id: 'sub-1', assignment_id: 'ass-2', student_id: studentProfile.id, status: 'reviewed', score: 92, created_at: '2026-06-21T10:00:00Z', feedback: 'Great work on the useMemo implementation.' }
      ],
      assessments: [
          { id: 'test-1', batch_id: 'mock-batch-1', title: 'JavaScript Fundamentals Test', due_date: '2026-06-26T23:59:00Z', is_published: true, duration_minutes: 45, description: 'Covering ES6+ features.', batches: { batch_code: 'WD-301-A', courses: { title: 'Full-Stack Architecture', code: 'WD-301' } } }
      ],
      assessment_submissions: [],
      student_skills: [
          { student_id: studentProfile.id, consistency: 92, technical: 88, conceptual: 95, participation: 85 }
      ],
      roadmap_weeks: [
          { id: 'rw-1', batch_id: 'mock-batch-1', week_number: 1, title: 'Web Fundamentals', description: 'HTML, CSS, and basic JS.', status: 'completed' },
          { id: 'rw-2', batch_id: 'mock-batch-1', week_number: 2, title: 'Frontend Frameworks', description: 'Introduction to React.js', status: 'active' },
          { id: 'rw-3', batch_id: 'mock-batch-1', week_number: 3, title: 'Backend Integration', description: 'Node.js and Databases', status: 'locked' }
      ],
      assessment_questions: [
          { id: 'q-1', assessment_id: 'test-1', question_text: 'What does "let" do in JavaScript?', options: ['Declares block-scoped variable', 'Declares global variable', 'Creates a loop'], correct_answer: 0, order_index: 1 },
          { id: 'q-2', assessment_id: 'test-1', question_text: 'Which array method transforms every element?', options: ['filter()', 'map()', 'reduce()'], correct_answer: 1, order_index: 2 }
      ]
  };

  // UNCONDITIONALLY OVERRIDE window.db to intercept all Supabase calls
  const mockQueryBuilder = (table) => {
      const builder = {
          select: () => builder,
          eq: () => builder,
          in: () => builder,
          lt: () => builder,
          lte: () => builder,
          gte: () => builder,
          order: () => builder,
          limit: () => builder,
          insert: () => builder,
          update: () => builder,
          maybeSingle: async () => {
              const records = DB[table] || [];
              return { data: records.length > 0 ? records[0] : null };
          },
          single: async () => {
              const records = DB[table] || [];
              return { data: records.length > 0 ? records[0] : null };
          },
          then: (resolve) => {
              const records = DB[table] || [];
              resolve({ data: records, error: null });
          }
      };
      return builder;
  };
  
  window.db = {
      auth: { 
          getUser: async () => ({ data: { user: studentProfile } }),
          signOut: async () => {} 
      },
      from: (table) => mockQueryBuilder(table)
  };

  window.dispatchEvent(new CustomEvent('junospace:ready'));
})();
