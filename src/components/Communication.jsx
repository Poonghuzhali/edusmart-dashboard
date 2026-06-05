import { useState } from 'react'
import {
  Plus, Megaphone, Bell, Radio, User, Calendar, Clock, Send, Users, Pencil,
} from '../icons.jsx'
import NewAnnouncementModal from './NewAnnouncementModal.jsx'
import { FormField, FormAlert } from './FormField.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { resolveIcon } from '../utils/iconsMap.js'
import { validateRequired, runValidation } from '../utils/validation.js'

const tabs = [
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'broadcast', label: 'Broadcast', icon: Radio },
]

function AnnouncementCard({ item, onEdit }) {
  return (
    <article className={`comm-ann-card comm-accent-${item.accent}`}>
      <div className="comm-ann-top">
        <h3>{item.title}</h3>
        <div className="comm-ann-tags">
          <span className={`comm-priority comm-priority-${item.priorityTone}`}>{item.priority}</span>
          <span className="comm-published">Published</span>
          <button type="button" className="um-action-btn comm-ann-edit" aria-label="Edit" onClick={() => onEdit(item)}>
            <Pencil size={16} />
          </button>
        </div>
      </div>
      <p className="comm-ann-body">{item.content}</p>
      <div className="comm-ann-foot">
        <span><User size={14} /> {item.audience}</span>
        <span><Calendar size={14} /> {item.date}</span>
        <span><User size={14} /> {item.author}</span>
        {item.expires && <span><Clock size={14} /> {item.expires}</span>}
      </div>
    </article>
  )
}

function NotificationsPanel({ groups }) {
  return (
    <div className="card um-card comm-notif-panel">
      {groups.map((group) => (
        <div key={group.id ?? group.label} className="comm-notif-group">
          <h3 className="comm-notif-label">{group.label}</h3>
          {group.items.map((item) => {
            const Icon = resolveIcon(item.icon)
            return (
              <div key={item.id} className="comm-notif-row">
                <div className={`comm-notif-icon icon-${item.tone}`}>
                  <Icon size={16} />
                </div>
                <div className="comm-notif-text">
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
                <span className="comm-notif-time">{item.time}</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function BroadcastPanel({ channels, recipientGroups, broadcastStats }) {
  const { showToast } = useToast()
  const [channel, setChannel] = useState(channels[0]?.key || 'email')
  const [recipient, setRecipient] = useState(recipientGroups[0]?.key || 'students')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')

  const handleSend = () => {
    const { valid, errors: fieldErrors } = runValidation({
      subject: [() => validateRequired(subject, 'Subject')],
      message: [() => validateRequired(message, 'Message')],
    })
    setErrors(fieldErrors)
    if (!valid) {
      setFormMessage('Please fix the errors below.')
      return
    }
    setFormMessage('')
    showToast(`Broadcast sent via ${channel} to ${recipient}`, 'success')
    setSubject('')
    setMessage('')
  }

  return (
    <div className="comm-broadcast-grid">
      <div className="card comm-broadcast-form">
        <div className="comm-section-head">
          <Radio size={18} /> Send Broadcast
        </div>

        <FormAlert type="error" message={formMessage} />

        <p className="comm-field-label">Broadcast Channel</p>
        <div className="comm-channel-grid">
          {channels.map((ch) => {
            const Icon = resolveIcon(ch.icon)
            const key = ch.key || String(ch.id)
            return (
              <button
                key={key}
                type="button"
                className={`comm-channel-card${channel === key ? ' active' : ''}`}
                onClick={() => setChannel(key)}
              >
                <Icon size={18} />
                <strong>{ch.label}</strong>
                <span>{ch.desc}</span>
              </button>
            )
          })}
        </div>

        <p className="comm-field-label">Recipient Group</p>
        <div className="comm-recipient-grid">
          {recipientGroups.map((group) => {
            const key = group.key || String(group.id)
            return (
              <button
                key={key}
                type="button"
                className={`comm-recipient-card${recipient === key ? ' active' : ''}`}
                onClick={() => setRecipient(key)}
              >
                <Users size={16} />
                <span>{group.label}</span>
                {group.count != null && <strong>{group.count}</strong>}
              </button>
            )
          })}
        </div>

        <FormField label="Subject" error={errors.subject}>
          <input
            type="text"
            className="comm-input"
            placeholder="Eg Term 2 Fee Reminder"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </FormField>

        <FormField label="Message" error={errors.message}>
          <textarea
            className="comm-input comm-textarea"
            placeholder="Write your message........"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </FormField>

        <div className="comm-broadcast-actions">
          <button type="button" className="btn btn-primary" onClick={handleSend}>
            <Send size={16} /> Send Broadcast
          </button>
        </div>
      </div>

      <div className="card comm-broadcast-stats">
        <div className="comm-section-head">
          <Radio size={18} /> Stats Broadcast
        </div>
        <div className="comm-stat-list">
          {broadcastStats.map(({ id, label, value, tone, icon }) => {
            const Icon = resolveIcon(icon)
            return (
              <div key={id ?? label} className={`comm-stat-card comm-stat-${tone}`}>
                <div className={`comm-stat-icon icon-${tone}`}><Icon size={18} /></div>
                <div>
                  <div className="comm-stat-value">{value}</div>
                  <div className="comm-stat-label">{label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Communication() {
  const {
    announcements,
    notificationGroups,
    broadcastStats,
    communicationChannels,
    recipientGroups,
  } = useData()
  const [activeTab, setActiveTab] = useState('announcements')
  const [modalOpen, setModalOpen] = useState(false)
  const [editAnnouncement, setEditAnnouncement] = useState(null)

  const closeAnnouncementModal = () => {
    setModalOpen(false)
    setEditAnnouncement(null)
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Communication</h1>
          <p>Announcements, notifications and broadcasts</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-primary" onClick={() => { setEditAnnouncement(null); setModalOpen(true) }}>
            <Plus size={18} /> New Announcememnt
          </button>
        </div>
      </div>

      <div className="page-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`page-tab${activeTab === id ? ' active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'announcements' && (
        <div className="comm-ann-list">
          {announcements.items.map((item) => (
            <AnnouncementCard key={item.id} item={item} onEdit={setEditAnnouncement} />
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <NotificationsPanel groups={notificationGroups} />
      )}
      {activeTab === 'broadcast' && (
        <BroadcastPanel
          channels={communicationChannels}
          recipientGroups={recipientGroups}
          broadcastStats={broadcastStats}
        />
      )}

      <NewAnnouncementModal
        open={modalOpen || !!editAnnouncement}
        onClose={closeAnnouncementModal}
        announcement={editAnnouncement}
      />
    </>
  )
}
