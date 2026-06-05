import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 55 },
  { day: 'Wed', value: 70 },
  { day: 'Thu', value: 62 },
  { day: 'Fri', value: 82 },
  { day: 'Sat', value: 65 },
  { day: 'Sun', value: 48 },
]

export default function AttendanceChart() {
  return (
    <div className="flex min-h-[350px] flex-col rounded-[18px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-gray-900">Attendance overview</h3>
        <p className="mt-0.5 text-[12px] text-gray-500">Last 7 days across all classes</p>
      </div>
      <div className="h-[255px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '12px',
                padding: '6px 10px',
              }}
              labelFormatter={(label) => `${label}:`}
              formatter={(value) => [`Attendance ${value}%`, '']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3446d1"
              strokeWidth={2.5}
              dot={{ fill: '#3446d1', strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5, fill: '#3446d1', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
