import { useState, useEffect } from 'react'
import { Upload, User, Close } from '../icons.jsx'
import { FormField, FormAlert } from './FormField.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import {
  validateRequired, validateEmail, validatePhone, validateDate, runValidation,
} from '../utils/validation.js'
import GradeSelect from './GradeSelect.jsx'

function PhotoUpload() {
  return (
    <div className="modal-photo">
      <div className="modal-photo-wrap">
        <div className="modal-photo-circle">
          <User size={36} />
        </div>
        <button type="button" className="modal-photo-btn" aria-label="Upload photo">
          <Upload size={14} />
        </button>
      </div>
      <span className="modal-photo-label">Upload Photo</span>
    </div>
  )
}

function ModalShell({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <Close size={20} />
          </button>
        </div>
        <div className="modal-body">
          <PhotoUpload />
          {children}
        </div>
        {footer}
      </div>
    </div>
  )
}

function splitName(name) {
  const parts = (name || '').trim().split(/\s+/)
  if (parts.length <= 1) return { firstName: parts[0] || '', lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function parseGradeSection(gradeStr) {
  if (!gradeStr) return { grade: '', section: '' }
  const match = gradeStr.match(/^(.+?)\s*-\s*(.+)$/)
  if (match) return { grade: match[1].trim(), section: match[2].trim() }
  return { grade: gradeStr, section: '' }
}

function resetAndClose(reset, onClose) {
  reset()
  onClose()
}

export function AddStudentModal({ open, onClose, student = null }) {
  const { students } = useData()
  const { showToast } = useToast()
  const isEdit = !!student
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [grade, setGrade] = useState('')
  const [section, setSection] = useState('')
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')

  const reset = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')
    setDob('')
    setGrade('')
    setSection('')
    setErrors({})
    setFormMessage('')
  }

  useEffect(() => {
    if (!open) return
    if (student) {
      const { firstName: fn, lastName: ln } = splitName(student.name)
      const { grade: g, section: s } = parseGradeSection(student.grade)
      setFirstName(fn)
      setLastName(ln)
      setEmail(student.email || '')
      setPhone(student.phone || '')
      setDob(student.dob || '')
      setGrade(g)
      setSection(s)
      setErrors({})
      setFormMessage('')
    } else {
      reset()
    }
  }, [open, student])

  if (!open) return null

  const handleClose = () => resetAndClose(reset, onClose)

  const handleSubmit = (e) => {
    e.preventDefault()
    const { valid, errors: fieldErrors } = runValidation({
      firstName: [() => validateRequired(firstName, 'First name')],
      lastName: [() => validateRequired(lastName, 'Last name')],
      email: [() => validateEmail(email)],
      phone: isEdit
        ? (phone ? [() => validatePhone(phone)] : [])
        : [() => validatePhone(phone)],
      dob: isEdit
        ? (dob ? [() => validateDate(dob, 'Date of birth')] : [])
        : [() => validateDate(dob, 'Date of birth')],
      grade: [() => validateRequired(grade, 'Grade')],
      section: [() => validateRequired(section, 'Section')],
    })
    setErrors(fieldErrors)
    if (!valid) {
      setFormMessage('Please fix the errors below.')
      return
    }

    const name = `${firstName.trim()} ${lastName.trim()}`
    const gradeClass = `${grade} - ${section.toUpperCase()}`

    if (isEdit) {
      students.update(student.id, {
        name,
        email: email.trim(),
        grade: gradeClass,
      })
      showToast(`${name} updated successfully`, 'success')
    } else {
      students.add({
        name,
        email: email.trim(),
        studentId: `STU-${Date.now().toString().slice(-5)}`,
        grade: gradeClass,
        guardian: '—',
        relation: '—',
        status: 'Active',
        joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        avatar: Math.floor(Math.random() * 70) + 1,
      })
      showToast(`${name} added successfully`, 'success')
    }
    handleClose()
  }

  return (
    <ModalShell
      title={isEdit ? 'Edit Student' : 'Add New Student'}
      onClose={handleClose}
      footer={(
        <div className="modal-footer">
          <button type="button" className="btn modal-btn-cancel" onClick={handleClose}>Cancel</button>
          <button type="submit" form="add-student-form" className="btn btn-primary modal-btn-submit">
            {isEdit ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      )}
    >
      <form id="add-student-form" className="modal-form" onSubmit={handleSubmit}>
        <FormAlert type="error" message={formMessage} />
        <div className="modal-row modal-row--2">
          <FormField label="First Name" error={errors.firstName}>
            <input type="text" className="modal-input" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </FormField>
          <FormField label="Last Name" error={errors.lastName}>
            <input type="text" className="modal-input" placeholder="Raj" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </FormField>
        </div>
        <div className="modal-row">
          <FormField label="Email" error={errors.email} full>
            <input type="email" className="modal-input" placeholder="student@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
        </div>
        <div className="modal-row modal-row--2">
          <FormField label="Phone" error={errors.phone}>
            <input type="text" className="modal-input" placeholder="8493208402" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormField>
          <FormField label="Date of birth" error={errors.dob}>
            <input type="text" className="modal-input" placeholder="DD-MM-YYYY" value={dob} onChange={(e) => setDob(e.target.value)} />
          </FormField>
        </div>
        <div className="modal-row modal-row--2">
          <FormField label="Grade/Class" error={errors.grade}>
            <GradeSelect value={grade} onChange={setGrade} />
          </FormField>
          <FormField label="Section" error={errors.section}>
            <input type="text" className="modal-input" placeholder="eg. A" value={section} onChange={(e) => setSection(e.target.value)} />
          </FormField>
        </div>
        <h3 className="modal-section">Parent Information</h3>
      </form>
    </ModalShell>
  )
}

export function AddParentModal({ open, onClose, parent = null }) {
  const { parents } = useData()
  const { showToast } = useToast()
  const isEdit = !!parent
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [occupation, setOccupation] = useState('')
  const [doorNo, setDoorNo] = useState('')
  const [street, setStreet] = useState('')
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')

  const reset = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')
    setOccupation('')
    setDoorNo('')
    setStreet('')
    setErrors({})
    setFormMessage('')
  }

  useEffect(() => {
    if (!open) return
    if (parent) {
      const { firstName: fn, lastName: ln } = splitName(parent.name)
      const addressParts = (parent.address || '').split(',').map((s) => s.trim())
      setFirstName(fn)
      setLastName(ln)
      setEmail(parent.email || '')
      setPhone(parent.contact || '')
      setOccupation(parent.occupation || '')
      setDoorNo(addressParts[0] || '')
      setStreet(addressParts.slice(1).join(', ') || '')
      setErrors({})
      setFormMessage('')
    } else {
      reset()
    }
  }, [open, parent])

  if (!open) return null

  const handleClose = () => resetAndClose(reset, onClose)

  const handleSubmit = (e) => {
    e.preventDefault()
    const { valid, errors: fieldErrors } = runValidation({
      firstName: [() => validateRequired(firstName, 'First name')],
      lastName: [() => validateRequired(lastName, 'Last name')],
      email: [() => validateEmail(email)],
      phone: [() => validatePhone(phone)],
      ...(isEdit ? {} : {
        occupation: [() => validateRequired(occupation, 'Occupation')],
        doorNo: [() => validateRequired(doorNo, 'Door no')],
        street: [() => validateRequired(street, 'Street name')],
      }),
    })
    setErrors(fieldErrors)
    if (!valid) {
      setFormMessage('Please fix the errors below.')
      return
    }

    const name = `${firstName.trim()} ${lastName.trim()}`
    const payload = {
      name,
      email: email.trim(),
      contact: phone.trim(),
      occupation: occupation.trim(),
      address: `${doorNo.trim()}, ${street.trim()}`,
    }

    if (isEdit) {
      parents.update(parent.id, payload)
      showToast(`${name} updated successfully`, 'success')
    } else {
      parents.add({
        ...payload,
        linkedStudents: [],
        status: 'Active',
        joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        avatar: Math.floor(Math.random() * 70) + 1,
      })
      showToast(`${name} added successfully`, 'success')
    }
    handleClose()
  }

  return (
    <ModalShell
      title={isEdit ? 'Edit Parent' : 'Add New Parent'}
      onClose={handleClose}
      footer={(
        <div className="modal-footer">
          <button type="button" className="btn modal-btn-cancel" onClick={handleClose}>Cancel</button>
          <button type="submit" form="add-parent-form" className="btn btn-primary modal-btn-submit">
            {isEdit ? 'Save Changes' : 'Add Parent'}
          </button>
        </div>
      )}
    >
      <form id="add-parent-form" className="modal-form" onSubmit={handleSubmit}>
        <FormAlert type="error" message={formMessage} />
        <div className="modal-row modal-row--2">
          <FormField label="First Name" error={errors.firstName}>
            <input type="text" className="modal-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </FormField>
          <FormField label="Last Name" error={errors.lastName}>
            <input type="text" className="modal-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </FormField>
        </div>
        <div className="modal-row">
          <FormField label="Email" error={errors.email} full>
            <input type="email" className="modal-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
        </div>
        <div className="modal-row modal-row--2">
          <FormField label="Phone" error={errors.phone}>
            <input type="text" className="modal-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormField>
          <FormField label="Occupation" error={errors.occupation}>
            <input type="text" className="modal-input" placeholder="Engineer" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
          </FormField>
        </div>
        <h3 className="modal-section">Address</h3>
        <div className="modal-row modal-row--2">
          <FormField label="Door no" error={errors.doorNo}>
            <input type="text" className="modal-input" value={doorNo} onChange={(e) => setDoorNo(e.target.value)} />
          </FormField>
          <FormField label="Street Name" error={errors.street}>
            <input type="text" className="modal-input" value={street} onChange={(e) => setStreet(e.target.value)} />
          </FormField>
        </div>
      </form>
    </ModalShell>
  )
}

export function AddTeacherModal({ open, onClose, staffMember = null }) {
  const { staff } = useData()
  const { showToast } = useToast()
  const isEdit = !!staffMember
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState('')
  const [designation, setDesignation] = useState('')
  const [joiningDate, setJoiningDate] = useState('')
  const [subjects, setSubjects] = useState('')
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')

  const reset = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')
    setRole('')
    setDepartment('')
    setDesignation('')
    setJoiningDate('')
    setSubjects('')
    setErrors({})
    setFormMessage('')
  }

  useEffect(() => {
    if (!open) return
    if (staffMember) {
      const { firstName: fn, lastName: ln } = splitName(staffMember.name)
      const isTeacher = staffMember.subjectType === 'teacher'
      setFirstName(fn)
      setLastName(ln)
      setEmail(staffMember.email || '')
      setPhone(staffMember.phone || '')
      setRole(isTeacher ? 'Teacher' : 'Staff')
      setDepartment(staffMember.department || '')
      setDesignation(isTeacher ? staffMember.department || '' : staffMember.department || '')
      setJoiningDate(staffMember.joined || '')
      setSubjects(staffMember.subjects || '')
      setErrors({})
      setFormMessage('')
    } else {
      reset()
    }
  }, [open, staffMember])

  if (!open) return null

  const handleClose = () => resetAndClose(reset, onClose)

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = `${firstName.trim()} ${lastName.trim()}`
    const isTeacherRole = role.toLowerCase().includes('teacher')
    const { valid, errors: fieldErrors } = runValidation({
      firstName: [() => validateRequired(firstName, 'First name')],
      lastName: [() => validateRequired(lastName, 'Last name')],
      email: [() => validateEmail(email)],
      phone: isEdit
        ? (phone ? [() => validatePhone(phone)] : [])
        : [() => validatePhone(phone)],
      role: [() => validateRequired(role, 'Role')],
      department: [() => validateRequired(department, 'Department')],
      designation: [() => validateRequired(designation, 'Designation')],
      joiningDate: isEdit
        ? [() => validateRequired(joiningDate, 'Date of joining')]
        : [() => validateDate(joiningDate, 'Date of joining')],
      ...(isTeacherRole ? { subjects: [() => validateRequired(subjects, 'Subject taught')] } : {}),
    })
    setErrors(fieldErrors)
    if (!valid) {
      setFormMessage('Please fix the errors below.')
      return
    }

    const payload = {
      name,
      email: email.trim(),
      department: designation.trim() || department.trim(),
      subjectType: isTeacherRole ? 'teacher' : 'staff',
      subjects: isTeacherRole ? subjects.trim() : '',
      joined: joiningDate.trim(),
    }

    if (isEdit) {
      staff.update(staffMember.id, payload)
      showToast(`${name} updated successfully`, 'success')
    } else {
      staff.add({
        ...payload,
        employeeId: `EMP-${Date.now().toString().slice(-4)}`,
        status: 'Active',
        avatar: Math.floor(Math.random() * 70) + 1,
      })
      showToast(`${name} added successfully`, 'success')
    }
    handleClose()
  }

  return (
    <ModalShell
      title={isEdit ? 'Edit Staff Member' : 'Add New Teacher'}
      onClose={handleClose}
      footer={(
        <div className="modal-footer">
          <button type="button" className="btn modal-btn-cancel" onClick={handleClose}>Cancel</button>
          <button type="submit" form="add-teacher-form" className="btn btn-primary modal-btn-submit">
            {isEdit ? 'Save Changes' : 'Add Teacher'}
          </button>
        </div>
      )}
    >
      <form id="add-teacher-form" className="modal-form" onSubmit={handleSubmit}>
        <FormAlert type="error" message={formMessage} />
        <div className="modal-row modal-row--2">
          <FormField label="First Name" error={errors.firstName}>
            <input type="text" className="modal-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </FormField>
          <FormField label="Last Name" error={errors.lastName}>
            <input type="text" className="modal-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </FormField>
        </div>
        <div className="modal-row">
          <FormField label="Email" error={errors.email} full>
            <input type="email" className="modal-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
        </div>
        <div className="modal-row modal-row--2">
          <FormField label="Phone" error={errors.phone}>
            <input type="text" className="modal-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormField>
          <FormField label="Role" error={errors.role}>
            <input type="text" className="modal-input" placeholder="eg Teacher Staff" value={role} onChange={(e) => setRole(e.target.value)} />
          </FormField>
        </div>
        <div className="modal-row modal-row--2">
          <FormField label="Department" error={errors.department}>
            <input type="text" className="modal-input" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </FormField>
          <FormField label="Designation" error={errors.designation}>
            <input type="text" className="modal-input" value={designation} onChange={(e) => setDesignation(e.target.value)} />
          </FormField>
        </div>
        <div className="modal-row modal-row--2">
          <FormField label="Date of joining" error={errors.joiningDate}>
            <input type="text" className="modal-input" placeholder="DD-MM-YYYY" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
          </FormField>
          <FormField label="Subject taught" error={errors.subjects}>
            <input type="text" className="modal-input" placeholder="eg Algebra" value={subjects} onChange={(e) => setSubjects(e.target.value)} />
          </FormField>
        </div>
      </form>
    </ModalShell>
  )
}
