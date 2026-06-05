import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Plus, Search, Filter, ChevronDown, FileText, Calendar, Upload,
  Close,
} from '../../icons.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { FormField } from '../FormField.jsx'
import { validateRequired, validateDate, runValidation } from '../../utils/validation.js'
import { downloadAssignmentSubmission } from '../../utils/download.js'
import { resolveIcon } from '../../utils/iconsMap.js'

const emptyForm = { title: '', classTag: '', due: '' }

function StatusPill({ status, tone }) {
  return <span className={`tch-asg-status tone-${tone}`}>{status}</span>
}

export default function TeacherAssignments() {
  const {
    teacherAssignments,
    setTeacherAssignments,
    teacherAssignmentStats,
    teacherAssignmentFilters,
  } = useData()
  const { classOptions, statusOptions } = teacherAssignmentFilters
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState(classOptions[0])
  const [statusFilter, setStatusFilter] = useState(statusOptions[0])
  const [classOpen, setClassOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const classRef = useRef(null)
  const statusRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (classRef.current && !classRef.current.contains(e.target)) setClassOpen(false)
      if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() => {
    let list = teacherAssignments
    if (classFilter !== 'All Classes') {
      list = list.filter((a) => a.classTag === classFilter)
    }
    if (statusFilter !== 'All Status') {
      list = list.filter((a) => a.status === statusFilter)
    }
    const q = search.toLowerCase()
    if (q) list = list.filter((a) => a.title.toLowerCase().includes(q))
    return list
  }, [search, classFilter, statusFilter, teacherAssignments])

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm)
    setErrors({})
  }

  const handleCreate = (e) => {
    e.preventDefault()
    const { valid, errors: nextErrors } = runValidation({
      title: [() => validateRequired(form.title, 'Title')],
      classTag: [() => validateRequired(form.classTag, 'Class')],
      due: [() => validateDate(form.due, 'Due date')],
    })
    setErrors(nextErrors)
    if (!valid) {
      showToast('Please fix the errors before creating the assignment', 'error')
      return
    }

    setTeacherAssignments((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: form.title.trim(),
        files: 0,
        classTag: form.classTag,
        due: form.due.trim(),
        submitted: 0,
        total: 30,
        pct: 0,
        status: 'Active',
        statusTone: 'green',
        action: 'Grade',
      },
    ])
    showToast('Assignment created successfully')
    closeModal()
  }

  const handleDownload = (assignment) => {
    try {
      downloadAssignmentSubmission(assignment)
      showToast('Assignment exported successfully')
    } catch (err) {
      showToast(err.message || 'Failed to export assignment', 'error')
    }
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Assignments</h1></div>
        <div className="page-actions">
          <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Create Assignment
          </button>
        </div>
      </div>

      <div className="tch-asg-stats">
        {teacherAssignmentStats.map(({ id, value, label, icon, tone }) => {
          const Icon = resolveIcon(icon)
          return (
            <div key={id} className={`tch-asg-stat tone-${tone}`}>
              <div className={`tch-asg-stat-icon icon-${tone}`}><Icon size={20} /></div>
              <div>
                <div className="tch-asg-stat-val">{value}</div>
                <div className="tch-asg-stat-label">{label}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card um-card">
        <div className="um-toolbar">
          <div className="um-search">
            <Search size={18} />
            <input type="text" placeholder="Search assignments..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="um-filters">
            <div className="att-filter-wrap" ref={classRef}>
              <button type="button" className={`um-select att-filter-btn${classOpen ? ' open' : ''}`} onClick={() => setClassOpen((v) => !v)}>
                <Filter size={16} /> {classFilter} <ChevronDown size={16} />
              </button>
              {classOpen && (
                <ul className="att-dept-menu fee-month-menu">
                  {classOptions.map((c) => (
                    <li key={c}><button type="button" className={`att-dept-option${classFilter === c ? ' selected' : ''}`} onClick={() => { setClassFilter(c); setClassOpen(false) }}>{c}</button></li>
                  ))}
                </ul>
              )}
            </div>
            <div className="att-filter-wrap" ref={statusRef}>
              <button type="button" className={`um-select att-filter-btn${statusOpen ? ' open' : ''}`} onClick={() => setStatusOpen((v) => !v)}>
                {statusFilter} <ChevronDown size={16} />
              </button>
              {statusOpen && (
                <ul className="att-dept-menu fee-month-menu">
                  {statusOptions.map((s) => (
                    <li key={s}><button type="button" className={`att-dept-option${statusFilter === s ? ' selected' : ''}`} onClick={() => { setStatusFilter(s); setStatusOpen(false) }}>{s}</button></li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="um-table-wrap">
          <table className="um-table tch-asg-table">
            <thead>
              <tr>
                <th>Assignment Title</th>
                <th>Class</th>
                <th>Due Date</th>
                <th>Submissions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.title}</strong>
                    <p className="tch-asg-files">
                      <FileText size={14} />
                      {a.group ? 'Group Project' : `${a.files} File${a.files !== 1 ? 's' : ''} attached`}
                    </p>
                  </td>
                  <td><span className="tch-class-pill">{a.classTag}</span></td>
                  <td className={a.dueLate ? 'tch-due-late' : ''}>
                    <Calendar size={14} /> {a.due}
                  </td>
                  <td>
                    <div className="tch-sub-wrap">
                      <span>{a.submitted} / {a.total} {a.groupLabel || 'Submitted'} {a.pct}%</span>
                      <div className="tch-sub-bar"><div className={`tch-sub-fill${a.pct === 100 ? ' full' : ''}`} style={{ width: `${a.pct}%` }} /></div>
                    </div>
                  </td>
                  <td><StatusPill status={a.status} tone={a.statusTone} /></td>
                  <td>
                    <div className="tch-asg-actions">
                      <button type="button" className="btn btn-primary btn-sm">{a.action}</button>
                      <button type="button" className="um-action-btn" aria-label="Download" onClick={() => handleDownload(a)}>
                        <Upload size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-dialog modal-dialog--compact"
            onClick={(ev) => ev.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-assignment-title"
          >
            <div className="modal-header modal-header--compact">
              <h2 id="create-assignment-title" className="modal-title">Create Assignment</h2>
              <button type="button" className="modal-close" onClick={closeModal} aria-label="Close">
                <Close size={20} />
              </button>
            </div>
            <form className="modal-body modal-body--compact" onSubmit={handleCreate}>
              <div className="modal-form">
                <div className="modal-row">
                  <FormField label="Title" error={errors.title} full>
                    <input
                      type="text"
                      className="modal-input"
                      placeholder="Assignment title"
                      value={form.title}
                      onChange={(e) => { setForm((p) => ({ ...p, title: e.target.value })); setErrors((p) => ({ ...p, title: null })) }}
                    />
                  </FormField>
                </div>
                <div className="modal-row modal-row--2">
                  <FormField label="Class" error={errors.classTag}>
                    <select
                      className="modal-input"
                      value={form.classTag}
                      onChange={(e) => { setForm((p) => ({ ...p, classTag: e.target.value })); setErrors((p) => ({ ...p, classTag: null })) }}
                    >
                      <option value="">Select class</option>
                      {classOptions.filter((c) => c !== 'All Classes').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Due Date" error={errors.due}>
                    <input
                      type="text"
                      className="modal-input"
                      placeholder="DD-MM-YYYY"
                      value={form.due}
                      onChange={(e) => { setForm((p) => ({ ...p, due: e.target.value })); setErrors((p) => ({ ...p, due: null })) }}
                    />
                  </FormField>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn modal-btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary modal-btn-submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
