import {
  GradCap, Grid, UsersNav, BookNav, Calendar, RupeeNav, Chat,
  BarChart, Folder, Settings, Approvals, Logout, Close,
} from '../icons.jsx'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Grid },
  { id: 'user-management', label: 'User Management', icon: UsersNav },
  { id: 'academic', label: 'Academic', icon: BookNav },
  { id: 'attendance', label: 'Attendance', icon: Calendar },
  { id: 'fees', label: 'Fees', icon: RupeeNav },
  { id: 'communication', label: 'Communication', icon: Chat },
  { id: 'reports', label: 'Reports', icon: BarChart },
  { id: 'documents', label: 'Documents', icon: Folder },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'approvals', label: 'Approvals', icon: Approvals },
]

export default function Sidebar({ open, activePage, onNavigate, onClose, onLogout }) {
  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
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
              if (['dashboard', 'user-management', 'academic', 'attendance', 'fees', 'communication', 'reports', 'documents', 'settings', 'approvals'].includes(id)) onNavigate?.(id)
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
          <img
            src="https://i.pravatar.cc/80?img=47"
            alt="Sarah Johnson"
            className="avatar"
          />
          <div className="profile-meta">
            <strong>Sarah Johnson</strong>
            <span>Teacher</span>
          </div>
        </div>
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
