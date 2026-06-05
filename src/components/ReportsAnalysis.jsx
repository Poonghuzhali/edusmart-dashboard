import { useState } from 'react'
import {
  Upload, Book, DollarSign, Users, CalendarCheck,
} from '../icons.jsx'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, Legend, Area, AreaChart,
} from 'recharts'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { downloadMultiSheetExcel } from '../utils/download.js'
import { resolveIcon } from '../utils/iconsMap.js'

const tabs = [
  { id: 'academic', label: 'Academic Reports', icon: Book },
  { id: 'financial', label: 'Financial Reports', icon: DollarSign },
  { id: 'attendance', label: 'Attendance Analysis', icon: Users },
]

function ReportStatCard({ value, label, sub, icon, tone = 'blue' }) {
  const Icon = resolveIcon(icon, CalendarCheck)
  return (
    <div className={`rep-stat-card rep-stat-${tone}`}>
      <div className={`rep-stat-icon icon-${tone}`}><Icon size={18} /></div>
      <div>
        <div className="rep-stat-value">{value}</div>
        <div className="rep-stat-label">{label}</div>
        {sub && <div className={`rep-stat-sub${sub.includes('increased') ? ' up' : ''}`}>{sub}</div>}
      </div>
    </div>
  )
}

function AcademicPanel({ reports }) {
  return (
    <>
      <div className="rep-stats rep-stats--4">
        {reports.academicStats.map((stat) => (
          <ReportStatCard key={stat.id} {...stat} />
        ))}
      </div>
      <div className="charts-row">
        <div className="card chart-card">
          <div className="card-head">
            <h3>Subject Wise Average performance</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={reports.subjectData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#eef0f6" vertical={false} />
                <XAxis dataKey="subject" tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #eef0f6' }} />
                <Bar dataKey="avg" name="Avg" fill="#a89cf0" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend"><span className="legend-dot" /> Avg</div>
        </div>
        <div className="card chart-card">
          <div className="card-head">
            <h3>Pass/Fail rate by grade</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={reports.passFailData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#eef0f6" vertical={false} />
                <XAxis dataKey="grade" tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #eef0f6' }} />
                <Bar dataKey="pass" stackId="a" fill="#a89cf0" radius={[0, 0, 0, 0]} barSize={28} />
                <Bar dataKey="fail" stackId="a" fill="#fca5a5" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span className="legend-dot" /> Pass
            <span className="legend-dot legend-dot--red" /> Fail
          </div>
        </div>
      </div>
    </>
  )
}

function FinancialPanel({ reports }) {
  return (
    <>
      <div className="rep-stats rep-stats--3">
        {reports.financialStats.map((stat) => (
          <ReportStatCard key={stat.id} {...stat} />
        ))}
      </div>
      <div className="charts-row">
        <div className="card chart-card">
          <div className="card-head">
            <h3>Monthly collection Fee 2026</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={reports.monthlyCollection} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#eef0f6" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #eef0f6' }} />
                <Bar dataKey="value" name="Collection" fill="#c4b5fd" radius={[6, 6, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend"><span className="legend-dot" /> Collection</div>
        </div>
        <div className="card chart-card">
          <div className="card-head">
            <h3>Fee by Category</h3>
          </div>
          <div className="chart-body rep-pie-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={reports.feeCategoryData}
                  cx="40%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={90}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {reports.feeCategoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconType="circle"
                  formatter={(value) => <span style={{ color: '#4b5563', fontSize: 13 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}

function AttendancePanel({ reports }) {
  return (
    <>
      <div className="rep-stats rep-stats--4">
        {reports.attendanceStats.map((stat) => (
          <ReportStatCard key={stat.id} {...stat} />
        ))}
      </div>
      <div className="charts-row">
        <div className="card chart-card">
          <div className="card-head">
            <h3>Monthly Attendance Students vs Staff</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={reports.monthlyAttendance} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a89cf0" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a89cf0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef0f6" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 12 }} />
                <YAxis domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #eef0f6' }} />
                <Area type="monotone" dataKey="students" stroke="#7c6ce7" fill="url(#studentGrad)" strokeWidth={2} name="Students" />
                <Line type="monotone" dataKey="staff" stroke="#38bdf8" strokeWidth={2} dot={false} name="Staff" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span className="legend-dot" /> Students
            <span className="legend-dot legend-dot--cyan" /> Staff
          </div>
        </div>
        <div className="card chart-card">
          <div className="card-head">
            <h3>Attendance breakdown</h3>
          </div>
          <div className="chart-body rep-pie-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={reports.attendanceBreakdown}
                  cx="45%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {reports.attendanceBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <text x="45%" y="50%" textAnchor="middle" dominantBaseline="middle" className="rep-donut-center">100</text>
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => <span style={{ color: '#4b5563', fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ReportsAnalysis() {
  const { reports } = useData()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('academic')

  const handleExport = () => {
    try {
      const sheetMap = {
        academic: [
          { name: 'Subject Performance', rows: reports.subjectData },
          { name: 'Pass Fail by Grade', rows: reports.passFailData },
        ],
        financial: [
          { name: 'Monthly Collection', rows: reports.monthlyCollection },
          { name: 'Fee by Category', rows: reports.feeCategoryData },
        ],
        attendance: [
          { name: 'Monthly Attendance', rows: reports.monthlyAttendance },
          { name: 'Attendance Breakdown', rows: reports.attendanceBreakdown },
        ],
      }
      downloadMultiSheetExcel(sheetMap[activeTab], `reports-${activeTab}`)
      showToast('Excel exported successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Export failed', 'error')
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Report & Analysis</h1>
          <p>Comprehensive school performance insights and export tools</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-ghost" onClick={handleExport}>
            <Upload size={18} /> Export Excel
          </button>
        </div>
      </div>

      <div className="page-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`page-tab${activeTab === id ? ' active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'academic' && <AcademicPanel reports={reports} />}
      {activeTab === 'financial' && <FinancialPanel reports={reports} />}
      {activeTab === 'attendance' && <AttendancePanel reports={reports} />}
    </>
  )
}
