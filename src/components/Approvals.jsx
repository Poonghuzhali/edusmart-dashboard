import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Search, Filter, ChevronDown, User, Calendar, Check, XCircle,
} from '../icons.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { resolveIcon } from '../utils/iconsMap.js'

function SummaryCards({ items }) {
  return (
    <div className="aprv-stats">
      {items.map(({ id, value, label, sub, subTone, icon, tone }) => {
        const Icon = resolveIcon(icon)
        return (
          <div key={id ?? label} className={`aprv-stat-card aprv-stat-${tone}`}>
            <div className={`aprv-stat-icon icon-${tone}`}><Icon size={20} /></div>
            <div>
              <div className="aprv-stat-value">{value}</div>
              <div className="aprv-stat-label">{label}</div>
              <div className={`aprv-stat-sub sub-${subTone}`}>{sub}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StatusBadge({ status }) {
  const slug = status.toLowerCase()
  return <span className={`aprv-status aprv-status-${slug}`}>{status}</span>
}

function RequestRow({ item, showActions, onApprove, onReject }) {
  return (
    <div className="aprv-row">
      <div className="aprv-row-user">
        <div className="aprv-row-icon"><User size={18} /></div>
        <div>
          <strong>{item.name} . {item.role}</strong>
          <p>{item.desc}</p>
        </div>
      </div>
      <div className="aprv-row-meta">
        <span><User size={14} /> {item.category}</span>
        <span><Calendar size={14} /> {item.date}</span>
      </div>
      <div className="aprv-row-end">
        <StatusBadge status={item.status} />
        {showActions && item.status === 'Pending' && (
          <div className="aprv-row-actions">
            <button type="button" className="btn aprv-btn-approve" onClick={() => onApprove(item.id)}>
              <Check size={16} /> Approve
            </button>
            <button type="button" className="btn aprv-btn-reject" onClick={() => onReject(item.id)}>
              <XCircle size={16} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Approvals() {
  const {
    approvalRequests, approvalSummary, approvalModeTabs, approvalStatusOptions,
  } = useData()
  const { showToast } = useToast()
  const [activeMode, setActiveMode] = useState('all')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [statusOpen, setStatusOpen] = useState(false)
  const statusRef = useRef(null)

  const statusOptions = approvalStatusOptions || ['All Status']

  useEffect(() => {
    if (!statusOpen) return undefined
    const handleClick = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [statusOpen])

  const handleApprove = (id) => {
    approvalRequests.update(id, { status: 'Approved' })
    showToast('Request approved', 'success')
  }

  const handleReject = (id) => {
    approvalRequests.update(id, { status: 'Rejected' })
    showToast('Request rejected', 'success')
  }

  const filtered = useMemo(() => {
    let list = approvalRequests.items
    if (activeMode === 'pending') {
      list = list.filter((r) => r.status === 'Pending')
    }
    if (statusFilter !== 'All Status') {
      list = list.filter((r) => r.status === statusFilter)
    }
    const q = search.toLowerCase()
    if (q) {
      list = list.filter((r) => (
        r.name.toLowerCase().includes(q)
        || r.role.toLowerCase().includes(q)
        || r.desc.toLowerCase().includes(q)
      ))
    }
    return list
  }, [approvalRequests.items, activeMode, statusFilter, search])

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Approvals</h1>
          <p>Review leave requests and manage pending approvals</p>
        </div>
      </div>

      <SummaryCards items={approvalSummary} />

      <div className="aprv-toolbar">
        <div className="aprv-mode-tabs">
          {approvalModeTabs.map(({ id, label, icon }) => {
            const Icon = resolveIcon(icon)
            return (
              <button
                key={id}
                type="button"
                className={`aprv-mode-tab${activeMode === id ? ' active' : ''}`}
                onClick={() => setActiveMode(id)}
              >
                <Icon size={16} /> {label}
              </button>
            )
          })}
        </div>
        <div className="aprv-filters">
          <div className="um-search aprv-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search Student or roll no......"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="att-filter-wrap" ref={statusRef}>
            <button
              type="button"
              className={`um-select att-filter-btn${statusOpen ? ' open' : ''}`}
              onClick={() => setStatusOpen((v) => !v)}
            >
              <Filter size={16} /> {statusFilter} <ChevronDown size={16} />
            </button>
            {statusOpen && (
              <ul className="att-dept-menu fee-month-menu">
                {statusOptions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      className={`att-dept-option${statusFilter === s ? ' selected' : ''}`}
                      onClick={() => { setStatusFilter(s); setStatusOpen(false) }}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="card um-card aprv-list-panel">
        {filtered.map((item) => (
          <RequestRow
            key={item.id}
            item={item}
            showActions={activeMode === 'pending'}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
        {filtered.length === 0 && (
          <p className="aprv-empty">No requests match your filters.</p>
        )}
      </div>
    </>
  )
}
