import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@junospace/supabase-client';

export function AdminProfile() {
  const { profile: user, logout } = useAuth();

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    avatar_url: '',
    avatar_color: '#00288e'
  });

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('users').update({
      full_name: profile.full_name,
      phone: profile.phone,
      avatar_color: profile.avatar_color
    }).eq('id', user.id);

    setSaving(false);
    if (!error) {
      setToast('Profile updated successfully');
      setTimeout(() => setToast(''), 3000);
    } else {
      alert(error.message);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      alert("Passwords don't match");
      return;
    }
    setSaving(true);

    // For password update, we use Supabase Auth update
    const { error } = await supabase.auth.updateUser({ password: passwords.next });

    setSaving(false);
    if (!error) {
      setToast('Password updated successfully');
      setPasswords({ current: '', next: '', confirm: '' });
      setTimeout(() => setToast(''), 3000);
    } else {
      alert(error.message);
    }
  };

  if (loading) return <div className="p-8 pt-24 text-center">Loading Admin Profile...</div>;

  return (
    <div className="pt-24 p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">Account Authority</h1>
          <p className="text-secondary font-medium mt-3">Manage your administrative credentials and security.</p>
        </div>
        <button onClick={logout} className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100 hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">logout</span> Sign Out Securely
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Identity Card */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-white" style={{ backgroundColor: profile.avatar_color }}>
                {profile.full_name?.charAt(0)}
              </div>
              <button className="absolute bottom-1 right-1 w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center border-4 border-white hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </button>
            </div>
            <h2 className="text-2xl font-black text-slate-800">{profile.full_name}</h2>
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">Super Administrator</p>

            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-secondary uppercase tracking-widest">Authority Level</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-black">Level 10</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-secondary uppercase tracking-widest">Access Nodes</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-black">All Portals</span>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Security Pulse</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Your account is protected by hardware-level encryption and global IP monitoring.</p>
            <div className="flex items-center gap-3 mt-4">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400">System Secure</span>
            </div>
          </section>
        </div>

        {/* Right: Management Forms */}
        <div className="lg:col-span-8 space-y-10">
          {/* Identity Form */}
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-indigo-600">badge</span> Identity Configuration
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Full Authority Name</label>
                  <input value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Primary Email</label>
                  <input disabled value={profile.email} className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Contact Link (Phone)</label>
                  <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Identity Color</label>
                  <input type="color" value={profile.avatar_color} onChange={e => setProfile({ ...profile, avatar_color: e.target.value })} className="w-full h-[56px] bg-slate-50 border-none rounded-2xl p-2 cursor-pointer" />
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={saving} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
                  {saving ? 'Synchronizing...' : 'Commit Identity Update'}
                </button>
              </div>
            </form>
          </section>

          {/* Security Form */}
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600">lock_open</span> Credential Rotation
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">New Authority Password</label>
                  <input type="password" value={passwords.next} onChange={e => setPasswords({ ...passwords, next: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-red-500/10 transition-all" placeholder="Enter robust new password" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Confirm New Password</label>
                  <input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-red-500/10 transition-all" placeholder="Repeat new password" />
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={saving || !passwords.next} className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
                  {saving ? 'Rotating Keys...' : 'Rotate Security Credentials'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 z-[100]">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          {toast}
        </div>
      )}
    </div>
  );
}
