(async function() {
  const { data: { user } } = await window.db.auth.getUser()
  if (!user) { window.location.href = 'index.html'; return; }
  const { data: studentProfile } = await window.db.from('users').select('*').eq('id', user.id).single()
  window.STUDENT = studentProfile
  const S = window.STUDENT;

  const form = document.getElementById('profile-form');
  const avatarInput = document.getElementById('avatar-input');
  const avatarImg = document.getElementById('profile-avatar');
  const nameInput = document.getElementById('name-input');
  const emailInput = document.getElementById('email-input');
  const phoneInput = document.getElementById('phone-input');
  const levelInput = document.getElementById('level-input');
  const saveBtn = document.getElementById('save-btn');
  
  const displayName = document.getElementById('display-name');
  const displayRole = document.getElementById('display-role');

  // Populate form
  if (S.avatar_url) {
      avatarImg.src = S.avatar_url;
      avatarInput.value = S.avatar_url;
  } else if (S.avatar_initials) {
      // Use initials if no URL
      avatarImg.src = `https://ui-avatars.com/api/?name=${S.avatar_initials}&background=${S.avatar_color.replace('#','')}&color=fff&size=128`;
  }

  nameInput.value = S.full_name || '';
  emailInput.value = S.email || S.login_id + '@mail.com';
  phoneInput.value = S.phone_number || '';
  levelInput.value = 'Level ' + (S.level || 1) + ' Apprentice';
  
  displayName.innerText = S.full_name || 'Student';
  displayRole.innerText = (S.role || 'Student') + ' • ' + (S.login_id || 'ID');

  // Update image preview on blur
  avatarInput.addEventListener('blur', () => {
      if (avatarInput.value) {
          avatarImg.src = avatarInput.value;
      }
  });

  // Handle Save
  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      saveBtn.disabled = true;
      saveBtn.innerText = 'Saving...';
      
      const newAvatarUrl = avatarInput.value;
      const newPhone = phoneInput.value;

      const { error } = await window.db.from('users').update({
          avatar_url: newAvatarUrl,
          phone_number: newPhone
      }).eq('id', S.id);

      if (error) {
          alert('Error updating profile: ' + error.message);
      } else {
          alert('Profile updated successfully!');
          window.STUDENT.avatar_url = newAvatarUrl;
          window.STUDENT.phone_number = newPhone;
      }
      
      saveBtn.disabled = false;
      saveBtn.innerText = 'Save Profile';
  });

  // PASSWORD CHANGE LOGIC
  window.verifyCurrentPassword = async function() {
      const pwd = document.getElementById('current-password').value;
      if(!pwd) return;

      // Supabase doesn't have a direct "verify password" without re-signin
      // So we try to sign in again with the current email and provided password
      const { error } = await window.db.auth.signInWithPassword({
          email: S.email || (S.login_id + '@mail.com'),
          password: pwd
      });

      if(error) {
          alert('Incorrect current password. Please try again.');
      } else {
          // Success - show next step
          document.getElementById('password-verify-step').classList.add('hidden');
          document.getElementById('password-change-step').classList.remove('hidden');
      }
  };

  window.updatePassword = async function() {
      const newPwd = document.getElementById('new-password').value;
      const confirmPwd = document.getElementById('confirm-password').value;

      if(!newPwd || newPwd.length < 6) {
          alert('Password must be at least 6 characters.');
          return;
      }
      if(newPwd !== confirmPwd) {
          alert('Passwords do not match.');
          return;
      }

      const { error } = await window.db.auth.updateUser({ password: newPwd });

      if(error) {
          alert('Error updating password: ' + error.message);
      } else {
          alert('Password updated successfully!');
          document.getElementById('new-password').value = '';
          document.getElementById('confirm-password').value = '';
          document.getElementById('password-change-step').classList.add('hidden');
          document.getElementById('password-verify-step').classList.remove('hidden');
          document.getElementById('current-password').value = '';
      }
  };

})();
