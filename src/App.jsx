import { useState } from 'react'
import Login from './components/Login.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Dashboard from './components/Dashboard.jsx'
import UserManagement from './components/UserManagement.jsx'
import AcademicManagement from './components/AcademicManagement.jsx'
import Attendance from './components/Attendance.jsx'
import FeeManagement from './components/FeeManagement.jsx'
import Communication from './components/Communication.jsx'
import ReportsAnalysis from './components/ReportsAnalysis.jsx'
import Documents from './components/Documents.jsx'
import SettingsPage from './components/SettingsPage.jsx'
import Approvals from './components/Approvals.jsx'
import TeacherApp from './components/teacher/TeacherApp.jsx'

function AdminApp({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page, setPage] = useState('dashboard')

  const handleLogout = () => {
    setSidebarOpen(false)
    onLogout()
  }

  return (
    <div className="app">
      <Sidebar
        open={sidebarOpen}
        activePage={page}
        onNavigate={(p) => { setPage(p); setSidebarOpen(false) }}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="main">
        <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="content">
          {page === 'dashboard' && <Dashboard />}
          {page === 'user-management' && <UserManagement />}
          {page === 'academic' && <AcademicManagement />}
          {page === 'attendance' && <Attendance />}
          {page === 'fees' && <FeeManagement />}
          {page === 'communication' && <Communication />}
          {page === 'reports' && <ReportsAnalysis />}
          {page === 'documents' && <Documents />}
          {page === 'settings' && <SettingsPage />}
          {page === 'approvals' && <Approvals />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [role, setRole] = useState('admin')

  const handleSignIn = (selectedRole) => {
    setRole(selectedRole)
    setAuthed(true)
  }

  const handleLogout = () => {
    setAuthed(false)
    setRole('admin')
  }

  if (!authed) {
    return <Login onSignIn={handleSignIn} />
  }

  if (role === 'teacher') {
    return <TeacherApp onLogout={handleLogout} />
  }

  return <AdminApp onLogout={handleLogout} />
}
