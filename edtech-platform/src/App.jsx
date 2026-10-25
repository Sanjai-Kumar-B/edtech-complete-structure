import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { StudentLayout } from "./layouts/StudentLayout";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { CertificateVerify } from "./pages/CertificateVerify";

import { StudentDashboard } from "./pages/StudentDashboard";
import { CourseDetail } from "./pages/CourseDetail";
import { StudentAssignments } from "./pages/StudentAssignments";
import { AIRoadmap } from "./pages/AIRoadmap";
import { SkillAnalytics } from "./pages/SkillAnalytics";
import { MyCourses } from "./pages/MyCourses";
import { LearningMaterials } from "./pages/LearningMaterials";
import { Leaderboard } from "./pages/Leaderboard";
import { CareerTrack } from "./pages/CareerTrack";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/verify/:code" element={<CertificateVerify />} />
          <Route path="/verify" element={<CertificateVerify />} />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
          
          {/* Protected Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="course/:id" element={<CourseDetail />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="materials" element={<LearningMaterials />} />
            <Route path="innovation" element={<AIRoadmap />} />
            <Route path="analytics" element={<SkillAnalytics />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="career" element={<CareerTrack />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
