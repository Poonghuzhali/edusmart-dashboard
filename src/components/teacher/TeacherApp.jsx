import { useState } from 'react'
import TeacherSidebar from './TeacherSidebar.jsx'
import Topbar from '../Topbar.jsx'
import AIFab from './AIFab.jsx'
import AIAssistantModal from './AIAssistantModal.jsx'
import TeacherDashboard from './TeacherDashboard.jsx'
import TeacherClasses from './TeacherClasses.jsx'
import TeacherStudents from './TeacherStudents.jsx'
import TeacherAttendance from './TeacherAttendance.jsx'
import TeacherAssignments from './TeacherAssignments.jsx'
import TeacherExams from './TeacherExams.jsx'
import TeacherMessages from './TeacherMessages.jsx'
import TeacherSettings from './TeacherSettings.jsx'
import { usePortalPage } from '../../hooks/usePortalPage.js'
import { TEACHER_PAGES } from '../../utils/session.js'

export default function TeacherApp({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page, navigate] = usePortalPage('teacher', TEACHER_PAGES, 'dashboard')
  const [aiOpen, setAiOpen] = useState(false)

  const handleLogout = () => {
    setSidebarOpen(false)
    onLogout()
  }

  return (
    <div className="app app--teacher">
      <TeacherSidebar
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
          {page === 'dashboard' && <TeacherDashboard />}
          {page === 'my-classes' && <TeacherClasses onNavigate={navigate} />}
          {page === 'students' && <TeacherStudents />}
          {page === 'attendance' && <TeacherAttendance />}
          {page === 'assignment' && <TeacherAssignments />}
          {page === 'exams' && <TeacherExams />}
          {page === 'messages' && <TeacherMessages />}
          {page === 'settings' && <TeacherSettings onLogout={handleLogout} />}
        </main>
      </div>

      <AIFab onClick={() => setAiOpen(true)} />
      <AIAssistantModal open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}
