import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./layouts/AdminLayout";
import { LoginPage } from "./pages/LoginPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserManagement } from "./pages/UserManagement";
import { CoursesPage } from "./pages/CoursesPage";

import { BatchesManagement } from "./pages/BatchesManagement";
import { CertificationDesk } from "./pages/CertificationDesk";
import { AdminAnalytics } from "./pages/AdminAnalytics";

import { LibraryManager } from "./pages/LibraryManager";
import { SystemSettings } from "./pages/SystemSettings";
import { AdminProfile } from "./pages/AdminProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="courses" element={<CoursesPage />} />

            <Route path="batches" element={<BatchesManagement />} />
            <Route path="batches/:batchId" element={<BatchesManagement />} />

            <Route path="certifications" element={<CertificationDesk />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="library/manage" element={<LibraryManager />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
