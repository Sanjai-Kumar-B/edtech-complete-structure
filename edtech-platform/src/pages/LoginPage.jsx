import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await login(email, password);
      // Logic for role detection is already in AuthContext
      if (session.user) {
        // AuthContext usually handles the navigation or role check
        // but we'll follow the pattern from previous code
        navigate("/student/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
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

        {/* Right Side: Login Form */}
        <div className="lc-form">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-black text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium mb-10">Enter your credentials to access your dashboard.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="l-igroup">
                <span className="material-symbols-outlined l-icon">person</span>
                <input
                  type="email"
                  className="l-input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="l-igroup">
                <div className="flex justify-between items-center mb-1 absolute right-0 -top-8">
                  <a href="#" className="text-xs font-bold text-violet-600 hover:underline">Forgot?</a>
                </div>
                <span className="material-symbols-outlined l-icon">lock</span>
                <input
                  type="password"
                  className="l-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}

              <button type="submit" className="l-btn" disabled={loading}>
                {loading ? "Signing in..." : <>Sign In to Portal <span className="material-symbols-outlined">arrow_forward</span></>}
              </button>
            </form>

            <p className="text-center text-slate-400 text-xs font-medium mt-12">
              Having trouble? <a href="#" className="text-violet-600 font-bold hover:underline">Contact your administrator.</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

