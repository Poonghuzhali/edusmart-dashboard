import { useMemo, useState, useEffect } from 'react'
import { Close, Calendar, ChevronDown, CalendarPlus, User, Clock } from '../icons.jsx'
import { FormField, FormAlert } from './FormField.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { validateRequired, validatePriority, runValidation } from '../utils/validation.js'
import { sendAnnouncementEmail } from '../utils/announcementEmail.js'

const priorityToneMap = {
  high: 'red',
  medium: 'orange',
  low: 'blue',
}

function RecentAnnouncementItem({ item }) {
  return (
    <article className={`comm-ann-card comm-accent-${item.accent} ann-recent-card`}>
      <div className="comm-ann-top">
        <h3>{item.title}</h3>
        <span className={`comm-priority comm-priority-${item.priorityTone}`}>{item.priority}</span>
      </div>
      <p className="comm-ann-body ann-recent-body">{item.content}</p>
      <div className="comm-ann-foot ann-recent-foot">
        <span><User size={12} /> {item.audience}</span>
        <span><Calendar size={12} /> {item.date}</span>
        {item.expires && <span><Clock size={12} /> {item.expires}</span>}
      </div>
    </article>
  )
}

export default function NewAnnouncementModal({ open, onClose, showRecentList = false, announcement = null }) {
  const { announcements, audienceOptions } = useData()
  const { showToast } = useToast()
  const isEdit = !!announcement
  const [title, setTitle] = useState('')
  const [audience, setAudience] = useState(audienceOptions[0] || 'Everyone')
  const [audienceOpen, setAudienceOpen] = useState(false)
  const [priority, setPriority] = useState('')
  const [content, setContent] = useState('')
  const [publishMode, setPublishMode] = useState('now')
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')
  const [sending, setSending] = useState(false)

  const recentAnnouncements = useMemo(() => {
    return [...announcements.items]
      .sort((a, b) => {
        const dateDiff = new Date(b.date) - new Date(a.date)
        if (dateDiff !== 0) return dateDiff
        return (b.id ?? 0) - (a.id ?? 0)
      })
      .slice(0, 5)
  }, [announcements.items])

  useEffect(() => {
    if (!open) return
    if (announcement) {
      setTitle(announcement.title || '')
      setAudience(announcement.audience || audienceOptions[0] || 'Everyone')
      setPriority(announcement.priority || '')
      setContent(announcement.content || '')
      setPublishMode(announcement.expires === 'Scheduled' ? 'schedule' : 'now')
      setErrors({})
      setFormMessage('')
    } else {
      setTitle('')
      setAudience(audienceOptions[0] || 'Everyone')
      setPriority('')
      setContent('')
      setPublishMode('now')
      setErrors({})
      setFormMessage('')
    }
  }, [open, announcement, audienceOptions])

  if (!open) return null

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { valid, errors: fieldErrors } = runValidation({
      title: [() => validateRequired(title, 'Title')],
      priority: [() => validatePriority(priority)],
      content: [() => validateRequired(content, 'Content')],
      audience: [() => validateRequired(audience, 'Target audience')],
    })
    setErrors(fieldErrors)
    if (!valid) {
      setFormMessage('Please fix the errors below.')
      return
    }

    const priorityNorm = priority.trim()
    const toneKey = priorityNorm.toLowerCase()
    const priorityTone = priorityToneMap[toneKey] || 'orange'
    const payload = {
      title: title.trim(),
      content: content.trim(),
      priority: priorityNorm.charAt(0).toUpperCase() + priorityNorm.slice(1).toLowerCase(),
      priorityTone,
      accent: priorityTone,
      audience,
      expires: publishMode === 'schedule' ? 'Scheduled' : undefined,
    }

    if (isEdit) {
      announcements.update(announcement.id, payload)
      showToast('Announcement updated', 'success')
      handleClose()
      return
    }

    const newAnnouncement = {
      ...payload,
      date: new Date().toISOString().slice(0, 10),
      author: 'By Admin Office',
    }

    announcements.add(newAnnouncement)
    setSending(true)
    try {
      await sendAnnouncementEmail(newAnnouncement)
      showToast('Announcement published and sent to your email', 'success')
    } catch {
      showToast('Announcement published, but email could not be sent. Check your inbox to activate FormSubmit once.', 'error')
    } finally {
      setSending(false)
      handleClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className={`modal-dialog modal-dialog--compact${showRecentList ? ' modal-dialog--announcement' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header modal-header--compact">
          <h2 className="modal-title">{isEdit ? 'Edit Announcement' : 'New Announcememnt'}</h2>
          <button type="button" className="modal-close" onClick={handleClose} aria-label="Close">
            <Close size={20} />
          </button>
        </div>

        <div className={showRecentList ? 'ann-modal-layout' : undefined}>
        <form
          className="modal-body modal-body--compact"
          onSubmit={handleSubmit}
        >
          <FormAlert type="error" message={formMessage} />
          <div className="modal-form">
            <div className="modal-row">
              <FormField label="Title" error={errors.title} full>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Eg sports day"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormField>
            </div>
            <div className="modal-row modal-row--2">
              <FormField label="Target Audience" error={errors.audience}>
                <div className="modal-select-wrap">
                  <button
                    type="button"
                    className={`modal-select${audienceOpen ? ' open' : ''}`}
                    onClick={() => setAudienceOpen((v) => !v)}
                  >
                    <Calendar size={16} />
                    <span>{audience}</span>
                    <ChevronDown size={16} />
                  </button>
                  {audienceOpen && (
                    <ul className="modal-select-menu">
                      {audienceOptions.map((opt) => (
                        <li key={opt}>
                          <button
                            type="button"
                            className={`modal-select-option${audience === opt ? ' selected' : ''}`}
                            onClick={() => { setAudience(opt); setAudienceOpen(false) }}
                          >
                            {opt}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FormField>
              <FormField label="Priortiy" error={errors.priority}>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Low, Medium, High"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
              </FormField>
            </div>
            <div className="modal-row">
              <FormField label="Content" error={errors.content} full>
                <textarea
                  className="modal-input modal-textarea"
                  placeholder="Write your announcement content here..."
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </FormField>
            </div>
            <div className="modal-row">
              <span className="modal-label">Publish Time</span>
              <div className="comm-publish-btns">
                <button
                  type="button"
                  className={`comm-publish-btn${publishMode === 'now' ? ' active' : ''}`}
                  onClick={() => setPublishMode('now')}
                >
                  Publish Now
                </button>
                <button
                  type="button"
                  className={`comm-publish-btn${publishMode === 'schedule' ? ' active' : ''}`}
                  onClick={() => setPublishMode('schedule')}
                >
                  Schedule <CalendarPlus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn modal-btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary modal-btn-submit" disabled={sending}>
              {sending ? 'Sending…' : (isEdit ? 'Save Changes' : 'Publish')}
            </button>
          </div>
        </form>

        {showRecentList && (
          <aside className="ann-recent-panel">
            <h3 className="ann-recent-title">Latest Announcements</h3>
            <div className="ann-recent-list">
              {recentAnnouncements.length === 0 ? (
                <p className="ann-recent-empty">No announcements yet.</p>
              ) : (
                recentAnnouncements.map((item) => (
                  <RecentAnnouncementItem key={item.id} item={item} />
                ))
              )}
            </div>
          </aside>
        )}
        </div>
      </div>
    </div>
  )
}
