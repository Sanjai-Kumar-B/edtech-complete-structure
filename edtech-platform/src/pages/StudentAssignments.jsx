import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyAssignments } from "../lib/mockData";

export function StudentAssignments() {
  const { user } = useAuth();
  const studentId = user?.id || "stu-001";
  
  const [assignments, setAssignments] = useState(() => getMyAssignments(studentId));
  const [activeTab, setActiveTab] = useState("Pending");
  
  const filtered = assignments.filter((a) => {
    if (activeTab === "Pending") return !a.submission || a.submission.status === "pending";
    if (activeTab === "Reviewed") return a.submission && a.submission.status === "reviewed";
    return true; // All
  });

  const [uploadingId, setUploadingId] = useState(null);

  const handleUpload = async (assignmentId, e) => {
    e.preventDefault();
    setUploadingId(assignmentId);
    await new Promise(r => setTimeout(r, 1000));
    setAssignments((prev) => prev.map((a) => {
      if (a.id === assignmentId) {
        return {
          ...a,
          submission: {
            id: `sub-${Date.now()}`,
            assignment_id: assignmentId,
            student_id: studentId,
            status: "pending",
            file_url: "https://storage.atelier.com/submissions/new_sub.zip",
            score: null, feedback: null, submitted_at: new Date().toISOString()
          }
        };
      }
      return a;
    }));
    setUploadingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Assignments</h1>
        <p className="text-secondary font-medium">Submit coursework and review instructor feedback.</p>
      </header>

      <div className="flex gap-6 border-b border-outline-variant/20">
        {["Pending", "Reviewed", "All"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-secondary hover:text-on-surface"}`}>
            {tab} Assignments
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filtered.length === 0 && (
          <div className="py-12 bg-surface-container-lowest rounded-xl border border-outline-variant/10 text-center text-secondary">
             No {activeTab.toLowerCase()} assignments.
          </div>
        )}
        
        {filtered.map((a) => (
          <div key={a.id} className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${a.submission?.status === "reviewed" ? "bg-emerald-100 text-emerald-600" : a.submission?.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-primary/10 text-primary"}`}>
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {a.submission?.status === "reviewed" ? "task_alt" : a.submission?.status === "pending" ? "hourglass_empty" : "assignment"}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm ${a.submission?.status === "reviewed" ? "bg-emerald-50 text-emerald-700" : a.submission?.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-primary/5 text-primary"}`}>
                      {a.submission?.status === "reviewed" ? "Graded" : a.submission?.status === "pending" ? "Submitted" : "To Do"}
                    </span>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">{a.skill_category}</span>
                  </div>
                  <h3 className="text-xl font-headline font-bold text-on-surface">{a.title}</h3>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs uppercase font-bold tracking-widest text-secondary mb-1">Due Date</p>
                <p className="font-semibold text-on-surface">{a.due_date ? new Date(a.due_date).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "TBD"}</p>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed max-w-3xl mb-8">{a.description}</p>

            <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/5">
              {!a.submission ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined">upload_file</span>
                    <span>Submit your project as a .zip or .pdf file.</span>
                  </div>
                  <button onClick={(e) => handleUpload(a.id, e)} disabled={uploadingId === a.id}
                    className="w-full md:w-auto px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {uploadingId === a.id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-sm">cloud_upload</span>}
                    {uploadingId === a.id ? "Uploading…" : "Upload Submission"}
                  </button>
                </div>
              ) : a.submission.status === "pending" ? (
                <div className="flex items-center gap-3 text-sm text-secondary font-medium">
                  <span className="material-symbols-outlined text-amber-500">pending</span>
                  Your submission is under review by the instructor.
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-on-surface uppercase tracking-widest">Instructor Feedback</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-primary">{a.submission.score}</span>
                      <span className="text-xs text-secondary font-bold uppercase">/ {a.max_score} Pts</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-outline-variant/10 shadow-sm">
                    <p className="text-sm text-on-surface leading-relaxed text-italic">"{a.submission.feedback}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
