import { useState } from 'react'
import {
  Building, Shield, Calendar, Plug, Filter, ChevronDown, Plus,
  CreditCard, Eye, EyeOff, Check,
} from '../icons.jsx'
import { FormField, FormAlert } from './FormField.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { resolveIcon } from '../utils/iconsMap.js'
import {
  validateRequired, validateEmail, validatePhone, runValidation,
} from '../utils/validation.js'

const tabs = [
  { id: 'profile', label: 'School Profile', icon: Building },
  { id: 'roles', label: 'Roles & permission', icon: Shield },
  { id: 'year', label: 'Academic Year', icon: Calendar },
  { id: 'integration', label: 'Integration', icon: Plug },
]

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`toggle-switch${checked ? ' on' : ''}`}
      onClick={() => onChange?.(!checked)}
    >
      <span className="toggle-knob" />
    </button>
  )
}

function MaskedInput({ value, label, onChange }) {
  const [visible, setVisible] = useState(false)
  return (
    <label className="set-field">
      <span className="set-label">{label}</span>
      <div className="set-masked">
        <input
          type={visible ? 'text' : 'password'}
          className="set-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="button" className="set-eye-btn" onClick={() => setVisible((v) => !v)} aria-label="Toggle visibility">
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  )
}

function SchoolProfilePanel({ profile, setSchoolProfile, boardOptions, showToast }) {
  const [form, setForm] = useState(profile)
  const [boardOpen, setBoardOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleSave = () => {
    const { valid, errors: fieldErrors } = runValidation({
      schoolName: [() => validateRequired(form.schoolName, 'School name')],
      email: [() => validateEmail(form.email)],
      phone: [() => validatePhone(form.phone)],
      address: [() => validateRequired(form.address, 'Address')],
    })
    setErrors(fieldErrors)
    if (!valid) {
      setFormMessage('Please fix the errors below.')
      return
    }
    setSchoolProfile(form)
    setFormMessage('')
    showToast('School profile saved', 'success')
  }

  return (
    <div className="card set-panel">
      <h2 className="set-panel-title">School Profile</h2>
      <FormAlert type="error" message={formMessage} />
      <div className="set-logo-row">
        <div className="set-logo-circle" />
        <div>
          <button type="button" className="btn btn-ghost set-upload-btn">Upload Logo</button>
          <p className="set-logo-hint">PNG or JPG. Max 2MB. Recommended 200×200px</p>
        </div>
      </div>
      <div className="set-form">
        <FormField label="School Name" error={errors.schoolName} full>
          <input type="text" className="set-input" value={form.schoolName} onChange={(e) => update('schoolName', e.target.value)} />
        </FormField>
        <div className="set-row-2">
          <FormField label="Phone" error={errors.phone}>
            <input type="text" className="set-input" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </FormField>
          <label className="set-field">
            <span className="set-label">Website</span>
            <input type="text" className="set-input" value={form.website} onChange={(e) => update('website', e.target.value)} />
          </label>
        </div>
        <FormField label="Email" error={errors.email} full>
          <input type="email" className="set-input" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </FormField>
        <div className="set-row-2">
          <label className="set-field">
            <span className="set-label">Board / Affiliation</span>
            <div className="set-select-wrap">
              <button type="button" className="set-select" onClick={() => setBoardOpen((v) => !v)}>
                <Filter size={16} /> {form.board} <ChevronDown size={16} />
              </button>
              {boardOpen && (
                <ul className="modal-select-menu">
                  {boardOptions.map((b) => (
                    <li key={b}>
                      <button
                        type="button"
                        className={`modal-select-option${form.board === b ? ' selected' : ''}`}
                        onClick={() => { update('board', b); setBoardOpen(false) }}
                      >
                        {b}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>
          <label className="set-field">
            <span className="set-label">Established Year</span>
            <input type="text" className="set-input" value={form.establishedYear} onChange={(e) => update('establishedYear', e.target.value)} />
          </label>
        </div>
        <FormField label="Address" error={errors.address} full>
          <input type="text" className="set-input" value={form.address} onChange={(e) => update('address', e.target.value)} />
        </FormField>
      </div>
      <div className="set-panel-foot">
        <button type="button" className="btn btn-primary" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  )
}

function RolesPanel({ permissions, setPermissions }) {
  const toggle = (rowIdx, role) => {
    setPermissions((prev) => prev.map((row, i) => (
      i === rowIdx ? { ...row, [role]: !row[role] } : row
    )))
  }

  return (
    <div className="card set-panel set-perm-panel">
      <table className="set-perm-table">
        <thead>
          <tr>
            <th>MODULES</th>
            <th>ADMIN</th>
            <th>TEACHER</th>
            <th>STAFF</th>
            <th>PARENT</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((row, idx) => {
            const Icon = resolveIcon(row.icon)
            return (
              <tr key={row.id ?? row.module}>
                <td>
                  <span className="set-mod-name"><Icon size={16} /> {row.module}</span>
                </td>
                {['admin', 'teacher', 'staff', 'parent'].map((role) => (
                  <td key={role}>
                    <ToggleSwitch checked={row[role]} onChange={() => toggle(idx, role)} />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function AcademicYearPanel({ academicYears, setAcademicYears, showToast }) {
  const handleAddYear = () => {
    const startYear = new Date().getFullYear() + 1
    const label = `${startYear}-${startYear + 1}`
    setAcademicYears((prev) => [
      ...prev,
      {
        id: Date.now(),
        label,
        range: `Apr 1, ${startYear} – Mar 31, ${startYear + 1}`,
        status: 'Future',
      },
    ])
    showToast(`Academic year ${label} added`, 'success')
  }

  return (
    <div className="set-year-wrap">
      <div className="set-year-head">
        <div>
          <h2>Academic Years</h2>
          <p>Manage school academic year periods</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleAddYear}>
          <Plus size={18} /> Add Year
        </button>
      </div>
      <div className="set-year-list">
        {academicYears.map((year) => (
          <div key={year.id} className="set-year-card">
            <div className="set-year-icon"><Calendar size={18} /></div>
            <div className="set-year-info">
              <strong>{year.label}</strong>
              <span>{year.range}</span>
            </div>
            <span className={`set-year-status status-${year.status.toLowerCase()}`}>{year.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function IntegrationCard({ integration, onToggle, onSaveField, showToast }) {
  return (
    <div className="card set-int-card">
      <div className="set-int-head">
        <div className="set-int-title">
          <div className="set-int-icon"><CreditCard size={18} /></div>
          <div>
            <strong>{integration.title}</strong>
            <p>{integration.subtitle}</p>
          </div>
        </div>
        <ToggleSwitch checked={integration.enabled} onChange={(v) => onToggle(integration.id, v)} />
      </div>
      <hr className="set-int-divider" />
      {integration.fields.map((field) => (
        <MaskedInput
          key={field.id ?? field.label}
          label={field.label}
          value={field.value}
          onChange={(val) => onSaveField(integration.id, field.id ?? field.label, val)}
        />
      ))}
      <button
        type="button"
        className="btn btn-primary set-int-save"
        onClick={() => showToast(`${integration.title} settings saved`, 'success')}
      >
        <Check size={16} /> Save
      </button>
    </div>
  )
}

function IntegrationPanel({ integrations, setIntegrations, showToast }) {
  const handleToggle = (id, enabled) => {
    setIntegrations((prev) => prev.map((item) => (
      item.id === id ? { ...item, enabled } : item
    )))
  }

  const handleFieldChange = (integrationId, fieldId, value) => {
    setIntegrations((prev) => prev.map((item) => {
      if (item.id !== integrationId) return item
      return {
        ...item,
        fields: item.fields.map((f) => (
          (f.id === fieldId || f.label === fieldId) ? { ...f, value } : f
        )),
      }
    }))
  }

  return (
    <div className="set-int-grid">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onToggle={handleToggle}
          onSaveField={handleFieldChange}
          showToast={showToast}
        />
      ))}
    </div>
  )
}

export default function SettingsPage() {
  const {
    schoolProfile, setSchoolProfile, permissions, setPermissions,
    academicYears, setAcademicYears, integrations, setIntegrations, boardOptions,
  } = useData()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Configure school profile, permission and integration</p>
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

      {activeTab === 'profile' && (
        <SchoolProfilePanel
          profile={schoolProfile}
          setSchoolProfile={setSchoolProfile}
          boardOptions={boardOptions}
          showToast={showToast}
        />
      )}
      {activeTab === 'roles' && (
        <RolesPanel permissions={permissions} setPermissions={setPermissions} />
      )}
      {activeTab === 'year' && (
        <AcademicYearPanel
          academicYears={academicYears}
          setAcademicYears={setAcademicYears}
          showToast={showToast}
        />
      )}
      {activeTab === 'integration' && (
        <IntegrationPanel
          integrations={integrations}
          setIntegrations={setIntegrations}
          showToast={showToast}
        />
      )}
    </>
  )
}
