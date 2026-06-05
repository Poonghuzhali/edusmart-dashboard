import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  Wallet,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
  CheckSquare,
  GraduationCap,
  LogOut,
} from 'lucide-react'
import { SIDEBAR_WIDTH } from '../constants/layout'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'User Management' },
  { icon: BookOpen, label: 'Academic' },
  { icon: ClipboardCheck, label: 'Attendance' },
  { icon: Wallet, label: 'Fees' },
  { icon: MessageSquare, label: 'Communication' },
  { icon: BarChart3, label: 'Reports' },
  { icon: FileText, label: 'Documents' },
  { icon: Settings, label: 'Settings' },
  { icon: CheckSquare, label: 'Approvals' },
]

export default function Sidebar() {
  return (
    <aside
      className="flex h-screen shrink-0 flex-col bg-[#3446d1] text-white"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className="flex items-center gap-3 px-7 pb-9 pt-8">
        <GraduationCap className="h-8 w-8 shrink-0" strokeWidth={1.5} />
        <span className="font-serif text-[26px] font-semibold tracking-tight">EduSmart</span>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-5">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            type="button"
            className={`flex w-full items-center gap-3.5 rounded-[12px] px-4 py-3.5 text-left text-[17px] font-medium transition-colors ${
              active
                ? 'bg-[#4d5df0] text-white'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-white/20 px-6 py-6">
        <div className="mb-5 flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
            alt="Sarah Johnson"
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <div>
            <p className="text-[15px] font-semibold leading-tight">Sarah Johnson</p>
            <p className="text-[13px] text-white/70">Teacher</p>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2.5 text-[15px] text-white/80 transition-colors hover:text-white"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  )
}
