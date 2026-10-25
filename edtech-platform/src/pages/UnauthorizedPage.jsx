import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function UnauthorizedPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] via-[#F0F9FF] to-[#FAF5FF] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-error text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface mb-3">Access Denied</h1>
        <p className="text-secondary text-sm leading-relaxed mb-8">
          This portal is for students only. Please sign in with a student account.
        </p>
        <button onClick={() => { logout(); navigate("/login", { replace: true }); }}
          className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md">
          Sign Out & Re-log
        </button>
      </div>
    </div>
  );
}
