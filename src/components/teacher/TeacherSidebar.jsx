import {
  GradCap, Grid, UsersGroup, User, CalendarCheck, FileText,
  ClipboardList, Chat, Settings, Logout, Close,
} from '../../icons.jsx'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Grid },
  { id: 'my-classes', label: 'My Classes', icon: UsersGroup },
  { id: 'students', label: 'Students', icon: User },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'assignment', label: 'Assignment', icon: FileText },
  { id: 'exams', label: 'Exams & Marks', icon: ClipboardList },
  { id: 'messages', label: 'Messages', icon: Chat },
]

export default function TeacherSidebar({ open, activePage, onNavigate, onClose, onLogout }) {
  return (
    <aside className={`sidebar sidebar--teacher${open ? ' open' : ''}`}>
      <div className="brand">
        <div className="brand-logo"><GradCap size={22} /></div>
        <span className="brand-name">Edu<span>Smart</span></span>
        <button className="sidebar-close" aria-label="Close menu" onClick={onClose}>
          <Close size={22} />
        </button>
      </div>

      <nav className="nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href="#"
            className={`nav-item${activePage === id ? ' active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              onNavigate?.(id)
              onClose?.()
            }}
          >
            <Icon size={20} />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="profile">
          <img src="https://i.pravatar.cc/80?img=47" alt="Sarah Johnson" className="avatar" />
          <div className="profile-meta">
            <strong>Sarah Johnson</strong>
            <span>Teacher</span>
          </div>
        </div>
        <a
          href="#"
          className={`nav-item settings-link${activePage === 'settings' ? ' active' : ''}`}
          onClick={(e) => { e.preventDefault(); onNavigate?.('settings'); onClose?.() }}
        >
          <Settings size={20} />
          <span>Settings</span>
        </a>
        <a
          href="#"
          className="logout"
          onClick={(e) => { e.preventDefault(); onLogout?.() }}
        >
          <Logout size={20} />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  )
}
