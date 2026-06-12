import { useData } from '../../context/DataContext.jsx'
import { loadParentEmail } from '../../utils/session.js'
import { getParentAccountByEmail } from '../../utils/auth.js'
import { useMemo } from 'react'

export default function ParentMessages() {
  const { parents, announcements } = useData()
  const parentEmail = loadParentEmail()

  const parent = useMemo(
    () => getParentAccountByEmail(parentEmail, parents.items),
    [parentEmail, parents.items],
  )

  const messages = announcements.items.filter(
    (a) => !a.audience || a.audience === 'Everyone' || a.audience === 'Parents',
  )

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Messages</h1>
          <p>Announcements and updates for {parent?.name || 'parents'}</p>
        </div>
      </div>

      <div className="card um-card">
        <div className="um-table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.date}</td>
                  <td>{item.author}</td>
                </tr>
              ))}
              {!messages.length && (
                <tr><td colSpan={3}>No messages yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
