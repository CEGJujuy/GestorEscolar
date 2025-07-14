import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import LoginForm from './components/Auth/LoginForm'
import Dashboard from './components/Dashboard/Dashboard'
import StudentList from './components/Students/StudentList'
import GradesList from './components/Grades/GradesList'
import AttendanceList from './components/Attendance/AttendanceList'
import NotificationsList from './components/Notifications/NotificationsList'
import CalendarView from './components/Calendar/CalendarView'
import MaterialsList from './components/Materials/MaterialsList'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const AppRoutes: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<StudentList />} />
        <Route path="courses" element={<div>Cursos - En desarrollo</div>} />
        <Route path="grades" element={<GradesList />} />
        <Route path="attendance" element={<AttendanceList />} />
        <Route path="notifications" element={<NotificationsList />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="materials" element={<MaterialsList />} />
        <Route path="settings" element={<div>Configuración - En desarrollo</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App