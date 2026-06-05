import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Upload, Search, Calendar, ChevronDown, Layers, Book, Wallet, AlertCircle,
  Pencil, Trash, Bell,
} from '../icons.jsx'
import EditFeeModal from './EditFeeModal.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { downloadExcel } from '../utils/download.js'
import { resolveIcon } from '../utils/iconsMap.js'

const tabs = [
  { id: 'structure', label: 'Fee Structure', icon: Book },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'pending', label: 'Pending dues', icon: AlertCircle },
]

const monthOptions = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June']

function SummaryCards({ items }) {
  return (
    <div className="fee-stats">
      {items.map(({ id, label, value, icon, tone }) => {
        const Icon = resolveIcon(icon)
        return (
          <div key={id ?? label} className={`fee-stat-card fee-stat-${tone}`}>
            <div className={`fee-stat-icon icon-${tone}`}><Icon size={20} /></div>
            <div>
              <div className="fee-stat-value">{value}</div>
              <div className="fee-stat-label">{label}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FeeStatusBadge({ status }) {
  const slug = status.toLowerCase()
  return <span className={`fee-status fee-status-${slug}`}>{status}</span>
}

function StudentCell({ name, studentId, avatar }) {
  return (
    <div className="fee-student">
      <img src={`https://i.pravatar.cc/80?img=${avatar}`} alt={name} className="um-avatar" />
      <div>
        <div className="um-name">{name}</div>
        <div className="um-email">{studentId}</div>
      </div>
    </div>
  )
}

function FeeCategoryCard({ fee, onEdit, onDelete }) {
  return (
    <article className="fee-cat-card">
      <div className="fee-cat-top">
        <div className="fee-cat-icon"><Layers size={18} /></div>
        <div className="fee-cat-actions">
          <button type="button" className="um-action-btn" aria-label="Edit" onClick={() => onEdit(fee)}>
            <Pencil size={16} />
          </button>
          <button type="button" className="um-action-btn delete" aria-label="Delete" onClick={() => onDelete(fee)}>
            <Trash size={16} />
          </button>
        </div>
      </div>
      <div className="fee-cat-body">
        <h3>{fee.name}</h3>
        <p>{fee.grades}</p>
      </div>
      <div className="fee-cat-foot">
        <span className="fee-cat-amount">{fee.amount}</span>
        <span className={`fee-freq fee-freq-${fee.freqTone}`}>{fee.frequency}</span>
      </div>
    </article>
  )
}

export default function FeeManagement() {
  const { feeCategories, payments, pendingDues, feeSummary } = useData()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('structure')
  const [paymentSearch, setPaymentSearch] = useState('')
  const [monthFilter, setMonthFilter] = useState('All Months')
  const [monthOpen, setMonthOpen] = useState(false)
  const [editFee, setEditFee] = useState(null)
  const monthRef = useRef(null)

  useEffect(() => {
    if (!monthOpen) return undefined
    const handleClick = (e) => {
      if (monthRef.current && !monthRef.current.contains(e.target)) setMonthOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [monthOpen])

  const filteredPayments = useMemo(() => {
    const q = paymentSearch.toLowerCase()
    if (!q) return payments.items
    return payments.items.filter((p) => (
      p.name.toLowerCase().includes(q)
      || p.studentId.toLowerCase().includes(q)
    ))
  }, [paymentSearch, payments.items])

  const totalDue = pendingDues.items.reduce((sum, p) => {
    const num = parseInt(p.dueAmount.replace(/[^0-9]/g, ''), 10)
    return sum + (Number.isNaN(num) ? 0 : num)
  }, 0)

  const handleExport = () => {
    try {
      if (activeTab === 'structure') {
        downloadExcel(feeCategories.items, 'Fee Structure', 'fee-structure')
      } else if (activeTab === 'payments') {
        downloadExcel(filteredPayments, 'Payments', 'fee-payments')
      } else {
        downloadExcel(pendingDues.items, 'Pending Dues', 'fee-pending-dues')
      }
      showToast('Excel exported successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Export failed', 'error')
    }
  }

  const handleDeleteFee = (fee) => {
    if (!window.confirm(`Delete fee category "${fee.name}"?`)) return
    feeCategories.remove(fee.id)
    showToast('Fee category deleted', 'success')
  }

  const handleReminder = (student) => {
    showToast(`Reminder sent to ${student.name}`, 'success')
  }

  return (
    <>
      <div className="page-head fee-head">
        <div>
          <h1>Fee Management</h1>
          <p>Track fees structure, payments and pending.</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-ghost" onClick={handleExport}>
            <Upload size={18} /> Export Excel
          </button>
        </div>
      </div>

      <SummaryCards items={feeSummary} />

      <div className="fee-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`fee-tab${activeTab === id ? ' active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'structure' && (
        <div className="fee-structure">
          <div className="fee-section-head">
            <h2>Fee Categories</h2>
            <p>Define and manage school fee categories</p>
          </div>
          <div className="fee-cat-grid">
            {feeCategories.items.map((fee) => (
              <FeeCategoryCard
                key={fee.id}
                fee={fee}
                onEdit={setEditFee}
                onDelete={handleDeleteFee}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="card um-card fee-panel">
          <div className="um-toolbar">
            <div className="um-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search Student or roll no......"
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
              />
            </div>
            <div className="att-filter-wrap" ref={monthRef}>
              <button
                type="button"
                className={`um-select att-filter-btn${monthOpen ? ' open' : ''}`}
                onClick={() => setMonthOpen((v) => !v)}
              >
                <Calendar size={16} /> {monthFilter} <ChevronDown size={16} />
              </button>
              {monthOpen && (
                <ul className="att-dept-menu fee-month-menu">
                  {monthOptions.map((m) => (
                    <li key={m}>
                      <button
                        type="button"
                        className={`att-dept-option${monthFilter === m ? ' selected' : ''}`}
                        onClick={() => { setMonthFilter(m); setMonthOpen(false) }}
                      >
                        {m}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="fee-table-title">Student Payment Records</div>
          <div className="um-table-wrap">
            <table className="um-table fee-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade & Section</th>
                  <th>Fee Type</th>
                  <th>Receipt No.</th>
                  <th>Amount</th>
                  <th>Paid Date</th>
                  <th>Status</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={p.id} className={p.status === 'Overdue' ? 'fee-row-overdue' : ''}>
                    <td><StudentCell name={p.name} studentId={p.studentId} avatar={p.avatar} /></td>
                    <td>{p.grade}</td>
                    <td>{p.feeType}</td>
                    <td className="um-id">{p.receipt}</td>
                    <td className="att-name">{p.amount}</td>
                    <td className="um-date">{p.paidDate}</td>
                    <td><FeeStatusBadge status={p.status} /></td>
                    <td>{p.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="card um-card fee-panel">
          <div className="fee-pending-head">
            <h2>Pending Dues</h2>
            <p>{pendingDues.items.length} outstanding records: Total Due ${totalDue.toLocaleString()}</p>
          </div>
          <div className="um-table-wrap">
            <table className="um-table fee-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade & Section</th>
                  <th>Fee Type</th>
                  <th>Due Amount</th>
                  <th>Days Overdue</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingDues.items.map((p) => (
                  <tr key={p.id} className={p.status === 'Overdue' ? 'fee-row-overdue' : ''}>
                    <td><StudentCell name={p.name} studentId={p.studentId} avatar={p.avatar} /></td>
                    <td>{p.grade}</td>
                    <td>{p.feeType}</td>
                    <td className="att-name">{p.dueAmount}</td>
                    <td className={p.daysOverdue !== '-' ? 'fee-days-overdue' : 'um-date'}>{p.daysOverdue}</td>
                    <td className="um-date">{p.dueDate}</td>
                    <td><FeeStatusBadge status={p.status} /></td>
                    <td>
                      <button type="button" className="fee-reminder-btn" onClick={() => handleReminder(p)}>
                        <Bell size={15} /> Remainder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EditFeeModal
        open={!!editFee}
        fee={editFee}
        onClose={() => setEditFee(null)}
      />
    </>
  )
}
