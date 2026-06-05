import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, Filter, ChevronDown } from '../../icons.jsx'
import { useData } from '../../context/DataContext.jsx'

function AttendanceCell({ pct, label, tone }) {
  return (
    <div className={`tch-att-cell tone-${tone}`}>
      <strong>{pct}%</strong>
      <span>{label}</span>
    </div>
  )
}

function PerformanceCell({ grade, score, total, barTone }) {
  const pct = Math.round((score / total) * 100)
  return (
    <div className="tch-perf-cell">
      <div className="tch-perf-head">
        <span>Grade {grade}</span>
        <span>{score}/{total}</span>
      </div>
      <div className="tch-perf-bar">
        <div className={`tch-perf-fill tone-${barTone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function TeacherStudents() {
  const { teacherStudents, teacherStudentsMeta } = useData()
  const { classOptions } = teacherStudentsMeta
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState(classOptions[0])
  const [classOpen, setClassOpen] = useState(false)
  const classRef = useRef(null)

  useEffect(() => {
    if (!classOpen) return undefined
    const handleClick = (e) => {
      if (classRef.current && !classRef.current.contains(e.target)) setClassOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [classOpen])

  const filtered = useMemo(() => {
    let list = teacherStudents
    if (classFilter !== 'All Classes') {
      list = list.filter((s) => s.classTag === classFilter)
    }
    const q = search.toLowerCase()
    if (q) {
      list = list.filter((s) => (
        s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q)
      ))
    }
    return list
  }, [search, classFilter, teacherStudents])

  return (
    <>
      <div className="page-head">
        <div><h1>Students</h1></div>
      </div>

      <div className="card um-card">
        <div className="um-toolbar">
          <div className="um-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="att-filter-wrap" ref={classRef}>
            <button
              type="button"
              className={`um-select att-filter-btn${classOpen ? ' open' : ''}`}
              onClick={() => setClassOpen((v) => !v)}
            >
              <Filter size={16} /> {classFilter} <ChevronDown size={16} />
            </button>
            {classOpen && (
              <ul className="att-dept-menu fee-month-menu">
                {classOptions.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      className={`att-dept-option${classFilter === c ? ' selected' : ''}`}
                      onClick={() => { setClassFilter(c); setClassOpen(false) }}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="um-table-wrap">
          <table className="um-table tch-students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Attendance %</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="fee-student">
                      <img src={`https://i.pravatar.cc/80?img=${s.avatar}`} alt={s.name} className="um-avatar" />
                      <div>
                        <div className="um-name">{s.name}</div>
                        <div className="um-email">{s.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="tch-class-pill">{s.classTag}</span></td>
                  <td><AttendanceCell pct={s.attendance} label={s.attLabel} tone={s.attTone} /></td>
                  <td><PerformanceCell grade={s.grade} score={s.score} total={s.total} barTone={s.barTone} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
