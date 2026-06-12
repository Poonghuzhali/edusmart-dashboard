import { useMemo, useState } from 'react'
import ParentSidebar from './ParentSidebar.jsx'
import Topbar from '../Topbar.jsx'
import ParentDashboard from './ParentDashboard.jsx'
import ParentAttendance from './ParentAttendance.jsx'
import ParentFees from './ParentFees.jsx'
import ParentMessages from './ParentMessages.jsx'
import ParentSettings from './ParentSettings.jsx'
import { usePortalPage } from '../../hooks/usePortalPage.js'
import { PARENT_PAGES, loadParentEmail } from '../../utils/session.js'
import { getParentAccountByEmail } from '../../utils/auth.js'
import { useData } from '../../context/DataContext.jsx'

export default function ParentApp({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page, navigate] = usePortalPage('parent', PARENT_PAGES, 'dashboard')
  const { parents } = useData()
  const parentEmail = loadParentEmail()

  const parent = useMemo(
    () => getParentAccountByEmail(parentEmail, parents.items),
    [parentEmail, parents.items],
  )

  const handleLogout = () => {
    setSidebarOpen(false)
    onLogout()
  }

  return (
    <div className="app app--parent">
      <ParentSidebar
        open={sidebarOpen}
        activePage={page}
        onNavigate={(p) => { navigate(p); setSidebarOpen(false) }}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        parent={parent}
      />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="main">
        <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="content">
          {page === 'dashboard' && <ParentDashboard />}
          {page === 'attendance' && <ParentAttendance />}
          {page === 'fees' && <ParentFees />}
          {page === 'messages' && <ParentMessages />}
          {page === 'settings' && <ParentSettings onLogout={handleLogout} />}
        </main>
      </div>
    </div>
  )
}
