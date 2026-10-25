import { useState, useEffect } from 'react';
import { supabase } from '@junospace/supabase-client';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function InstructorProfile() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    department: '',
    specialization: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        address: profile.address || '',
        department: profile.department || '',
        specialization: profile.specialization || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: form.full_name,
          phone: form.phone,
          date_of_birth: form.date_of_birth,
          address: form.address,
          department: form.department,
          specialization: form.specialization,
          bio: form.bio
        })
        .eq('id', user.id);

      if (error) throw error;
      setToast('Profile updated successfully!');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!profile) {
    return <div className="pt-20 p-8 flex justify-center"><Loader2 className="animate-spin text-slate-400" size={32} /></div>;
  }

  const initials = profile.avatar_initials || profile.full_name?.charAt(0) || 'I';
  const avatarColor = profile.avatar_color || '#6C35DE';

  return (
    <div className="pt-20 p-8 min-h-screen space-y-8 relative">
      {toast && (
        <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 z-50">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">My Profile</h2>
          <p className="text-secondary font-medium mt-1">Manage your instructor account and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)] text-center space-y-4">
            <div className="relative inline-block">
              <div
                className="w-28 h-28 rounded-full mx-auto flex items-center justify-center text-4xl font-black text-white shadow-lg"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline text-on-surface">{profile.full_name}</h3>
              <p className="text-sm text-secondary">{form.specialization ? `${form.specialization} · ` : ''}{form.department || 'General Department'}</p>
              <div className="mt-3 flex justify-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded-full">Instructor</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-full">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_20px_rgba(25,28,30,0.04),0px_8px_40px_rgba(25,28,30,0.02)]">
            <h3 className="text-lg font-bold text-on-surface mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-slate-100 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 transition-all outline-none"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                <input
                  value={form.email}
                  disabled
                  className="w-full bg-surface-container-low border border-slate-100 rounded-lg px-4 py-3 text-sm font-medium opacity-60 cursor-not-allowed outline-none"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-slate-100 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 transition-all outline-none"
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Date of Birth</label>
                <input
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-slate-100 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 transition-all outline-none"
                  type="date"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-slate-100 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 transition-all outline-none"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Department</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-slate-100 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 transition-all outline-none"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Specialization</label>
                <input
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-slate-100 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 transition-all outline-none"
                  type="text"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Bio / About</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-slate-100 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none outline-none"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
