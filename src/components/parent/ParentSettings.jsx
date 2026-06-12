import { loadParentEmail } from '../../utils/session.js'
import { getParentAccountByEmail } from '../../utils/auth.js'
import { useMemo } from 'react'
import { useData } from '../../context/DataContext.jsx'

export default function ParentSettings({ onLogout }) {
  const { parents } = useData()
  const parentEmail = loadParentEmail()

  const parent = useMemo(
    () => getParentAccountByEmail(parentEmail, parents.items),
    [parentEmail, parents.items],
  )

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Your parent account details</p>
        </div>
      </div>

      <div className="card um-card">
        <div className="settings-profile">
          <img
            src={`https://i.pravatar.cc/80?img=${parent?.avatar || 11}`}
            alt={parent?.name || 'Parent'}
            className="um-avatar"
          />
          <div>
            <h3>{parent?.name || '—'}</h3>
            <p>{parent?.email || parentEmail || '—'}</p>
            <p>{parent?.contact || '—'}</p>
          </div>
        </div>
        {parent?.linkedStudents?.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <strong>Linked students:</strong>
            <ul>
              {parent.linkedStudents.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        )}
        <button type="button" className="btn btn-primary" style={{ marginTop: 24 }} onClick={onLogout}>
          Log out
        </button>
      </div>
    </>
  )
}
