import {
  GradCap, Grid, CalendarCheck, Rupee, Chat, Settings, Logout, Close,
} from '../../icons.jsx'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Grid },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'fees', label: 'Fees', icon: Rupee },
  { id: 'messages', label: 'Messages', icon: Chat },
]

export default function ParentSidebar({
  open, activePage, onNavigate, onClose, onLogout, parent,
}) {
  return (
    <aside className={`sidebar sidebar--parent${open ? ' open' : ''}`}>
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
          <img
            src={`https://i.pravatar.cc/80?img=${parent?.avatar || 11}`}
            alt={parent?.name || 'Parent'}
            className="avatar"
          />
          <div className="profile-meta">
            <strong>{parent?.name || 'Parent'}</strong>
            <span>Parent</span>
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
