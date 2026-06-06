import { useState } from 'react'
import StatCards from './StatCards.jsx'
import Charts from './Charts.jsx'
import BottomCards from './BottomCards.jsx'
import { AddStudentModal } from './AddUserModal.jsx'
import NewAnnouncementModal from './NewAnnouncementModal.jsx'
import { Plus, Megaphone } from '../icons.jsx'
import { useData } from '../context/DataContext.jsx'

export default function Dashboard() {
  const { students, staff, dashboardAdmin } = useData()
  const [studentModalOpen, setStudentModalOpen] = useState(false)
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false)

  const attRate = dashboardAdmin.liveMetrics?.studentRate ?? 0

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome Back, Elena — {students.items.length} students, {staff.items.length} staff,
            {' '}{attRate}% attendance today.
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setStudentModalOpen(true)}
          >
            <Plus size={18} /> Add Student
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setAnnouncementModalOpen(true)}
          >
            <Megaphone size={18} /> New Announcement
          </button>
        </div>
      </div>

      <StatCards />
      <Charts />
      <BottomCards />

      <AddStudentModal open={studentModalOpen} onClose={() => setStudentModalOpen(false)} />
      <NewAnnouncementModal
        open={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        showRecentList
      />
    </>
  )
}
