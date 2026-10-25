// ============================================================
// Junospace — Login Page Supabase Integration
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const loginBtn = document.getElementById('login-submit-btn');
  const emailInput = document.getElementById('login_id');
  const passwordInput = document.getElementById('password');

  // Error display helper
  function showError(msg) {
    alert(msg);
  }

  async function handleSupabaseLogin() {
    const email = emailInput?.value?.trim();
    const password = passwordInput?.value;

    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }

    try {
      const { data, error } = await window.db.auth.signInWithPassword({ email, password });

      if (error) {
        showError('Invalid credentials. Please try again.');
        return;
      }

      // Verify role is student
      const { data: profile } = await window.db
        .from('users').select('role').eq('id', data.user.id).single();

      if (!profile || profile.role !== 'student') {
        showError('Access denied. This portal is for students only.');
        await window.db.auth.signOut();
        return;
      }

      // Success — navigate to dashboard
      if (window.parent && window.parent !== window && window.parent.doLogin) {
        window.parent.doLogin();
      } else {
        window.location.href = '../student_dashboard_dark_mode/code.html';
      }
    } catch (err) {
      console.error('[Login]', err);
      showError('Something went wrong. Please try again.');
    }
  }

  // Wire up the login button
  if (loginBtn) {
    loginBtn.onclick = function (e) {
      e.preventDefault();
      handleSupabaseLogin();
    };
  }

  // Wire up form submit (Enter key)
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleSupabaseLogin();
    });
  }
});
