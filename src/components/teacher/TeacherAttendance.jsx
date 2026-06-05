import { useMemo } from 'react'
import {
  Save, ChevronDown, Calendar, User, Check, XCircle, Clock,
} from '../../icons.jsx'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const statusBtns = [
  { id: 'Present', icon: Check, cls: 'present' },
  { id: 'Absent', icon: XCircle, cls: 'absent' },
  { id: 'Late', icon: Clock, cls: 'late' },
]

export default function TeacherAttendance() {
  const {
    teacherAttendanceStudents,
    setTeacherAttendanceStudents,
    teacherAttendanceMeta,
  } = useData()
  const { showToast } = useToast()
  const {
    selectedClass, selectedDate, studentCount, monthlyData, classProgress,
  } = teacherAttendanceMeta

  const counts = useMemo(() => ({
    Present: teacherAttendanceStudents.filter((s) => s.status === 'Present').length,
    Absent: teacherAttendanceStudents.filter((s) => s.status === 'Absent').length,
    Late: teacherAttendanceStudents.filter((s) => s.status === 'Late').length,
  }), [teacherAttendanceStudents])

  const setStatus = (id, status) => {
    setTeacherAttendanceStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
  }

  const handleSave = () => {
    showToast('Attendance saved successfully')
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Attendance Marking</h1></div>
        <div className="page-actions">
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> Save Attendance
          </button>
        </div>
      </div>

      <div className="tch-att-summary">
        <div className="tch-att-sum tch-att-sum-present">
          <span className="tch-att-sum-val">{counts.Present}</span>
          <span>Present</span>
        </div>
        <div className="tch-att-sum tch-att-sum-absent">
          <span className="tch-att-sum-val">{counts.Absent}</span>
          <span>Absent</span>
        </div>
        <div className="tch-att-sum tch-att-sum-late">
          <span className="tch-att-sum-val">{counts.Late}</span>
          <span>Late</span>
        </div>
      </div>

      <div className="tch-att-grid">
        <div className="card tch-att-panel">
          <div className="tch-att-toolbar">
            <button type="button" className="um-select">
              <User size={16} /> {selectedClass} <ChevronDown size={16} />
            </button>
            <button type="button" className="um-select">
              <Calendar size={16} /> {selectedDate} <ChevronDown size={16} />
            </button>
            <span className="tch-att-count">{studentCount} Students</span>
          </div>

          <div className="tch-att-list">
            {teacherAttendanceStudents.map((s) => (
              <div key={s.id} className="tch-att-row">
                <div className="tch-att-student">
                  <img src={`https://i.pravatar.cc/80?img=${s.avatar}`} alt={s.name} className="um-avatar" />
                  <div>
                    <strong>{s.name}</strong>
                    <span>Roll No: {s.roll}</span>
                  </div>
                </div>
                <div className="tch-att-toggles">
                  {statusBtns.map(({ id, icon: Icon, cls }) => (
                    <button
                      key={id}
                      type="button"
                      className={`tch-att-toggle att-status-${cls}${s.status === id ? ' active' : ''}`}
                      onClick={() => setStatus(s.id, id)}
                    >
                      <Icon size={14} /> {id}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card tch-att-analytics">
          <h3>Monthly Analytics</h3>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#eef0f6" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #eef0f6' }} />
                <Bar dataKey="present" name="Present" fill="#a89cf0" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="absent" name="Absent" fill="#fca5a5" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span className="legend-dot" /> Present
            <span className="legend-dot legend-dot--red" /> Absent
          </div>
          <div className="tch-class-progress">
            {classProgress.map(({ id, label, pct }) => (
              <div key={id} className="tch-progress-row">
                <span>{label}</span>
                <div className="tch-progress-track">
                  <div className="tch-progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <strong>{pct}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
