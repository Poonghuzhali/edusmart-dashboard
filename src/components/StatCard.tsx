import type { LucideIcon } from 'lucide-react'
import { TrendingUp } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  value: string
  title: string
  subtitle: string
  trend: string
  iconBg: string
  iconColor: string
  bgColor: string
}

export default function StatCard({
  icon: Icon,
  value,
  title,
  subtitle,
  trend,
  iconBg,
  iconColor,
  bgColor,
}: StatCardProps) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[18px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="mb-3.5 flex items-start justify-between">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${iconBg}`}
        >
          <Icon className={`h-[18px] w-[18px] ${iconColor}`} strokeWidth={2} />
        </div>
        <span className="flex items-center gap-0.5 text-[12px] font-semibold text-emerald-500">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </span>
      </div>

      <p className="text-[32px] font-bold leading-none tracking-tight text-gray-900">{value}</p>
      <p className="mt-2.5 text-[13px] font-semibold text-gray-800">{title}</p>
      <p className="mt-0.5 text-[11px] text-gray-500">{subtitle}</p>
    </div>
  )
}
