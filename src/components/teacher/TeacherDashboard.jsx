import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, LabelList,
} from 'recharts'
import { TrendUp, TrendDown, Pin } from '../../icons.jsx'
import { useData } from '../../context/DataContext.jsx'
import { resolveIcon } from '../../utils/iconsMap.js'

export default function TeacherDashboard() {
  const { teacherDashboard } = useData()
  const {
    welcomeName, stats, attendanceData, performanceData, timetable, recentActivity,
  } = teacherDashboard

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <>
      <div className="page-head tch-head">
        <div>
          <h1>Welcome Back, {welcomeName}!</h1>
          <p>Here&apos;s what&apos;s happening in your classes today - {today}</p>
        </div>
      </div>

      <section className="stat-grid">
        {stats.map(({ id, icon, value, title, change, up, accent }) => {
          const Icon = resolveIcon(icon)
          return (
            <div key={id} className={`stat-card accent-${accent}`}>
              <div className="stat-top">
                <div className={`stat-icon icon-${accent}`}><Icon size={22} /></div>
                <span className={`stat-change${up ? '' : ' down'}`}>
                  {up ? <TrendUp size={14} /> : <TrendDown size={14} />} {change}
                </span>
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-title">{title}</div>
            </div>
          )
        })}
      </section>

      <section className="charts-row">
        <div className="card chart-card">
          <div className="card-head">
            <h3>Attendance overview</h3>
            <p>Monthly attendance rate %</p>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={attendanceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="tchAttGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c6ce7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7c6ce7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef0f6" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #eef0f6' }} />
                <Area type="monotone" dataKey="value" stroke="#7c6ce7" fill="url(#tchAttGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card-head">
            <h3>Student Performance</h3>
            <p>Avg vs Top Performers</p>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#eef0f6" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: '#9aa0b4', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #eef0f6' }} />
                <Bar dataKey="avg" name="Avg" fill="#a89cf0" radius={[4, 4, 0, 0]} barSize={14}>
                  <LabelList dataKey="avg" position="top" fontSize={10} fill="#6b7090" />
                </Bar>
                <Bar dataKey="top" name="Top" fill="#fca5a5" radius={[4, 4, 0, 0]} barSize={14}>
                  <LabelList dataKey="top" position="top" fontSize={10} fill="#6b7090" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span className="legend-dot" /> Avg
            <span className="legend-dot legend-dot--red" /> Top
          </div>
        </div>
      </section>

      <section className="bottom-row">
        <div className="card bottom-card">
          <div className="card-head"><h3>Today&apos;s Timetable</h3></div>
          {timetable.map(({ id, time, subject, classInfo, tag }) => (
            <div key={id} className="tch-timetable-item">
              <span className="tch-time">{time}</span>
              <div>
                <strong>{subject}</strong>
                <p>{classInfo}</p>
              </div>
              <span className="tch-lecture-tag">{tag}</span>
            </div>
          ))}
        </div>
        <div className="card bottom-card">
          <div className="card-head"><h3>Recent Activity</h3></div>
          <div className="tch-activity-list">
            {recentActivity.map(({ id, text, time }) => (
              <div key={id} className="tch-activity-item">
                <Pin size={14} />
                <div>
                  <strong>{text}</strong>
                  <p>{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
