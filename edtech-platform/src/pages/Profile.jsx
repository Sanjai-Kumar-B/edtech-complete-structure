import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCertificatesForStudent } from "../lib/mockData";

export function Profile() {
  const { user } = useAuth();
  const studentId = user?.id || "stu-001";
  
  const [activeTab, setActiveTab] = useState("Certificates");
  const certificates = getCertificatesForStudent(studentId);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header>
        <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Student Profile</h1>
        <p className="text-secondary font-medium">Manage your personal information and verified credentials.</p>
      </header>

      {/* Main Profile Card */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-lg ring-1 ring-black/5 shrink-0 bg-primary-container text-primary flex items-center justify-center">
          {user?.avatar_url ? (
             <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
             <span className="text-5xl font-bold">{user?.name?.charAt(0)}</span>
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-1">{user?.name}</h2>
          <p className="text-secondary">{user?.email}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase tracking-widest">Active Student</span>
            <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-bold rounded-md uppercase tracking-widest truncate max-w-xs">{studentId}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-outline-variant/20">
        <nav className="flex gap-8">
          {["Certificates", "Settings", "Account Details"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-secondary hover:text-on-surface"}`}>
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-2">
        {activeTab === "Certificates" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold text-on-surface">Verified Credentials ({certificates.length})</h3>
              <Link to="/verify" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified</span> Verify a Code
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.length === 0 && (
                <div className="col-span-full py-16 text-center bg-surface-container-low rounded-2xl border border-outline-variant/10">
                  <span className="material-symbols-outlined text-5xl text-secondary mb-3 opacity-50">workspace_premium</span>
                  <p className="text-sm font-bold text-on-surface">No certificates yet.</p>
                  <p className="text-sm text-secondary mt-1">Complete your courses to earn verified credentials.</p>
                </div>
              )}
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-9xl">workspace_premium</span>
                  </div>
                  <div>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                         <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      </div>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest whitespace-nowrap bg-surface-container-low px-2 py-1 rounded">
                        {new Date(cert.issued_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <h4 className="text-lg font-headline font-bold text-on-surface mb-1 relative z-10 pr-6">{cert.course?.title}</h4>
                    <p className="text-sm text-secondary mb-6 relative z-10">Batch: {cert.batch?.name}</p>
                    <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10 mb-6 flex flex-col relative z-10">
                      <span className="text-[10px] uppercase font-bold text-secondary mb-1 tracking-widest">Verification Code</span>
                      <code className="text-sm font-mono font-bold text-on-surface">{cert.verify_code}</code>
                    </div>
                  </div>
                  <div className="flex gap-3 relative z-10">
                    <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" 
                       className="flex-1 py-2.5 bg-primary/10 text-primary font-bold text-sm rounded-xl text-center hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-sm">download</span> PDF
                    </a>
                    <Link to={`/verify/${cert.verify_code}`}
                       className="flex-1 py-2.5 bg-surface text-on-surface border border-outline-variant/30 font-bold text-sm rounded-xl text-center hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                      Verify Page
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="space-y-8 max-w-2xl">
            <h3 className="text-xl font-headline font-bold text-on-surface mb-4">Account Settings</h3>
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Password</label>
                 <button className="px-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm font-bold text-on-surface hover:bg-surface-container-high transition-colors">Change Password</button>
               </div>
               <div>
                 <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2 mt-6">Notifications</label>
                 <div className="flex items-center gap-3">
                   <input type="checkbox" id="email-notif" className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary" defaultChecked />
                   <label htmlFor="email-notif" className="text-sm text-on-surface font-medium">Email me when assignments are graded</label>
                 </div>
               </div>
            </div>
          </div>
        )}
        
        {activeTab === "Account Details" && (
          <div className="space-y-8 max-w-2xl">
             <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
               <h4 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">Personal Information</h4>
               <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                 <div>
                   <p className="text-xs text-secondary mb-1">Full Name</p>
                   <p className="text-sm font-bold">{user?.name}</p>
                 </div>
                 <div>
                   <p className="text-xs text-secondary mb-1">Email Address</p>
                   <p className="text-sm font-bold">{user?.email}</p>
                 </div>
                 <div>
                   <p className="text-xs text-secondary mb-1">Join Date</p>
                   <p className="text-sm font-bold">{user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN") : "N/A"}</p>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
