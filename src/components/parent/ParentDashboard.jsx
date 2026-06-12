import { useMemo } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { loadParentEmail } from '../../utils/session.js'
import { getParentAccountByEmail } from '../../utils/auth.js'
import { linkedStudentsForParent } from '../../utils/userData.js'

export default function ParentDashboard() {
  const { parents, students, announcements } = useData()
  const parentEmail = loadParentEmail()

  const parent = useMemo(
    () => getParentAccountByEmail(parentEmail, parents.items),
    [parentEmail, parents.items],
  )

  const children = useMemo(
    () => linkedStudentsForParent(parent, students.items),
    [parent, students.items],
  )

  const recentAnnouncements = announcements.items.slice(0, 3)

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Welcome, {parent?.name?.split(' ')[0] || 'Parent'}!</h1>
          <p>Overview of your linked student{children.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <section className="stat-grid">
        <div className="stat-card accent-purple">
          <div className="stat-top">
            <div className="stat-icon icon-purple">👨‍👩‍👧</div>
          </div>
          <div className="stat-value">{children.length}</div>
          <div className="stat-title">Linked Students</div>
        </div>
        <div className="stat-card accent-green">
          <div className="stat-top">
            <div className="stat-icon icon-green">✓</div>
          </div>
          <div className="stat-value">{children.filter((c) => c.status === 'Active').length}</div>
          <div className="stat-title">Active Enrollments</div>
        </div>
        <div className="stat-card accent-orange">
          <div className="stat-top">
            <div className="stat-icon icon-orange">📢</div>
          </div>
          <div className="stat-value">{recentAnnouncements.length}</div>
          <div className="stat-title">Recent Updates</div>
        </div>
      </section>

      <div className="card um-card">
        <div className="card-head">
          <h3>My Children</h3>
        </div>
        <div className="um-table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Class</th>
                <th>Status</th>
                <th>Relationship</th>
              </tr>
            </thead>
            <tbody>
              {children.map((child) => (
                <tr key={child.id}>
                  <td>
                    <div className="fee-student">
                      <img
                        src={`https://i.pravatar.cc/80?img=${child.avatar}`}
                        alt={child.name}
                        className="um-avatar"
                      />
                      <div>
                        <div className="um-name">{child.name}</div>
                        <div className="um-email">{child.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="um-id">{child.studentId}</td>
                  <td>{child.grade}</td>
                  <td>
                    <span className={`um-status um-status--${child.status === 'Active' ? 'active' : 'inactive'}`}>
                      {child.status}
                    </span>
                  </td>
                  <td>{child.relation || '—'}</td>
                </tr>
              ))}
              {!children.length && (
                <tr>
                  <td colSpan={5}>No linked students found for this account.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {recentAnnouncements.length > 0 && (
        <div className="card um-card" style={{ marginTop: 20 }}>
          <div className="card-head">
            <h3>School Announcements</h3>
          </div>
          <ul className="parent-announce-list">
            {recentAnnouncements.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <span>{item.date || item.author}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
