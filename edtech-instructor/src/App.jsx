import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { InstructorLayout } from "./layouts/InstructorLayout";
import { LoginPage } from "./pages/LoginPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { InstructorDashboard } from "./pages/InstructorDashboard";
import { BatchDetail } from "./pages/BatchDetail";
import { InstructorAssignments } from "./pages/InstructorAssignments";
import { GlobalAttendance } from "./pages/GlobalAttendance";
import { StudentsGlobalList } from "./pages/StudentsGlobalList";
import { StudentProfileNotes } from "./pages/StudentProfileNotes";
import { AssessmentCreator } from "./pages/AssessmentCreator";
import { AssessmentResults } from "./pages/AssessmentResults";
import { InstructorLibraryPage } from "./pages/InstructorLibraryPage";
import { InstructorAnalytics } from "./pages/InstructorAnalytics";
import { InstructorProfile } from "./pages/InstructorProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/" element={<Navigate to="/instructor/dashboard" replace />} />

        {/* Protected Instructor Routes */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute requiredRole="instructor">
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="batches" element={<BatchDetail />} />
          <Route path="batches/:batchId" element={<BatchDetail />} />
          <Route path="assignments" element={<InstructorAssignments />} />
          <Route path="attendance" element={<GlobalAttendance />} />
          <Route path="students" element={<StudentsGlobalList />} />
          <Route path="students/:studentId" element={<StudentProfileNotes />} />
          <Route path="assessments/create" element={<AssessmentCreator />} />
          <Route path="assessments/:id/results" element={<AssessmentResults />} />
          <Route path="library" element={<InstructorLibraryPage />} />
          <Route path="analytics" element={<InstructorAnalytics />} />
          <Route path="profile" element={<InstructorProfile />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/instructor/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
