import { useState } from 'react'
import { Logout, Save, Bell, Lightbulb } from '../../icons.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { FormField } from '../FormField.jsx'
import { validateRequired, validateEmail, validatePhone, runValidation } from '../../utils/validation.js'

export default function TeacherSettings({ onLogout }) {
  const {
    teacherProfile,
    setTeacherProfile,
    teacherNotifications,
    setTeacherNotifications,
  } = useData()
  const { showToast } = useToast()
  const [form, setForm] = useState({ ...teacherProfile })
  const [errors, setErrors] = useState({})

  const handleSave = (e) => {
    e.preventDefault()
    const { valid, errors: nextErrors } = runValidation({
      fullName: [() => validateRequired(form.fullName, 'Full name')],
      email: [() => validateEmail(form.email)],
      phone: [() => validatePhone(form.phone)],
      subject: [() => validateRequired(form.subject, 'Subject')],
      department: [() => validateRequired(form.department, 'Department')],
    })
    setErrors(nextErrors)
    if (!valid) {
      showToast('Please fix the errors before saving', 'error')
      return
    }

    setTeacherProfile({
      ...form,
      displayName: form.fullName,
      subtitle: `${form.subject}. ${form.department}`,
    })
    showToast('Profile saved successfully')
  }

  const toggleNotification = (id) => {
    setTeacherNotifications((prev) => prev.map((n) => (
      n.id === id ? { ...n, enabled: !n.enabled } : n
    )))
    const item = teacherNotifications.find((n) => n.id === id)
    const next = !item?.enabled
    showToast(`${item?.title} notifications ${next ? 'enabled' : 'disabled'}`)
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences and profile</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-primary" onClick={onLogout}>
            <Logout size={18} /> Log Out
          </button>
        </div>
      </div>

      <div className="card tch-settings-card">
        <div className="tch-settings-suggest">
          <Lightbulb size={16} /> Suggestions
        </div>
        <div className="tch-profile-head">
          <div className="tch-profile-initials">{teacherProfile.initials}</div>
          <div>
            <strong>{teacherProfile.displayName}</strong>
            <p>{teacherProfile.subtitle}</p>
            <span>{teacherProfile.joined}</span>
          </div>
        </div>

        <form className="tch-settings-form" onSubmit={handleSave}>
          <div className="set-row-2">
            <FormField label="Full Name" error={errors.fullName}>
              <input
                type="text"
                className="set-input"
                value={form.fullName}
                onChange={(e) => { setForm((p) => ({ ...p, fullName: e.target.value })); setErrors((p) => ({ ...p, fullName: null })) }}
              />
            </FormField>
            <FormField label="Email Address" error={errors.email}>
              <input
                type="email"
                className="set-input"
                value={form.email}
                onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setErrors((p) => ({ ...p, email: null })) }}
              />
            </FormField>
          </div>
          <div className="set-row-2">
            <FormField label="Phone number" error={errors.phone}>
              <input
                type="text"
                className="set-input"
                value={form.phone}
                onChange={(e) => { setForm((p) => ({ ...p, phone: e.target.value })); setErrors((p) => ({ ...p, phone: null })) }}
              />
            </FormField>
            <FormField label="Subject" error={errors.subject}>
              <input
                type="text"
                className="set-input"
                value={form.subject}
                onChange={(e) => { setForm((p) => ({ ...p, subject: e.target.value })); setErrors((p) => ({ ...p, subject: null })) }}
              />
            </FormField>
          </div>
          <FormField label="Department" error={errors.department} full>
            <input
              type="text"
              className="set-input"
              value={form.department}
              onChange={(e) => { setForm((p) => ({ ...p, department: e.target.value })); setErrors((p) => ({ ...p, department: null })) }}
            />
          </FormField>
          <FormField label="Bio" full>
            <textarea
              className="set-input modal-textarea"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            />
          </FormField>
          <div className="set-panel-foot">
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="card tch-settings-card tch-notify-card">
        <div className="tch-notify-head"><Bell size={18} /> Notification</div>
        {teacherNotifications.map((n) => (
          <div key={n.id} className="tch-notify-row">
            <div>
              <strong>{n.title}</strong>
              <p>{n.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={n.enabled}
              className={`toggle-switch${n.enabled ? ' on' : ''}`}
              onClick={() => toggleNotification(n.id)}
            >
              <span className="toggle-knob" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
