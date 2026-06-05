import { useState, useMemo } from 'react'
import { Book, Filter, ChevronDown } from '../../icons.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { validateNumber, runValidation } from '../../utils/validation.js'

const MARK_FIELDS = ['math', 'algebra', 'stats']

function getGrade(total) {
  const pct = (total / 300) * 100
  if (pct >= 90) return { grade: 'A+', tone: 'green' }
  if (pct >= 80) return { grade: 'A', tone: 'blue' }
  if (pct >= 70) return { grade: 'B+', tone: 'orange' }
  if (pct >= 60) return { grade: 'C+', tone: 'red' }
  return { grade: 'C', tone: 'red' }
}

export default function TeacherExams() {
  const { teacherMarks, setTeacherMarks, teacherExamsMeta } = useData()
  const { units, activeUnit: defaultUnit, subjects, classLabel } = teacherExamsMeta
  const { showToast } = useToast()
  const [activeUnit, setActiveUnit] = useState(defaultUnit)
  const [markErrors, setMarkErrors] = useState({})

  const stats = useMemo(() => {
    const totals = teacherMarks.map((m) => m.math + m.algebra + m.stats)
    const avg = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length)
    const highest = Math.max(...totals)
    const pass = teacherMarks.filter((m) => (m.math + m.algebra + m.stats) / 300 >= 0.6).length
    const passRate = Math.round((pass / teacherMarks.length) * 100)
    return { avg, highest, passRate }
  }, [teacherMarks])

  const updateMark = (id, field, value) => {
    const err = validateNumber(value, subjects[MARK_FIELDS.indexOf(field)] || field, 0, 100)
    setMarkErrors((prev) => {
      const key = `${id}-${field}`
      const next = { ...prev }
      if (err) next[key] = err
      else delete next[key]
      return next
    })
    if (err) return

    const num = Number(value)
    setTeacherMarks((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: num } : m)))
  }

  const handlePublish = () => {
    const fields = {}
    teacherMarks.forEach((m) => {
      MARK_FIELDS.forEach((field, idx) => {
        const key = `${m.id}-${field}`
        fields[key] = [() => validateNumber(m[field], subjects[idx], 0, 100)]
      })
    })
    const { valid, errors } = runValidation(fields)
    setMarkErrors(errors)
    if (!valid) {
      showToast('Please fix invalid marks before publishing', 'error')
      return
    }
    showToast('Marks published successfully')
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Exam Marks</h1>
          <p>Enter marks and track student performance</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-primary" onClick={handlePublish}>
            <Book size={18} /> Publish Marks
          </button>
        </div>
      </div>

      <div className="tch-exam-stats">
        <div className="tch-exam-stat">
          <div className="tch-exam-stat-icon"><Book size={18} /></div>
          <div>
            <strong>{stats.avg}/300</strong>
            <span>Average score Across all subjects</span>
          </div>
        </div>
        <div className="tch-exam-stat">
          <div className="tch-exam-stat-icon"><Book size={18} /></div>
          <div>
            <strong>{stats.highest}/300</strong>
            <span>Highest score Top performer</span>
          </div>
        </div>
        <div className="tch-exam-stat">
          <div className="tch-exam-stat-icon"><Book size={18} /></div>
          <div>
            <strong>{stats.passRate}%</strong>
            <span>Pass Rate 60% threshold</span>
          </div>
        </div>
      </div>

      <div className="tch-unit-tabs">
        {units.map((u) => (
          <button
            key={u.id}
            type="button"
            className={`tch-unit-tab${activeUnit === u.id ? ' active' : ''}`}
            onClick={() => setActiveUnit(u.id)}
          >
            {u.label}
          </button>
        ))}
      </div>

      <div className="card um-card">
        <div className="tch-marks-head">
          <div>
            <h2>Marks Entry {classLabel}</h2>
            <p>Enter Score for Each subject out of 100</p>
          </div>
          <button type="button" className="um-select">
            <Filter size={16} /> {classLabel} <ChevronDown size={16} />
          </button>
        </div>

        <div className="um-table-wrap">
          <table className="um-table tch-marks-table">
            <thead>
              <tr>
                <th>Student</th>
                {subjects.map((sub) => <th key={sub}>{sub}</th>)}
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {teacherMarks.map((m) => {
                const total = m.math + m.algebra + m.stats
                const { grade, tone } = getGrade(total)
                const pct = Math.round((total / 300) * 100)
                return (
                  <tr key={m.id}>
                    <td>
                      <div className="fee-student">
                        <img src={`https://i.pravatar.cc/80?img=${m.avatar}`} alt={m.name} className="um-avatar" />
                        <div>
                          <div className="um-name">{m.name}</div>
                          <div className="um-email">{m.studentId}</div>
                        </div>
                      </div>
                    </td>
                    {MARK_FIELDS.map((field, idx) => (
                      <td key={field}>
                        <input
                          type="number"
                          className={`tch-mark-input${markErrors[`${m.id}-${field}`] ? ' has-error' : ''}`}
                          min={0}
                          max={100}
                          value={m[field]}
                          onChange={(e) => updateMark(m.id, field, e.target.value)}
                          aria-invalid={!!markErrors[`${m.id}-${field}`]}
                          title={markErrors[`${m.id}-${field}`] || ''}
                        />
                        {markErrors[`${m.id}-${field}`] && (
                          <span className="field-error">{markErrors[`${m.id}-${field}`]}</span>
                        )}
                      </td>
                    ))}
                    <td>
                      <div className="tch-perf-cell">
                        <div className="tch-perf-head">
                          <span>Grade {grade}</span>
                          <span>{total}/300</span>
                        </div>
                        <div className="tch-perf-bar">
                          <div className={`tch-perf-fill tone-${tone}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
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
