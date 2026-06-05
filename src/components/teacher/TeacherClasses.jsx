import { useState } from 'react'
import { Book, Users, MapPin, Eye, CalendarCheck, Close } from '../../icons.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { FormField } from '../FormField.jsx'
import { validateRequired, runValidation } from '../../utils/validation.js'

const emptyForm = { name: '', subject: '', room: '', schedule: '', students: '' }

export default function TeacherClasses({ onNavigate }) {
  const { teacherClasses, setTeacherClasses } = useData()
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm)
    setErrors({})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { valid, errors: nextErrors } = runValidation({
      name: [() => validateRequired(form.name, 'Class name')],
      subject: [() => validateRequired(form.subject, 'Subject')],
      room: [() => validateRequired(form.room, 'Room')],
      schedule: [() => validateRequired(form.schedule, 'Schedule')],
    })
    setErrors(nextErrors)
    if (!valid) {
      showToast('Please fix the errors before adding the class', 'error')
      return
    }

    const students = parseInt(form.students, 10) || 0
    setTeacherClasses((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name.trim(),
        subject: form.subject.trim(),
        students,
        room: form.room.trim(),
        schedule: form.schedule.trim(),
      },
    ])
    showToast('Class added successfully')
    closeModal()
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>My Classes</h1>
          <p>Manage at your assigned classes and subjects</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Book size={18} /> New Class
          </button>
        </div>
      </div>

      <div className="tch-class-grid">
        {teacherClasses.map((cls) => (
          <article key={cls.id} className="tch-class-card">
            <div className="tch-class-top">
              <div className="tch-class-icon"><Book size={18} /></div>
              <div className="tch-class-title">
                <strong>{cls.name}</strong>
                <span>{cls.subject}</span>
              </div>
            </div>
            <div className="tch-class-meta">
              <span><Users size={15} /> {cls.students}</span>
              <span><MapPin size={15} /> {cls.room}</span>
            </div>
            <span className="tch-schedule-tag">{cls.schedule}</span>
            <div className="tch-class-actions">
              <button type="button" className="btn btn-primary tch-class-btn" onClick={() => onNavigate?.('students')}>
                <Eye size={16} /> View Students
              </button>
              <button type="button" className="btn btn-primary tch-class-btn" onClick={() => onNavigate?.('attendance')}>
                <CalendarCheck size={16} /> Attendance
              </button>
            </div>
          </article>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-dialog modal-dialog--compact"
            onClick={(ev) => ev.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-class-title"
          >
            <div className="modal-header modal-header--compact">
              <h2 id="new-class-title" className="modal-title">New Class</h2>
              <button type="button" className="modal-close" onClick={closeModal} aria-label="Close">
                <Close size={20} />
              </button>
            </div>
            <form className="modal-body modal-body--compact" onSubmit={handleSubmit}>
              <div className="modal-form">
                <div className="modal-row modal-row--2">
                  <FormField label="Class Name" error={errors.name}>
                    <input
                      type="text"
                      className="modal-input"
                      placeholder="e.g. Class 10-A"
                      value={form.name}
                      onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: null })) }}
                    />
                  </FormField>
                  <FormField label="Subject" error={errors.subject}>
                    <input
                      type="text"
                      className="modal-input"
                      placeholder="e.g. Mathematics"
                      value={form.subject}
                      onChange={(e) => { setForm((p) => ({ ...p, subject: e.target.value })); setErrors((p) => ({ ...p, subject: null })) }}
                    />
                  </FormField>
                </div>
                <div className="modal-row modal-row--2">
                  <FormField label="Room" error={errors.room}>
                    <input
                      type="text"
                      className="modal-input"
                      placeholder="e.g. Room 201"
                      value={form.room}
                      onChange={(e) => { setForm((p) => ({ ...p, room: e.target.value })); setErrors((p) => ({ ...p, room: null })) }}
                    />
                  </FormField>
                  <FormField label="Students (optional)">
                    <input
                      type="number"
                      className="modal-input"
                      placeholder="0"
                      min={0}
                      value={form.students}
                      onChange={(e) => setForm((p) => ({ ...p, students: e.target.value }))}
                    />
                  </FormField>
                </div>
                <div className="modal-row">
                  <FormField label="Schedule" error={errors.schedule} full>
                    <input
                      type="text"
                      className="modal-input"
                      placeholder="e.g. Mon, Wed, Fri 9:00AM"
                      value={form.schedule}
                      onChange={(e) => { setForm((p) => ({ ...p, schedule: e.target.value })); setErrors((p) => ({ ...p, schedule: null })) }}
                    />
                  </FormField>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn modal-btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary modal-btn-submit">Add Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
