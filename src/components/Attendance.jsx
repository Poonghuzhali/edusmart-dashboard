import { useState, useMemo } from 'react'
import {
  Upload, Search, GradCap, Book, CheckCircle, XCircle, Clock, Calendar,
} from '../icons.jsx'
import DatePicker from './DatePicker.jsx'
import FilterDropdown from './FilterDropdown.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { downloadExcel } from '../utils/download.js'

function StatusToggle({ value, onChange, showExcused = false }) {
  const options = [
    { id: 'present', label: 'Present', icon: CheckCircle },
    { id: 'absent', label: 'Absent', icon: XCircle },
    { id: 'late', label: 'Late', icon: Clock },
  ]

  return (
    <div className="att-status-group">
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={`att-status-btn att-status-${id}${value === id ? ' active' : ''}`}
          onClick={() => onChange(id)}
        >
          <Icon size={14} /> {label}
        </button>
      ))}
      {showExcused && (
        <button
          type="button"
          className={`att-status-btn att-status-excused${value === 'excused' ? ' active' : ''}`}
          onClick={() => onChange('excused')}
        >
          <Calendar size={14} /> Excused
        </button>
      )}
    </div>
  )
}

function SummaryCards({ items, counts, staff }) {
  return (
    <div className={`att-stats${staff ? ' att-stats--staff' : ''}`}>
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

export default function Attendance() {
  const {
    attendanceAdminStudents,
    setAttendanceAdminStudents,
    attendanceAdminStaff,
    setAttendanceAdminStaff,
    attendanceAdminMeta,
  } = useData()
  const { showToast } = useToast()
  const [mode, setMode] = useState('student')
  const [search, setSearch] = useState('')
  const [date, setDate] = useState(attendanceAdminMeta.defaultDate || '14-04-2026')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('all')

  const gradeOptions = attendanceAdminMeta.gradeOptions || []
  const deptOptions = attendanceAdminMeta.deptOptions || []

  const q = search.toLowerCase()

  const filteredStudents = useMemo(() => attendanceAdminStudents.filter((s) => {
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)
    const matchGrade = gradeFilter === 'all' || s.grade === gradeFilter
    return matchSearch && matchGrade
  }), [attendanceAdminStudents, q, gradeFilter])

  const filteredStaff = useMemo(() => attendanceAdminStaff.filter((s) => {
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.employeeId.toLowerCase().includes(q)
    const matchDept = deptFilter === 'all' || s.department === deptFilter
    return matchSearch && matchDept
  }), [attendanceAdminStaff, q, deptFilter])

  const studentCounts = useMemo(() => ({
    present: filteredStudents.filter((s) => s.status === 'present').length,
    absent: filteredStudents.filter((s) => s.status === 'absent').length,
    late: filteredStudents.filter((s) => s.status === 'late').length,
    excused: filteredStudents.filter((s) => s.status === 'excused').length,
  }), [filteredStudents])

  const staffCounts = useMemo(() => ({
    present: filteredStaff.filter((s) => s.status === 'present').length,
    absent: filteredStaff.filter((s) => s.status === 'absent').length,
    late: filteredStaff.filter((s) => s.status === 'late').length,
  }), [filteredStaff])

  const updateStudent = (id, field, val) => {
    setAttendanceAdminStudents((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)))
  }

  const updateStaff = (id, field, val) => {
    setAttendanceAdminStaff((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)))
  }

  const handleExport = () => {
    try {
      const rows = mode === 'student' ? filteredStudents : filteredStaff
      downloadExcel(rows, mode === 'student' ? 'Student Attendance' : 'Staff Attendance', 'attendance-export')
      showToast('Attendance exported to Excel', 'success')
    } catch (err) {
      showToast(err.message || 'Export failed', 'error')
    }
  }

  const handleSaveBatch = () => {
    showToast(`Attendance saved for ${date}`, 'success')
  }

  const studentStatItems = [
    { key: 'present', label: 'Present', icon: CheckCircle, tone: 'green' },
    { key: 'absent', label: 'Absent', icon: XCircle, tone: 'red' },
    { key: 'late', label: 'Late', icon: Clock, tone: 'orange' },
    { key: 'excused', label: 'Excused', icon: Calendar, tone: 'blue' },
  ]

  const staffStatItems = [
    { key: 'present', label: 'Present', icon: CheckCircle, tone: 'green' },
    { key: 'absent', label: 'Absent', icon: XCircle, tone: 'red' },
    { key: 'late', label: 'Late', icon: Clock, tone: 'orange' },
  ]

  return (
    <>
      <div className="page-head att-head">
        <div>
          <h1>Attendance</h1>
          <p>Track and manage student and staff attendance</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-ghost" onClick={handleExport}>
            <Upload size={18} /> Export Excel
          </button>
        </div>
      </div>

      <div className="att-mode-tabs">
        <button
          type="button"
          className={`att-mode-tab${mode === 'student' ? ' active' : ''}`}
          onClick={() => setMode('student')}
        >
          <GradCap size={18} /> Student Attendance
        </button>
        <button
          type="button"
          className={`att-mode-tab${mode === 'staff' ? ' active' : ''}`}
          onClick={() => setMode('staff')}
        >
          <Book size={18} /> Staff Attendance
        </button>
      </div>

      {mode === 'student' && (
        <SummaryCards items={studentStatItems} counts={studentCounts} />
      )}
      {mode === 'staff' && (
        <SummaryCards items={staffStatItems} counts={staffCounts} staff />
      )}

      <div className="card um-card att-panel">
        <div className="att-toolbar">
          <div className="um-search att-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search Student or roll no......"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DatePicker value={date} onChange={setDate} />
          {mode === 'student' ? (
            <FilterDropdown
              label="Grade 3"
              options={gradeOptions}
              value={gradeFilter}
              onChange={setGradeFilter}
            />
          ) : (
            <FilterDropdown
              label="All Departments"
              options={deptOptions}
              value={deptFilter}
              onChange={setDeptFilter}
              variant="department"
            />
          )}
          <button type="button" className="btn btn-primary att-save-btn" onClick={handleSaveBatch}>Save Batch</button>
        </div>

        {mode === 'student' && (
          <div className="um-table-wrap">
            <table className="um-table att-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td className="att-name">{s.name}</td>
                    <td className="um-id">{s.rollNo}</td>
                    <td className="um-date">{s.className}</td>
                    <td>
                      <StatusToggle
                        value={s.status}
                        onChange={(v) => updateStudent(s.id, 'status', v)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="att-remarks"
                        placeholder="Add remarks"
                        value={s.remarks}
                        onChange={(e) => updateStudent(s.id, 'remarks', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {mode === 'staff' && (
          <div className="um-table-wrap">
            <table className="um-table att-table">
              <thead>
                <tr>
                  <th>Staff Details</th>
                  <th>Employee ID</th>
                  <th>Departments</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((s) => (
                  <tr key={s.id}>
                    <td className="att-name">{s.name}</td>
                    <td className="um-id">{s.employeeId}</td>
                    <td>{s.department}</td>
                    <td>{s.role}</td>
                    <td>
                      <StatusToggle
                        value={s.status}
                        onChange={(v) => updateStaff(s.id, 'status', v)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="att-remarks"
                        placeholder="Add remarks"
                        value={s.remarks}
                        onChange={(e) => updateStaff(s.id, 'remarks', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
