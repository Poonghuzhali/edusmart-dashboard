import { Search, Bell } from 'lucide-react'
import { CONTENT_PADDING } from '../constants/layout'

export default function Header() {
  return (
    <header
      className="flex items-center gap-6 bg-[#f4f7fe]"
      style={{ padding: `${20}px ${CONTENT_PADDING}px` }}
    >
      <div className="flex h-[48px] min-w-0 flex-1 items-center gap-4 rounded-full border border-[#e2e8f0] bg-white px-5">
        <Search
          className="h-[18px] w-[18px] shrink-0 text-[#94a3b8]"
          strokeWidth={2}
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search....../"
          className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-gray-700 outline-none placeholder:text-[#94a3b8]"
        />
      </div>

      <div className="flex shrink-0 items-center gap-5">
        <button
          type="button"
          className="text-gray-800 transition-colors hover:text-[#3446d1]"
          aria-label="Notifications"
        >
          <Bell className="h-[22px] w-[22px]" strokeWidth={1.75} />
        </button>

        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
            alt="Sarah Johnson"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="text-[14px] font-semibold text-gray-900">Sarah Johnson</p>
            <p className="text-[12px] text-gray-500">Teacher</p>
          </div>
        </div>
      </div>
    </header>
  )
}
