import { useMemo } from 'react'
import { CheckCircle, XCircle, Clock, Calendar } from '../../icons.jsx'
import { useData } from '../../context/DataContext.jsx'
import { loadParentEmail } from '../../utils/session.js'
import { getParentAccountByEmail } from '../../utils/auth.js'
import { linkedStudentsForParent } from '../../utils/userData.js'

const STATUS_META = {
  present: { label: 'Present', icon: CheckCircle, tone: 'present' },
  absent: { label: 'Absent', icon: XCircle, tone: 'absent' },
  late: { label: 'Late', icon: Clock, tone: 'late' },
  excused: { label: 'Excused', icon: Calendar, tone: 'excused' },
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.present
  const Icon = meta.icon
  return (
    <span className={`parent-att-badge parent-att-badge--${meta.tone}`}>
      <Icon size={14} /> {meta.label}
    </span>
  )
}

function SummaryCards({ counts }) {
  const items = [
    { key: 'present', label: 'Present', icon: CheckCircle, tone: 'green' },
    { key: 'absent', label: 'Absent', icon: XCircle, tone: 'red' },
    { key: 'late', label: 'Late', icon: Clock, tone: 'orange' },
    { key: 'excused', label: 'Excused', icon: Calendar, tone: 'blue' },
  ]

  return (
    <div className="att-stats">
      {items.map(({ key, label, icon: Icon, tone }) => (
        <div key={key} className={`att-stat-card att-stat-${tone}`}>
          <div className={`att-stat-icon icon-${tone}`}><Icon size={20} /></div>
          <div>
            <div className="att-stat-value">{counts[key] ?? 0}</div>
            <div className="att-stat-label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ParentAttendance() {
  const {
    parents, students, attendanceAdminStudents, attendanceAdminMeta, teacherStudents,
  } = useData()
  const parentEmail = loadParentEmail()
  const recordDate = attendanceAdminMeta.defaultDate || '14-04-2026'

  const parent = useMemo(
    () => getParentAccountByEmail(parentEmail, parents.items),
    [parentEmail, parents.items],
  )

  const children = useMemo(
    () => linkedStudentsForParent(parent, students.items),
    [parent, students.items],
  )

  const childIds = useMemo(() => new Set(children.map((c) => c.id)), [children])

  const attendanceRows = useMemo(() => {
    const perfById = new Map(teacherStudents.map((s) => [s.id, s]))
    return attendanceAdminStudents
      .filter((row) => childIds.has(row.id))
      .map((row) => ({
        ...row,
        performance: perfById.get(row.id),
      }))
  }, [attendanceAdminStudents, childIds, teacherStudents])

  const counts = useMemo(() => ({
    present: attendanceRows.filter((s) => s.status === 'present').length,
    absent: attendanceRows.filter((s) => s.status === 'absent').length,
    late: attendanceRows.filter((s) => s.status === 'late').length,
    excused: attendanceRows.filter((s) => s.status === 'excused').length,
  }), [attendanceRows])

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Attendance</h1>
          <p>
            Daily attendance for your linked student{children.length !== 1 ? 's' : ''} — {recordDate}
          </p>
        </div>
      </div>

      {attendanceRows.length > 0 && <SummaryCards counts={counts} />}

      <div className="card um-card">
        <div className="card-head">
          <h3>Student Attendance Details</h3>
        </div>
        <div className="um-table-wrap">
          <table className="um-table att-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Class</th>
                <th>Today&apos;s Status</th>
                <th>Attendance %</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="fee-student">
                      <img
                        src={`https://i.pravatar.cc/80?img=${row.performance?.avatar || children.find((c) => c.id === row.id)?.avatar || 1}`}
                        alt={row.name}
                        className="um-avatar"
                      />
                      <div>
                        <div className="um-name">{row.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="um-id">{row.studentId || row.rollNo}</td>
                  <td>{row.className}</td>
                  <td><StatusBadge status={row.status} /></td>
                  <td>
                    {row.performance ? (
                      <span className={`parent-att-pct tone-${row.performance.attTone}`}>
                        {row.performance.attendance}% — {row.performance.attLabel}
                      </span>
                    ) : '—'}
                  </td>
                  <td>{row.remarks || '—'}</td>
                </tr>
              ))}
              {!attendanceRows.length && (
                <tr>
                  <td colSpan={6}>No attendance records found for your linked students.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
