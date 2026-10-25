import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { StudentLayout } from './layouts/StudentLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { MyCoursesPage } from './pages/MyCoursesPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { ProfilePage } from './pages/ProfilePage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { AssignmentsPage } from './pages/AssignmentsPage'
import { LibraryPage } from './pages/LibraryPage'
import { AssessmentsPage } from './pages/AssessmentsPage'
import { ExamPage } from './pages/ExamPage'
import { AssessmentResultPage } from './pages/AssessmentResultPage'

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">Unauthorized</h1>
        <p className="text-slate-500 mt-2">You must be a student to access this portal.</p>
        <a href="/" className="text-[#6C35DE] hover:underline mt-4 inline-block font-bold">Return to login</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route 
            path="/assessments/:assessmentId" 
            element={
              <ProtectedRoute>
                <ExamPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assessments/:assessmentId/result" 
            element={
              <ProtectedRoute>
                <AssessmentResultPage />
              </ProtectedRoute>
            } 
          />

          <Route element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/courses" element={<MyCoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
