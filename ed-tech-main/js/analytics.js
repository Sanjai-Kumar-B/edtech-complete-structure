(async function() {
  const { data: { user } } = await window.db.auth.getUser()
  if (!user) { window.location.href = 'index.html'; return; }
  const { data: studentProfile } = await window.db.from('users').select('*').eq('id', user.id).single()
  window.STUDENT = studentProfile;
  const S = window.STUDENT;

  // 1. Fetch relevant data
  const { data: assignSubs } = await window.db.from('assignment_submissions').select('*').eq('student_id', S.id).order('created_at', { ascending: true });
  const { data: assessSubs } = await window.db.from('assessment_submissions').select('*').eq('student_id', S.id).order('created_at', { ascending: true });
  const { data: skills } = await window.db.from('student_skills').select('*').eq('student_id', S.id).maybeSingle();
  
  // 2. Process Data for Line Chart (Recent Performance)
  const allScores = [...(assignSubs || []), ...(assessSubs || [])].sort((a,b) => new Date(a.created_at) - new Date(b.created_at)).slice(-6);
  const lineLabels = allScores.map((s, i) => `Node ${i+1}`);
  const lineData = allScores.map(s => s.score || 0);

  const ctxLine = document.getElementById('lineChart');
  if(ctxLine && lineData.length > 0) {
      new Chart(ctxLine, {
          type: 'line',
          data: {
              labels: lineLabels.length > 0 ? lineLabels : ['Start', 'Current'],
              datasets: [{
                  label: 'Performance %',
                  data: lineData.length > 0 ? lineData : [0, 0],
                  borderColor: '#7c3aed',
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: '#fff',
                  pointBorderColor: '#7c3aed',
                  pointBorderWidth: 2,
                  pointRadius: 4
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                  y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
                  x: { grid: { display: false } }
              }
          }
      });
  }

  // 3. Update Skills from DB
  if (skills) {
      const updateSkill = (id, val) => {
          const el = document.getElementById(id);
          if (el) {
              const scoreEl = el.querySelector('.text-2xl, .text-5xl');
              const barEl = el.querySelector('.bg-violet-600, .bg-emerald-500, .bg-amber-500, .bg-blue-500');
              if(scoreEl) scoreEl.innerText = `${val}%`;
              if(barEl) barEl.style.width = `${val}%`;
          }
      };
      updateSkill('skill-logic', skills.logic || 88);
      updateSkill('skill-tech', skills.technical || 92);
      updateSkill('skill-speed', skills.speed || 74);
      updateSkill('skill-collab', skills.participation || 95);
      updateSkill('skill-efficiency', skills.consistency || 94);
  }

})();
