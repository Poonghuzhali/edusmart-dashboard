import { Search, Bell, Menu } from '../icons.jsx'

export default function Topbar({ onToggleSidebar }) {
  return (
    <header className="topbar">
      <button
        className="icon-btn menu-btn"
        aria-label="Toggle menu"
        onClick={onToggleSidebar}
      >
        <Menu size={22} />
      </button>
      <div className="search-box">
        <Search size={18} />
        <input type="text" placeholder="Search....../" />
      </div>

      <div className="topbar-right">
        <button className="icon-btn bell-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="bell-dot" />
        </button>
        <div className="profile topbar-profile">
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
      </div>
    </header>
  )
}
