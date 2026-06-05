import { GraduationCap, IndianRupee, CircleCheck, Bell } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Activity {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  initials: string
  person: string
  time: string
}

const activities: Activity[] = [
  {
    icon: GraduationCap,
    iconBg: 'bg-[#e0f5ec]',
    iconColor: 'text-[#16a34a]',
    title: 'Liam smith admitted to Grade 5',
    initials: 'AE',
    person: 'Admin Elena',
    time: '3 minutes ago',
  },
  {
    icon: IndianRupee,
    iconBg: 'bg-[#e0edff]',
    iconColor: 'text-[#3b82f6]',
    title: 'Emily Brown paid fee for Term 1',
    initials: 'EB',
    person: 'Emily Brown',
    time: '12 minutes ago',
  },
  {
    icon: GraduationCap,
    iconBg: 'bg-[#e0f5ec]',
    iconColor: 'text-[#16a34a]',
    title: 'Emily Brown admitted to Grade 6',
    initials: 'AE',
    person: 'Admin Elena',
    time: '25 minutes ago',
  },
  {
    icon: IndianRupee,
    iconBg: 'bg-[#e0edff]',
    iconColor: 'text-[#3b82f6]',
    title: 'Emily Brown paid fee for Term 2',
    initials: 'EB',
    person: 'Emily Brown',
    time: '1 hour ago',
  },
  {
    icon: CircleCheck,
    iconBg: 'bg-[#e0f5ec]',
    iconColor: 'text-[#16a34a]',
    title: 'Attendance marked for grade 5A',
    initials: 'SC',
    person: 'Sarah Connor',
    time: '2 hours ago',
  },
  {
    icon: Bell,
    iconBg: 'bg-[#ede9fe]',
    iconColor: 'text-[#7c3aed]',
    title: 'Annual sports day announcement Published',
    initials: 'PJ',
    person: 'Principal Johnson',
    time: '3 hour ago',
  },
]

export default function RecentActivity() {
  return (
    <div className="flex flex-col rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-gray-900">Recent Activity</h3>
        <p className="mt-0.5 text-[12px] text-gray-500">Live update from today</p>
      </div>

      <ul className="flex flex-col gap-4">
        {activities.map((activity) => (
          <li key={activity.title} className="flex items-start gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.iconBg}`}
            >
              <activity.icon className={`h-4 w-4 ${activity.iconColor}`} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold leading-snug text-gray-900">
                {activity.title}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8eaed] text-[9px] font-bold text-gray-600">
                  {activity.initials}
                </span>
                <span className="text-[11px] text-gray-400">
                  {activity.person} . {activity.time}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
