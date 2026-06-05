import {
  Search, Filter, ChevronDown, Plus, User, MapPin, GripVertical, Warning,
} from '../icons.jsx'
import { useData } from '../context/DataContext.jsx'

function PeriodCell({ cell }) {
  if (!cell || cell.type === 'empty') {
    return (
      <button type="button" className="tt-period tt-period--empty">
        <Plus size={18} />
        <span>Add Period</span>
      </button>
    )
  }

  return (
    <div className={`tt-period tt-period--${cell.color}${cell.conflict ? ' tt-period--conflict' : ''}`}>
      <button type="button" className="tt-period-menu" aria-label="Options">
        <GripVertical size={14} />
      </button>
      <div className="tt-period-subject">{cell.subject}</div>
      <div className="tt-period-meta">
        <User size={13} /> {cell.teacher}
      </div>
      <div className="tt-period-meta">
        <MapPin size={13} /> {cell.room}
      </div>
      {cell.conflict && (
        <div className="tt-period-warning">
          <Warning size={14} /> Teacher overlap
        </div>
      )}
    </div>
  )
}

export default function TimetablePanel() {
  const { timetable } = useData()
  const days = timetable.days || []
  const dayLabels = timetable.dayLabels || []
  const rows = timetable.rows || []

  return (
    <>
      <div className="card um-card ac-tt-toolbar">
        <div className="um-toolbar">
          <div className="um-search">
            <Search size={18} />
            <input type="text" placeholder="Search by name or ID..." />
          </div>
          <div className="um-filters">
            <button type="button" className="um-select">
              <Filter size={16} /> Grade 3 <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="card tt-grid-wrap">
        <div className="tt-grid-scroll">
          <table className="tt-grid">
            <thead>
              <tr>
                <th className="tt-time-col">Time</th>
                {dayLabels.map((d) => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                if (row.type === 'lunch') {
                  return (
                    <tr key={row.id} className="tt-lunch-row">
                      <td className="tt-time-cell">{row.time}</td>
                      <td colSpan={5}>
                        <div className="tt-lunch-bar">{row.label}</div>
                      </td>
                    </tr>
                  )
                }
                return (
                  <tr key={row.id}>
                    <td className="tt-time-cell">{row.time}</td>
                    {days.map((day) => (
                      <td key={day} className="tt-cell">
                        <PeriodCell cell={row.cells[day]} />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
