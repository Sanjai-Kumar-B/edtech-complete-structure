import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      await signup(form);
      navigate("/student/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-wrap" className="show">
      <div id="login-card">
        {/* Left Side: Brand & Circular Text */}
        <div className="lc-brand">
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Rotating Circular Text SVG */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_20s_linear_infinite]">
                <defs>
                  <path
                    id="circlePath"
                    d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                  />
                </defs>
                <text className="text-[7.5px] font-black fill-white uppercase tracking-[0.15em]">
                  <textPath xlinkHref="#circlePath">
                    CREATE WHAT YOU USE • CREATE WHAT YOU USE • CREATE WHAT YOU USE •
                  </textPath>
                </text>
              </svg>
              
              {/* Logo in the center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/logo.png" className="w-20 h-20 drop-shadow-2xl" alt="Junospace Logo" />
              </div>
            </div>
            
            <h1 className="text-white text-5xl font-black mt-8 tracking-tighter">Junospace</h1>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="lc-form">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-black text-slate-800 mb-2">Join Junospace</h2>
            <p className="text-slate-500 font-medium mb-10">Become a Voyager of the Future.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="l-igroup">
                <span className="material-symbols-outlined l-icon">person</span>
                <input
                  type="text"
                  className="l-input"
                  placeholder="Full Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="l-igroup">
                <span className="material-symbols-outlined l-icon">mail</span>
                <input
                  type="email"
                  className="l-input"
                  placeholder="Email Address"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="l-igroup">
                <span className="material-symbols-outlined l-icon">lock</span>
                <input
                  type="password"
                  className="l-input"
                  placeholder="Password (Min. 6 characters)"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}

              <button type="submit" className="l-btn" disabled={loading}>
                {loading ? "Creating Account..." : <>Create Account <span className="material-symbols-outlined">person_add</span></>}
              </button>
            </form>

            <p className="text-center text-slate-400 text-xs font-medium mt-12">
              Already a Voyager? <Link to="/login" className="text-violet-600 font-bold hover:underline">Sign in.</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

