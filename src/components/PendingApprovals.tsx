import { Check, X } from 'lucide-react'
import { ACCENT_COLOR } from '../constants/theme'

interface ApprovalItem {
  name: string
  description: string
  tag: string
}

const approvals: ApprovalItem[] = [
  {
    name: 'Sarah Connor',
    description: 'Medical leave request for 3 days',
    tag: 'Leave',
  },
  {
    name: 'James Porter',
    description: 'Request to correct attendance',
    tag: 'Attendance Edit',
  },
  {
    name: 'Robert Chen',
    description: 'Attendance correction',
    tag: 'Attendance Edit',
  },
]

function ApprovalCard({ name, description, tag }: ApprovalItem) {
  return (
    <div className="rounded-xl border border-[#e8eaed] bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold text-gray-900">{name}</p>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
          style={{ backgroundColor: `${ACCENT_COLOR}26`, color: '#b45309' }}
        >
          {tag}
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-gray-400">{description}</p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="flex h-8 flex-1 items-center justify-center gap-1 rounded-full bg-[#22c55e] text-[11px] font-semibold text-white transition-colors hover:bg-[#16a34a]"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          Approve
        </button>
        <button
          type="button"
          className="flex h-8 flex-1 items-center justify-center gap-1 rounded-full border border-[#fca5a5] bg-white text-[11px] font-semibold text-[#ef4444] transition-colors hover:bg-red-50"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          Reject
        </button>
      </div>
    </div>
  )
}

export default function PendingApprovals() {
  return (
    <div className="flex flex-col rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[15px] font-bold text-gray-900">Pending Approvals</h3>
          <p className="mt-0.5 text-[12px] text-gray-500">Require your action</p>
        </div>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fef3c7] text-[11px] font-bold text-[#b45309]">
          3
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {approvals.map((item) => (
          <ApprovalCard key={item.name} {...item} />
        ))}
      </div>
    </div>
  )
}
