import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { month: 'Jan', collected: 35 },
  { month: 'Feb', collected: 52 },
  { month: 'Mar', collected: 28 },
  { month: 'Apr', collected: 68 },
  { month: 'May', collected: 48 },
  { month: 'Jun', collected: 82 },
]

export default function FeeChart() {
  return (
    <div className="flex min-h-[350px] flex-col rounded-[18px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-gray-900">Fee collection</h3>
        <p className="mt-0.5 text-[12px] text-gray-500">Monthly collection K</p>
      </div>
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              ticks={[0, 20, 40, 60, 80, 100]}
              width={40}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '12px',
              }}
            />
            <Bar
              dataKey="collected"
              fill="#c4b5fd"
              radius={[6, 6, 0, 0]}
              barSize={38}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#c4b5fd]" />
        <span className="text-[11px] text-gray-500">Collected</span>
      </div>
    </div>
  )
}
