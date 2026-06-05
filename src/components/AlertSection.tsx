import { Bell, AlertTriangle } from 'lucide-react'

const blueAlerts = [
  {
    title: 'New Admission Request',
    description: 'A new admission request has been submitted for Grade 5',
  },
  {
    title: 'Approval Request',
    description: 'Sarah Connor submitted a leave request.',
  },
]

const yellowAlerts = [
  {
    title: 'Fee payment overdue',
    description: '12 Students have overdue fee payments.',
  },
  {
    title: 'Attendance Alert',
    description: 'Attendance below 75% for 5 students this week.',
  },
]

export default function AlertSection() {
  return (
    <div className="flex flex-col rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[15px] font-bold text-gray-900">Alert</h3>
          <p className="mt-0.5 text-[12px] text-gray-500">4 unread notifications</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#fee2e2] px-2.5 py-0.5 text-[11px] font-semibold text-[#ef4444]">
          4 New
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {blueAlerts.map((alert) => (
          <div
            key={alert.title}
            className="flex items-start gap-3 rounded-xl bg-[#edf3ff] p-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
              <Bell className="h-4 w-4 text-[#3446d1]" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-gray-900">{alert.title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-gray-500">
                {alert.description}
              </p>
            </div>
          </div>
        ))}

        {yellowAlerts.map((alert) => (
          <div
            key={alert.title}
            className="flex items-start gap-3 rounded-xl bg-[#fffbeb] p-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
              <AlertTriangle className="h-4 w-4 text-[#d97706]" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-gray-900">{alert.title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-gray-500">
                {alert.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
