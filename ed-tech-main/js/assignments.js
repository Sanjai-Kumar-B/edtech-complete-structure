(async function() {
  const { data: { user } } = await window.db.auth.getUser()
  if (!user) { window.location.href = 'index.html'; return; }
  const { data: studentProfile } = await window.db.from('users').select('*').eq('id', user.id).single()
  window.STUDENT = studentProfile
  const S = window.STUDENT;

  // Fetch active batches
  const { data: enrollments } = await window.db.from('enrollments').select('batch_id, batches(courses(code))').eq('student_id', S.id).eq('status', 'active');
  const batchIds = (enrollments || []).map(e => e.batch_id);
  const courseCodeMap = {};
  (enrollments || []).forEach(e => { if(e.batches?.courses) courseCodeMap[e.batch_id] = e.batches.courses.code; });

  // Fetch all assignments and submissions
  let assignments = [];
  let submissions = [];
  if(batchIds.length > 0) {
      const { data: aData } = await window.db.from('assignments').select('*').in('batch_id', batchIds).eq('is_published', true).order('due_date', { ascending: false });
      if(aData) assignments = aData;
      const { data: sData } = await window.db.from('assignment_submissions').select('*').eq('student_id', S.id).in('assignment_id', assignments.map(a => a.id));
      if(sData) submissions = sData;
  }

  // Render assignments
  const listEl = document.getElementById('assignment-list');
  if(!listEl) return;

  let html = '';
  assignments.forEach(a => {
      const sub = submissions.find(s => s.assignment_id === a.id);
      const isOverdue = !sub && new Date(a.due_date) < new Date();
      
      let status = '';
      let icon = '';
      let colorClass = '';
      let badgeHtml = '';
      let btnHtml = '';

      if (sub) {
          if (sub.status === 'reviewed' || sub.score !== null) {
              status = 'reviewed';
              icon = 'verified';
              colorClass = 'violet';
              badgeHtml = `<span class="px-2.5 py-0.5 bg-violet-500 text-white text-[9px] font-medium rounded-full uppercase tracking-widest">Reviewed: ${sub.score || 100}</span>`;
          } else {
              status = 'submitted';
              icon = 'check_circle';
              colorClass = 'blue';
              badgeHtml = `<span class="px-2.5 py-0.5 bg-blue-500 text-white text-[9px] font-medium rounded-full uppercase tracking-widest">Submitted</span>`;
          }
          btnHtml = `<button onclick="openUploadModal('${a.id}', true)" class="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2.5 px-6 rounded-full text-sm transition-all shadow-sm">View Submission</button>`;
      } else {
          status = 'pending';
          icon = isOverdue ? 'warning' : 'schedule';
          colorClass = isOverdue ? 'red' : 'orange';
          badgeHtml = `<span class="px-2.5 py-0.5 bg-${colorClass}-500 text-white text-[9px] font-medium rounded-full uppercase tracking-widest">${isOverdue ? 'Overdue' : 'Due Soon'}</span>`;
          btnHtml = `<button onclick="openUploadModal('${a.id}', false)" class="w-full sm:w-auto bg-violet-600 text-white font-medium py-2.5 px-6 rounded-full text-sm transition-all shadow-md shadow-violet-500/10 hover:bg-violet-700">Submit</button>`;
      }

      const courseCode = courseCodeMap[a.batch_id] || 'Course';

      html += `
      <div class="assignment-card group bg-white rounded-lg p-6 shadow-sm border border-slate-100 hover:-translate-y-1 transition-all duration-300" data-status="${status}">
          <div class="flex flex-col sm:flex-row justify-between gap-4">
              <div class="flex gap-5">
                  <div class="w-12 h-12 bg-${colorClass}-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span class="material-symbols-outlined text-${colorClass}-500">${icon}</span>
                  </div>
                  <div>
                      <div class="flex items-center gap-3 mb-1">
                          ${badgeHtml}
                          <span class="text-slate-400 text-xs font-light">${courseCode}</span>
                      </div>
                      <h3 class="text-xl font-black text-slate-800 mb-2">${a.title}</h3>
                      <div class="flex items-center gap-4 text-sm text-slate-500 font-light">
                          <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-base">calendar_today</span> Due: ${new Date(a.due_date).toLocaleDateString()}</span>
                      </div>
                  </div>
              </div>
              <div class="sm:self-center">${btnHtml}</div>
          </div>
      </div>`;
  });

  if (assignments.length === 0) {
      html = '<p class="text-slate-500 font-medium">No assignments found.</p>';
  }
  listEl.innerHTML = html;

  // Update Stats Progress Card
  const doneCount = submissions.length;
  const totalCount = assignments.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  
  const statsHtml = `
  <div class="bg-white rounded-lg p-8 relative overflow-hidden shadow-sm border border-slate-100">
      <div class="relative z-10">
          <h4 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Velocity</h4>
          <div class="flex items-center justify-center mb-8 relative">
              <svg class="w-32 h-32 transform -rotate-90">
                  <circle class="text-slate-100" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" stroke-width="12"></circle>
                  <circle class="text-emerald-500" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" stroke-dasharray="${pct * 3.64} 364" stroke-width="12"></circle>
              </svg>
              <div class="absolute flex flex-col items-center">
                  <span class="text-2xl font-extrabold text-slate-800">${pct}%</span>
                  <span class="text-[10px] text-slate-500 font-bold uppercase">Tasks</span>
              </div>
          </div>
          <div class="space-y-4">
              <div class="flex justify-between items-center text-sm">
                  <span class="text-slate-500">Assignments Done</span>
                  <span class="font-bold">${doneCount} / ${totalCount}</span>
              </div>
          </div>
      </div>
  </div>`;
  
  // Replace the hardcoded progress card with dynamic one
  const lgCol4 = document.querySelector('.lg\\:col-span-4');
  if(lgCol4) {
      lgCol4.innerHTML = statsHtml;
  }

  // File Upload Modal Logic
  window.openUploadModal = function(assignmentId, isSubmitted) {
      const modalHtml = `
      <div id="upload-modal" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button onclick="document.getElementById('upload-modal').remove()" class="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                  <span class="material-symbols-outlined">close</span>
              </button>
              <h3 class="text-2xl font-black text-slate-800 mb-2">${isSubmitted ? 'View Submission' : 'Submit Assignment'}</h3>
              <p class="text-slate-500 text-sm mb-8">${isSubmitted ? 'You have already submitted a file for this assignment.' : 'Upload your work below. Allowed formats: PDF, ZIP, DOCX.'}</p>
              
              <div class="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 mb-8 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span class="material-symbols-outlined text-4xl text-slate-400 mb-4">cloud_upload</span>
                  <p class="font-bold text-slate-700">${isSubmitted ? 'submitted_work.pdf' : 'Click to browse files'}</p>
                  <p class="text-xs text-slate-400 mt-1">${isSubmitted ? '2.4 MB' : 'Max file size: 50MB'}</p>
              </div>
              
              ${!isSubmitted ? `<button onclick="submitDummyAssignment('${assignmentId}')" class="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-full shadow-lg shadow-violet-500/20 transition-all">Confirm Submission</button>` : `<button onclick="document.getElementById('upload-modal').remove()" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-full transition-all">Close</button>`}
          </div>
      </div>`;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
  };

  window.submitDummyAssignment = async function(assignmentId) {
      const { error } = await window.db.from('assignment_submissions').insert({
          assignment_id: assignmentId,
          student_id: S.id,
          file_url: 'https://dummy-bucket/file.pdf',
          status: 'submitted'
      });
      if(error) {
          alert('Submission failed: ' + error.message);
      } else {
          alert('Assignment submitted successfully!');
          document.getElementById('upload-modal').remove();
          window.location.reload();
      }
  };

  // Initially show all
  if (typeof filterAssignments === 'function') {
      const activeTab = document.querySelector('.filter-tab.bg-white');
      if(activeTab) filterAssignments('all', activeTab);
  }

})();
