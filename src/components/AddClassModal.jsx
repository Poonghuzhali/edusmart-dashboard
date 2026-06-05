import { useState, useEffect } from 'react'
import { Close } from '../icons.jsx'
import { FormField, FormAlert } from './FormField.jsx'
import GradeSelect from './GradeSelect.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { validateRequired, runValidation } from '../utils/validation.js'

function parseClassSection(title) {
  const match = (title || '').match(/Section\s+(\w+)/i)
  return match ? match[1] : ''
}

export default function AddClassModal({ open, onClose, classItem = null }) {
  const { classes } = useData()
  const { showToast } = useToast()
  const isEdit = !!classItem
  const [grade, setGrade] = useState('')
  const [section, setSection] = useState('')
  const [room, setRoom] = useState('')
  const [teacher, setTeacher] = useState('')
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')

  const reset = () => {
    setGrade('')
    setSection('')
    setRoom('')
    setTeacher('')
    setErrors({})
    setFormMessage('')
  }

  useEffect(() => {
    if (!open) return
    if (classItem) {
      setGrade(classItem.gradeTag || '')
      setSection(parseClassSection(classItem.title))
      setRoom(classItem.room || '')
      setTeacher(classItem.teacher || '')
      setErrors({})
      setFormMessage('')
    } else {
      reset()
    }
  }, [open, classItem])

  if (!open) return null

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { valid, errors: fieldErrors } = runValidation({
      grade: [() => validateRequired(grade, 'Grade')],
      section: [() => validateRequired(section, 'Section')],
      room: [() => validateRequired(room, 'Room')],
      teacher: [() => validateRequired(teacher, 'Class teacher')],
    })
    setErrors(fieldErrors)
    if (!valid) {
      setFormMessage('Please fix the errors below.')
      return
    }

    const title = `${grade} - Section ${section.toUpperCase()}`
    const payload = {
      title,
      room: room.trim(),
      gradeTag: grade,
      teacher: teacher.trim(),
    }

    if (isEdit) {
      classes.update(classItem.id, payload)
      showToast('Class updated successfully', 'success')
    } else {
      classes.add({
        ...payload,
        students: 0,
        schedule: 'Mon - Fri 8:00-15:00',
      })
      showToast('Class added successfully', 'success')
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
        aria-labelledby="add-class-title"
      >
        <div className="modal-header modal-header--compact">
          <h2 id="add-class-title" className="modal-title">{isEdit ? 'Edit Class' : 'Add New Class'}</h2>
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
              <FormField label="Section" error={errors.section}>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="A,B,C..."
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </FormField>
            </div>
            <div className="modal-row">
              <FormField label="Room" error={errors.room} full>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="eg Room 101"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </FormField>
            </div>
            <div className="modal-row">
              <FormField label="Class Teacher" error={errors.teacher} full>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Teacher Name"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn modal-btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary modal-btn-submit">
              {isEdit ? 'Save Changes' : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
