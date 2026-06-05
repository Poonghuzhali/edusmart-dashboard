import { GraduationCap, Users, BookOpen, IndianRupee, Plus, Bell } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatCard from './components/StatCard'
import AttendanceChart from './components/AttendanceChart'
import FeeChart from './components/FeeChart'
import RecentActivity from './components/RecentActivity'
import AlertSection from './components/AlertSection'
import PendingApprovals from './components/PendingApprovals'
import { CONTENT_PADDING } from './constants/layout'

const stats = [
  {
    icon: GraduationCap,
    value: '1,250',
    title: 'Total Students',
    subtitle: 'Enrolled this year',
    trend: '+3.5%',
    iconBg: 'bg-[#e8ddff]',
    iconColor: 'text-[#7c3aed]',
    bgColor: '#f3eeff',
  },
  {
    icon: Users,
    value: '85',
    title: 'Total Staff',
    subtitle: 'Active employees',
    trend: '+1.2%',
    iconBg: 'bg-[#e8ddff]',
    iconColor: 'text-[#7c3aed]',
    bgColor: '#f3eeff',
  },
  {
    icon: BookOpen,
    value: '48',
    title: 'Total Classes',
    subtitle: 'Across all grades',
    trend: '+0.8%',
    iconBg: 'bg-[#d6f0ff]',
    iconColor: 'text-[#2563eb]',
    bgColor: '#e8faf3',
  },
  {
    icon: IndianRupee,
    value: '152k',
    title: 'Total Revenue',
    subtitle: 'Collected this team',
    trend: '+5.1%',
    iconBg: 'bg-[#d6e4ff]',
    iconColor: 'text-[#2563eb]',
    bgColor: '#f3eeff',
  },
]

export default function App() {
  return (
    <div className="flex min-h-screen w-full bg-[#f4f7fe]">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Header />

        <div
          className="flex flex-col gap-6 pb-8"
          style={{ paddingLeft: CONTENT_PADDING, paddingRight: CONTENT_PADDING }}
        >
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-[26px] font-bold tracking-tight text-gray-900">Dashboard</h1>
              <p className="mt-1 text-[14px] text-gray-500">
                Welcome Back, Elena Here&apos;s What&apos;s happening today.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                className="flex h-[40px] items-center gap-2 rounded-[12px] border border-gray-300 bg-white px-5 text-[13px] font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                Add Student
              </button>
              <button
                type="button"
                className="flex h-[40px] items-center gap-2 rounded-[12px] bg-[#3446d1] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d3bb8]"
              >
                <Bell className="h-4 w-4" />
                New Announcement
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <AttendanceChart />
            <FeeChart />
          </div>

          <div className="grid grid-cols-3 items-start gap-5">
            <RecentActivity />
            <AlertSection />
            <PendingApprovals />
          </div>
        </div>
      </main>
    </div>
  )
}
