import { useState, useMemo } from 'react'
import { CheckCircle, XCircle } from '../icons.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { resolveIcon } from '../utils/iconsMap.js'

export default function BottomCards() {
  const { dashboardAdmin, approvalRequests } = useData()
  const { showToast } = useToast()
  const [handledApprovalIds, setHandledApprovalIds] = useState([])

  const activities = dashboardAdmin.activities || []
  const alerts = dashboardAdmin.alerts || []
  const approvals = useMemo(
    () => (dashboardAdmin.approvals || []).filter((a) => !handledApprovalIds.includes(a.id)),
    [dashboardAdmin.approvals, handledApprovalIds],
  )

  const findLinkedRequest = (approval) => {
    const byId = approvalRequests.items.find((r) => r.id === approval.id && r.status === 'Pending')
    if (byId) return byId
    return approvalRequests.items.find(
      (r) => r.name === approval.name && r.status === 'Pending',
    )
  }

  const handleApprovalAction = (approval, status) => {
    const linked = findLinkedRequest(approval)
    if (linked) {
      approvalRequests.update(linked.id, { status })
      showToast(`Request ${status.toLowerCase()} for ${approval.name}`, 'success')
    } else {
      showToast(`${status} recorded for ${approval.name}`, 'success')
    }
    setHandledApprovalIds((prev) => [...prev, approval.id])
  }

  return (
    <section className="bottom-row">
      <div className="card list-card">
        <div className="card-head">
          <h3>Recent Activity</h3>
          <p>Live update from today</p>
        </div>
        <div className="activity-list">
          {activities.map((a) => {
            const Icon = resolveIcon(a.icon)
            return (
              <div className="activity-item" key={a.id}>
                <div className={`activity-icon tone-${a.tone}`}><Icon size={18} /></div>
                <div className="activity-body">
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-meta">
                    <span className="mini-badge">{a.badge}</span>
                    {a.who} . {a.time}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card list-card">
        <div className="card-head head-with-badge">
          <div>
            <h3>Alert</h3>
            <p>{alerts.length} unread notifications</p>
          </div>
          <span className="pill pill-red">{alerts.length} New</span>
        </div>
        <div className="alert-list">
          {alerts.map((a) => {
            const Icon = resolveIcon(a.icon)
            return (
              <div className={`alert-item alert-${a.tone}`} key={a.id}>
                <div className={`alert-icon tone-${a.tone}`}><Icon size={18} /></div>
                <div className="alert-body">
                  <div className="alert-title">{a.title}</div>
                  <div className="alert-text">{a.text}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card list-card">
        <div className="card-head head-with-badge">
          <div>
            <h3>Pending Approvals</h3>
            <p>Require your action</p>
          </div>
          <span className="pill pill-grey">{approvals.length}</span>
        </div>
        <div className="approval-list">
          {approvals.map((a) => (
            <div className="approval-item" key={a.id}>
              <div className="approval-top">
                <strong>{a.name}</strong>
                <span className={`tag tag-${a.tagTone}`}>{a.tag}</span>
              </div>
              <div className="approval-desc">{a.desc}</div>
              <div className="approval-actions">
                <button
                  type="button"
                  className="btn-approve"
                  onClick={() => handleApprovalAction(a, 'Approved')}
                >
                  <CheckCircle size={15} /> Approve
                </button>
                <button
                  type="button"
                  className="btn-reject"
                  onClick={() => handleApprovalAction(a, 'Rejected')}
                >
                  <XCircle size={15} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
