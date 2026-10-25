import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Theme state matches HTML
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("junospace-theme") === "dark"
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark-mode");
      document.documentElement.classList.add("dark"); // For Tailwind
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    localStorage.setItem("junospace-theme", nextTheme);
    setIsDark(!isDark);
    // showToast implementation could go here
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleNav = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname.includes(path);

  const getPageTitle = () => {
    if (location.pathname.includes('dashboard')) return 'Student Dashboard';
    if (location.pathname.includes('courses')) return 'My Courses';
    if (location.pathname.includes('leaderboard')) return 'Innovation Board';
    if (location.pathname.includes('analytics')) return 'Performance Analytics';
    if (location.pathname.includes('profile')) return 'Student Profile';
    if (location.pathname.includes('innovation')) return 'Learning Roadmap';
    return 'Junospace';
  };

  return (
    <div id="portal" className="show">
      {/* Mobile Header (Mobile Only) */}
      <header id="mobile-header">
        <button onClick={goBack} className="ms" style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer", fontSize: "24px" }}>
          arrow_back_ios
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "auto", marginLeft: "10px" }}>
          <img src="/logo.png" style={{ width: "30px", height: "30px", objectFit: "contain" }} alt="Logo" />
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#8b5cf6" }}>
            Junospace
          </h2>
        </div>
        <button onClick={toggleTheme} className="ms" style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>
          contrast
        </button>
      </header>

      {/* ── SIDEBAR ── */}
      <aside id="sidebar">
        <div className="sb-logo">
          <img src="/logo.png" className="sb-logo-icon" alt="Junospace Logo" />
          <div>
            <div className="sb-logo-text">Junospace</div>
            <div className="sb-logo-sub">COMMAND CENTER</div>
          </div>
        </div>

        <nav className="sb-nav">
          <button className={`nav-btn ${isActive('dashboard') ? 'active' : ''}`} onClick={() => handleNav('/student/dashboard')}>
            <span className="ms">dashboard</span> Dashboard
          </button>
          <button className={`nav-btn ${isActive('courses') ? 'active' : ''}`} onClick={() => handleNav('/student/courses')}>
            <span className="ms">school</span> My Courses
          </button>
          <button className={`nav-btn ${isActive('leaderboard') ? 'active' : ''}`} onClick={() => handleNav('/student/leaderboard')}>
            <span className="ms">lightbulb</span> Innovation Board
          </button>
          <button className={`nav-btn ${isActive('analytics') ? 'active' : ''}`} onClick={() => handleNav('/student/analytics')}>
            <span className="ms">analytics</span> Analytics
          </button>
          <button className={`nav-btn ${isActive('profile') ? 'active' : ''}`} onClick={() => handleNav('/student/profile')}>
            <span className="ms">person</span> Profile
          </button>
        </nav>

        <div className="sb-bottom">
          <div className="sb-user">
            <img
              className="sb-avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMUNOA_JYlU8tYWUwCNwgdbyzaOAEgHoKPqYmSXxZMzgqg6cWHnlw0wKdwhazuPwmXrRJa3zuoih2PTSZZzn0-OatenB93wAUtji6K_h-FwrblfRo5dgoWdQTmy4YH7YLmYpaQFNvsh7f0WWq4ixLJXl__qRzH-TqAQIALni0r0WiEynF-n2iXJK9EXhCIXFPaTh5KYZJCxrVRi0F9IEvdcq38Si_CrEfg6tie98tOx5gzUpu7-8nehZRXlq4DOu7fFzKbs3KmP8"
              alt="User"
            />
            <div>
              <div className="sb-name">{user?.name || "Alex Chen"}</div>
              <div className="sb-role">Level 42 Architect</div>
            </div>
            <button className="sb-logout" onClick={logout} title="Sign Out">
              <span className="ms" style={{ fontSize: "18px" }}>logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div id="portal-main">
        {/* Desktop Global Header */}
        <header id="portal-header">
          <button className="back-btn" onClick={goBack} title="Go Back">
            <span className="ms">arrow_back_ios</span> Back
          </button>
          <div className="header-title" id="page-title">{getPageTitle()}</div>

          <div className="header-actions">
            <span className="ms action-icon">notifications</span>
            <div className="action-sep"></div>
            <img
              src="/theme-bg.png"
              alt="Profile"
              style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", cursor: "pointer", border: "2px solid #70ACE0" }}
              onClick={() => handleNav('/student/profile')}
            />
          </div>
        </header>

        <div id="content-area">
          <Outlet />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav id="mobile-nav">
        <button className={`mn-btn ${isActive('dashboard') ? 'active' : ''}`} onClick={() => handleNav('/student/dashboard')}>
          <span className="ms">dashboard</span>
          <span>Home</span>
        </button>
        <button className={`mn-btn ${isActive('courses') ? 'active' : ''}`} onClick={() => handleNav('/student/courses')}>
          <span className="ms">school</span>
          <span>Courses</span>
        </button>
        <button className={`mn-btn ${isActive('leaderboard') ? 'active' : ''}`} onClick={() => handleNav('/student/leaderboard')}>
          <span className="ms">lightbulb</span>
          <span>Board</span>
        </button>
        <button className={`mn-btn ${isActive('analytics') ? 'active' : ''}`} onClick={() => handleNav('/student/analytics')}>
          <span className="ms">analytics</span>
          <span>Stats</span>
        </button>
        <button className={`mn-btn ${isActive('profile') ? 'active' : ''}`} onClick={() => handleNav('/student/profile')}>
          <span className="ms">person</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
