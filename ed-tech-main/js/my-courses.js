// ============================================================
// Junospace — My Courses Page Supabase Integration
// ============================================================

window.addEventListener('junospace:ready', async function () {
  const S = window.STUDENT;
  if (!S) return;

  try {
    const { data: enrollments } = await window.db
      .from('enrollments').select('*, batches(*, courses(*))').eq('student_id', S.id);

    if (!enrollments) return;

    const total = enrollments.length;
    const completed = enrollments.filter(e => e.status === 'completed').length;
    const inProgress = enrollments.filter(e => e.status === 'active').length;

    const elTotal = document.querySelector('.stat-total');
    if (elTotal) elTotal.textContent = String(total).padStart(2, '0');
    
    const elCompleted = document.querySelector('.stat-completed');
    if (elCompleted) elCompleted.textContent = String(completed).padStart(2, '0');
    
    const elInProgress = document.querySelector('.stat-inprogress');
    if (elInProgress) elInProgress.textContent = String(inProgress).padStart(2, '0');

    const coursesContainer = document.querySelector('.courses-list');
    if (coursesContainer) {
      coursesContainer.innerHTML = '';
      enrollments.forEach(enrollment => {
        const course = enrollment.batches?.courses;
        const batch = enrollment.batches;
        if (!course || !batch) return;

        coursesContainer.innerHTML += `
          <div class="course-row-card">
            <div class="course-thumbnail" style="background: linear-gradient(135deg, #6C35DE, #a855f7)">
              <span class="course-code-badge">${course.code}</span>
            </div>
            <div class="course-info">
              <h3>${course.title}</h3>
              <p>Lead Instructor: <strong>${batch.instructor_name || 'TBA'}</strong></p>
              <div class="progress-bar-wrap">
                <span>OVERALL PROGRESS</span>
                <span class="progress-pct-label">—%</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div>
              <button class="continue-btn" onclick="openCourse('${course.id}', '${batch.id}')">Continue Learning</button>
            </div>
          </div>`;
      });
    }

    window.openCourse = (courseId, batchId) => {
      localStorage.setItem('current_course_id', courseId);
      localStorage.setItem('current_batch_id', batchId);
      window.parent && window.parent.postMessage ? window.parent.postMessage({action:'navigate',page:'course-detail'},'*') : window.location.href = '../course_detail_page/code.html';
    };

    console.log('[MyCourses] Supabase integration loaded');
  } catch (e) {
    console.warn('[MyCourses] Error:', e);
  }
});
