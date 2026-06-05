import { useState, useEffect } from 'react'
import { Close } from '../icons.jsx'
import { FormField, FormAlert } from './FormField.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { validateRequired, validateDate, runValidation } from '../utils/validation.js'

const statusToneMap = {
  completed: 'completed',
  scheduled: 'scheduled',
  planning: 'planning',
  upcoming: 'upcoming',
}

export default function AddExamModal({ open, onClose, exam = null }) {
  const { examsAdmin } = useData()
  const { showToast } = useToast()
  const isEdit = !!exam
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('')
  const [grade, setGrade] = useState('')
  const [subject, setSubject] = useState('')
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')

  const reset = () => {
    setTitle('')
    setDate('')
    setStatus('')
    setGrade('')
    setSubject('')
    setErrors({})
    setFormMessage('')
  }

  useEffect(() => {
    if (!open) return
    if (exam) {
      setTitle(exam.title || '')
      setDate(exam.date || '')
      setStatus(exam.status || '')
      setGrade(exam.grade || '')
      setSubject(exam.subject || '')
      setErrors({})
      setFormMessage('')
    } else {
      reset()
    }
  }, [open, exam])

  if (!open) return null

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { valid, errors: fieldErrors } = runValidation({
      title: [() => validateRequired(title, 'Exam title')],
      date: isEdit
        ? [() => validateRequired(date, 'Date')]
        : [() => validateDate(date, 'Date')],
      status: [() => validateRequired(status, 'Status')],
      grade: [() => validateRequired(grade, 'Grade level')],
      subject: [() => validateRequired(subject, 'Subject')],
    })
    setErrors(fieldErrors)
    if (!valid) {
      setFormMessage('Please fix the errors below.')
      return
    }

    const statusNorm = status.trim()
    const statusKey = statusNorm.toLowerCase()
    const payload = {
      title: title.trim(),
      status: statusNorm.charAt(0).toUpperCase() + statusNorm.slice(1).toLowerCase(),
      statusTone: statusToneMap[statusKey] || 'upcoming',
      date: date.trim(),
      grade: grade.trim(),
      subject: subject.trim(),
    }

    if (isEdit) {
      examsAdmin.update(exam.id, payload)
      showToast('Exam updated successfully', 'success')
    } else {
      examsAdmin.add({ ...payload, passed: null })
      showToast('Exam added successfully', 'success')
    }
    handleClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-dialog modal-dialog--compact"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-exam-title"
      >
        <div className="modal-header modal-header--compact">
          <h2 id="add-exam-title" className="modal-title">{isEdit ? 'Edit Exam' : 'Add New Exam'}</h2>
          <button type="button" className="modal-close" onClick={handleClose} aria-label="Close">
            <Close size={20} />
          </button>
        </div>

        <form
          className="modal-body modal-body--compact"
          onSubmit={handleSubmit}
        >
          <FormAlert type="error" message={formMessage} />
          <div className="modal-form">
            <div className="modal-row">
              <FormField label="Exam Title" error={errors.title} full>
                <input type="text" className="modal-input" placeholder="Midterm" value={title} onChange={(e) => setTitle(e.target.value)} />
              </FormField>
            </div>
            <div className="modal-row modal-row--2">
              <FormField label="Date" error={errors.date}>
                <input type="text" className="modal-input" placeholder="DD-MM-YYYY" value={date} onChange={(e) => setDate(e.target.value)} />
              </FormField>
              <FormField label="Status" error={errors.status}>
                <input type="text" className="modal-input" placeholder="Upcoming" value={status} onChange={(e) => setStatus(e.target.value)} />
              </FormField>
            </div>
            <div className="modal-row modal-row--2">
              <FormField label="Grade Level" error={errors.grade}>
                <input type="text" className="modal-input" placeholder="grade 5 -8" value={grade} onChange={(e) => setGrade(e.target.value)} />
              </FormField>
              <FormField label="Subject" error={errors.subject}>
                <input type="text" className="modal-input" placeholder="All subjects" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </FormField>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn modal-btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary modal-btn-submit">
              {isEdit ? 'Save Changes' : 'Add Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
