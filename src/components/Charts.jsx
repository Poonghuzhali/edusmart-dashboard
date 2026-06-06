import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Tooltip,
} from 'recharts'
import { useData } from '../context/DataContext.jsx'

export default function Charts() {
  const { dashboardAdmin } = useData()
  const attendanceData = dashboardAdmin.attendanceData || []
  const feeData = dashboardAdmin.feeData || []

  return (
    <section className="charts-row">
      <div className="card chart-card">
        <div className="card-head">
          <h3>Attendance overview</h3>
          <p>Last 7 days across all classes</p>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#eef0f6" vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9aa0b4', fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9aa0b4', fontSize: 12 }}
              />
              <Tooltip
                formatter={(v) => [`${v}%`, 'Attendance']}
                contentStyle={{ borderRadius: 10, border: '1px solid #eef0f6' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b35c9"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card chart-card">
        <div className="card-head">
          <h3>Fee collection</h3>
          <p>Monthly collection K</p>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={feeData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#eef0f6" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9aa0b4', fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9aa0b4', fontSize: 12 }}
              />
              <Tooltip
                formatter={(v, _name, props) => {
                  const raw = props?.payload?.raw
                  return raw != null ? [`$${raw.toLocaleString()}`, 'Collected'] : [`${v}%`, 'Collected']
                }}
                cursor={{ fill: 'rgba(124,108,231,0.08)' }}
                contentStyle={{ borderRadius: 10, border: '1px solid #eef0f6' }}
              />
              <Bar dataKey="value" name="Collected" fill="#a89cf0" radius={[6, 6, 0, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend">
          <span className="legend-dot" /> Collected
        </div>
      </div>
    </section>
  )
}
