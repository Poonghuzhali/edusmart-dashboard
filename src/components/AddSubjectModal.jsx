import { useState, useEffect } from 'react'
import { Close } from '../icons.jsx'
import { FormField, FormAlert } from './FormField.jsx'
import GradeSelect from './GradeSelect.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { validateRequired, runValidation } from '../utils/validation.js'

export default function AddSubjectModal({ open, onClose, subject = null }) {
  const { subjects } = useData()
  const { showToast } = useToast()
  const isEdit = !!subject
  const [grade, setGrade] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [teacher, setTeacher] = useState('')
  const [hours, setHours] = useState('')
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')

  const reset = () => {
    setGrade('')
    setCode('')
    setName('')
    setTeacher('')
    setHours('')
    setErrors({})
    setFormMessage('')
  }

  useEffect(() => {
    if (!open) return
    if (subject) {
      setGrade(subject.grade || '')
      setCode(subject.code || '')
      setName(subject.name || '')
      setTeacher(subject.teacher || '')
      setHours(subject.hours || '')
      setErrors({})
      setFormMessage('')
    } else {
      reset()
    }
  }, [open, subject])

  if (!open) return null

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { valid, errors: fieldErrors } = runValidation({
      grade: [() => validateRequired(grade, 'Grade')],
      code: [() => validateRequired(code, 'Subject code')],
      name: [() => validateRequired(name, 'Subject name')],
      teacher: [() => validateRequired(teacher, 'Teacher')],
      hours: [() => validateRequired(hours, 'Weekly hours')],
    })
    setErrors(fieldErrors)
    if (!valid) {
      setFormMessage('Please fix the errors below.')
      return
    }

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      teacher: teacher.trim(),
      hours: hours.trim().endsWith('h') ? hours.trim() : `${hours.trim()}h`,
      grade,
    }

    if (isEdit) {
      subjects.update(subject.id, payload)
      showToast('Subject updated successfully', 'success')
    } else {
      subjects.add(payload)
      showToast('Subject added successfully', 'success')
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
        aria-labelledby="add-subject-title"
      >
        <div className="modal-header modal-header--compact">
          <h2 id="add-subject-title" className="modal-title">{isEdit ? 'Edit Subject' : 'Add New Subject'}</h2>
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
            <div className="modal-row modal-row--2">
              <FormField label="Grade" error={errors.grade}>
                <GradeSelect value={grade} onChange={setGrade} />
              </FormField>
              <FormField label="Subject code" error={errors.code}>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="MATH101"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </FormField>
            </div>
            <div className="modal-row">
              <FormField label="Subject Name" error={errors.name} full>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Mathematics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormField>
            </div>
            <div className="modal-row">
              <FormField label="Teacher" error={errors.teacher} full>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Teacher Name"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                />
              </FormField>
            </div>
            <div className="modal-row">
              <FormField label="Weekly hours" error={errors.hours} full>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="eg 6hrs"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn modal-btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary modal-btn-submit">
              {isEdit ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
