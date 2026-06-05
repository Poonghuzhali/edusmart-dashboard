import { TrendUp } from '../icons.jsx'
import { useData } from '../context/DataContext.jsx'
import { resolveIcon } from '../utils/iconsMap.js'

export default function StatCards() {
  const { dashboardAdmin } = useData()
  const stats = dashboardAdmin.stats || []

  return (
    <section className="stat-grid">
      {stats.map(({ id, icon, accent, change, value, title, sub }) => {
        const Icon = resolveIcon(icon)
        return (
          <div key={id ?? title} className={`stat-card accent-${accent}`}>
            <div className="stat-top">
              <div className={`stat-icon icon-${accent}`}>
                <Icon size={22} />
              </div>
              <span className="stat-change">
                <TrendUp size={14} /> {change}
              </span>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-title">{title}</div>
            <div className="stat-sub">{sub}</div>
          </div>
        )
      })}
    </section>
  )
}
