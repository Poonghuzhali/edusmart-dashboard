import { useCallback, useEffect, useState } from 'react'
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
import { usePortalPage } from './hooks/usePortalPage.js'
import {
  ADMIN_PAGES, clearAuth, clearRoute, loadAuth, parseHash,
  readSession, saveAuth, setRoute,
} from './utils/session.js'

function AdminApp({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page, navigate] = usePortalPage('admin', ADMIN_PAGES, 'dashboard')

  const handleLogout = () => {
    setSidebarOpen(false)
    onLogout()
  }

  return (
    <div className="app">
      <Sidebar
        open={sidebarOpen}
        activePage={page}
        onNavigate={(p) => { navigate(p); setSidebarOpen(false) }}
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
  const initial = readSession()
  const [authed, setAuthed] = useState(initial.authed)
  const [role, setRole] = useState(initial.role)

  useEffect(() => {
    if (initial.authed) {
      const route = parseHash()
      if (!route || route.role !== initial.role) {
        setRoute(initial.role, initial.page)
      }
    }
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      const savedRole = loadAuth()
      const route = parseHash()

      if (!savedRole) {
        setAuthed(false)
        setRole('admin')
        return
      }

      if (route) {
        setAuthed(true)
        setRole(route.role)
      }
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const handleSignIn = useCallback((selectedRole) => {
    saveAuth(selectedRole)
    setRole(selectedRole)
    setAuthed(true)
    setRoute(selectedRole, 'dashboard')
  }, [])

  const handleLogout = useCallback(() => {
    clearAuth()
    clearRoute()
    setAuthed(false)
    setRole('admin')
  }, [])

  if (!authed) {
    return <Login onSignIn={handleSignIn} />
  }

  if (role === 'teacher') {
    return <TeacherApp onLogout={handleLogout} />
  }

  return <AdminApp onLogout={handleLogout} />
}
