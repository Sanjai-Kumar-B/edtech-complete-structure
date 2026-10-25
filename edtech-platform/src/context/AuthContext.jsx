import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_CREDENTIALS, MOCK_USERS } from "../lib/sharedMockData";

const AuthContext = createContext(null);
const SESSION_KEY = "atelier_student_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem(SESSION_KEY); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const cred = MOCK_CREDENTIALS.find((c) => c.email === email && c.password === password);
    if (!cred) throw new Error("Invalid email or password.");
    const profile = MOCK_USERS.find((u) => u.id === cred.userId);
    if (!profile) throw new Error("User profile not found.");
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    setUser(profile);
    return profile;
  };

  // Self-registration (student portal only)
  const signup = async ({ name, email, password }) => {
    const existing = MOCK_USERS.find((u) => u.email === email);
    if (existing) throw new Error("An account with this email already exists.");
    const newUser = {
      id: `stu-${Date.now()}`,
      email, name,
      role: "student",
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => { localStorage.removeItem(SESSION_KEY); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
