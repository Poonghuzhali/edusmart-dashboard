import { useRef } from 'react'
import { useState } from 'react'
import { Search, Plus, Upload, Filter, ChevronDown, Pencil, Trash } from '../icons.jsx'
import { AddStudentModal, AddParentModal, AddTeacherModal } from './AddUserModal.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { parseExcelFile } from '../utils/download.js'
import { validateRequired, validateEmail, runValidation } from '../utils/validation.js'

const addLabels = {
  students: 'Add Student',
  staff: 'Add Teacher',
  parents: 'Add Parent',
}

function StatusBadge({ status }) {
  const slug = status.toLowerCase().replace(/\s+/g, '-')
  return (
    <span className={`um-status status-${slug}`}>
      <span className="status-dot" />
      {status}
    </span>
  )
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="um-actions">
      <button type="button" className="um-action-btn" aria-label="Edit" onClick={onEdit}>
        <Pencil size={17} />
      </button>
      <button type="button" className="um-action-btn delete" aria-label="Delete" onClick={onDelete}>
        <Trash size={17} />
      </button>
    </div>
  )
}

function PersonCell({ name, email, avatar }) {
  return (
    <div className="um-student">
      <img
        src={`https://i.pravatar.cc/80?img=${avatar}`}
        alt={name}
        className="um-avatar"
      />
      <div>
        <div className="um-name">{name}</div>
        <div className="um-email">{email}</div>
      </div>
    </div>
  )
}

function SubjectCell({ subjectType, subjects }) {
  if (subjectType === 'staff') {
    return <span className="um-subject-pill um-subject-pill--staff">Staff</span>
  }
  return (
    <span className="um-subject-pill um-subject-pill--teacher">
      <span className="um-subject-tag">Teacher</span>
      {subjects}
    </span>
  )
}

export default function UserManagement() {
  const { students, staff, parents } = useData()
  const { showToast } = useToast()
  const fileRef = useRef(null)
  const [activeTab, setActiveTab] = useState('students')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editStudent, setEditStudent] = useState(null)
  const [editParent, setEditParent] = useState(null)
  const [editStaff, setEditStaff] = useState(null)

  const clearEdit = () => {
    setEditStudent(null)
    setEditParent(null)
    setEditStaff(null)
  }

  const openAddModal = () => {
    clearEdit()
    setModalOpen(true)
  }

  const closeUserModals = () => {
    setModalOpen(false)
    clearEdit()
  }

  const tabs = [
    { id: 'students', label: 'Students', count: students.items.length },
    { id: 'staff', label: 'Staff', count: staff.items.length },
    { id: 'parents', label: 'Parents', count: parents.items.length },
  ]

  const q = search.toLowerCase()

  const filteredStudents = students.items.filter((s) => (
    !q
    || s.name.toLowerCase().includes(q)
    || s.studentId.toLowerCase().includes(q)
    || s.email.toLowerCase().includes(q)
  ))

  const filteredParents = parents.items.filter((p) => (
    !q
    || p.name.toLowerCase().includes(q)
    || p.email.toLowerCase().includes(q)
    || p.contact.toLowerCase().includes(q)
    || p.linkedStudents.some((s) => s.toLowerCase().includes(q))
  ))

  const filteredStaff = staff.items.filter((m) => (
    !q
    || m.name.toLowerCase().includes(q)
    || m.employeeId.toLowerCase().includes(q)
    || m.email.toLowerCase().includes(q)
    || m.department.toLowerCase().includes(q)
    || m.subjects.toLowerCase().includes(q)
  ))

  const handleDelete = (collection, id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return
    collection.remove(id)
    showToast(`${name} removed`, 'success')
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const rows = await parseExcelFile(file)
      if (!rows.length) {
        showToast('Excel file is empty', 'error')
        return
      }

      let imported = 0
      for (const row of rows) {
        const name = row.Name || row.name || `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim()
        const email = row.Email || row.email || ''
        const { valid } = runValidation({
          name: [() => validateRequired(name, 'Name')],
          email: [() => validateEmail(email)],
        })
        if (!valid) continue

        if (activeTab === 'students') {
          students.add({
            name,
            email,
            studentId: row['Student ID'] || row.studentId || `STU-${Date.now().toString().slice(-5)}`,
            grade: row.Grade || row.grade || 'Grade 5 - A',
            guardian: row.Guardian || '—',
            relation: row.Relation || '—',
            status: 'Active',
            joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            avatar: Math.floor(Math.random() * 70) + 1,
          })
          imported += 1
        } else if (activeTab === 'staff') {
          staff.add({
            name,
            email,
            employeeId: row['Employee ID'] || `EMP-${Date.now().toString().slice(-4)}`,
            department: row.Department || 'Teacher',
            subjectType: 'teacher',
            subjects: row.Subjects || '',
            status: 'Active',
            joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            avatar: Math.floor(Math.random() * 70) + 1,
          })
          imported += 1
        } else if (activeTab === 'parents') {
          parents.add({
            name,
            email,
            contact: row.Contact || row.Phone || '—',
            linkedStudents: [],
            status: 'Active',
            joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            avatar: Math.floor(Math.random() * 70) + 1,
          })
          imported += 1
        }
      }

      if (imported === 0) {
        showToast('No valid rows found. Ensure Name and Email columns exist.', 'error')
      } else {
        showToast(`Imported ${imported} record(s)`, 'success')
      }
    } catch {
      showToast('Failed to parse Excel file', 'error')
    } finally {
      e.target.value = ''
    }
  }

  return (
    <>
      <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={handleImport} />
      <div className="page-head um-head">
        <div>
          <h1>User Management</h1>
          <p>Manage Students, Staffs and parents across the school</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
            <Upload size={18} /> Import Excel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={18} /> {addLabels[activeTab]}
          </button>
        </div>
      </div>

      <div className="um-tabs">
        {tabs.map(({ id, label, count }) => (
          <button
            key={id}
            type="button"
            className={`um-tab um-tab--${id}${activeTab === id ? ' active' : ''}`}
            onClick={() => { setActiveTab(id); closeUserModals() }}
          >
            {label} <span className="um-tab-count">{String(count).padStart(2, '0')}</span>
          </button>
        ))}
      </div>

      <div className="card um-card">
        <div className="um-toolbar">
          <div className="um-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="um-filters">
            {activeTab === 'staff' ? (
              <button type="button" className="um-select">
                <Filter size={16} /> All Departments <ChevronDown size={16} />
              </button>
            ) : (
              <>
                <button type="button" className="um-select">
                  <Filter size={16} /> All Grade <ChevronDown size={16} />
                </button>
                <button type="button" className="um-select">
                  <Filter size={16} /> All Status <ChevronDown size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="um-table-wrap">
          {activeTab === 'students' && (
            <table className="um-table">
              <thead>
                <tr>
                  <th>Student Details</th>
                  <th>Student ID</th>
                  <th>Grade/Class</th>
                  <th>Guardian</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td><PersonCell name={s.name} email={s.email} avatar={s.avatar} /></td>
                    <td className="um-id">{s.studentId}</td>
                    <td><span className="um-grade">{s.grade}</span></td>
                    <td>
                      <div className="um-guardian">
                        <div className="um-name">{s.guardian}</div>
                        <div className="um-email">{s.relation}</div>
                      </div>
                    </td>
                    <td><StatusBadge status={s.status} /></td>
                    <td className="um-date">{s.joined}</td>
                    <td>
                      <ActionButtons
                        onEdit={() => setEditStudent(s)}
                        onDelete={() => handleDelete(students, s.id, s.name)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'parents' && (
            <table className="um-table um-table--parents">
              <thead>
                <tr>
                  <th>Parent Details</th>
                  <th>Contact</th>
                  <th>Linked Student(s)</th>
                  <th>Status</th>
                  <th>JoinedDate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParents.map((p) => (
                  <tr key={p.id}>
                    <td><PersonCell name={p.name} email={p.email} avatar={p.avatar} /></td>
                    <td className="um-contact">{p.contact}</td>
                    <td>
                      <div className="um-linked">
                        {p.linkedStudents.map((student) => (
                          <span key={student} className="um-linked-pill">{student}</span>
                        ))}
                      </div>
                    </td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className="um-date">{p.joined}</td>
                    <td>
                      <ActionButtons
                        onEdit={() => setEditParent(p)}
                        onDelete={() => handleDelete(parents, p.id, p.name)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'staff' && (
            <table className="um-table um-table--staff">
              <thead>
                <tr>
                  <th>Staff Details</th>
                  <th>Employee ID</th>
                  <th>Departments</th>
                  <th>Subjects</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((m) => (
                  <tr key={m.id}>
                    <td><PersonCell name={m.name} email={m.email} avatar={m.avatar} /></td>
                    <td className="um-id">{m.employeeId}</td>
                    <td className="um-dept">{m.department}</td>
                    <td><SubjectCell subjectType={m.subjectType} subjects={m.subjects} /></td>
                    <td><StatusBadge status={m.status} /></td>
                    <td className="um-date">{m.joined}</td>
                    <td>
                      <ActionButtons
                        onEdit={() => setEditStaff(m)}
                        onDelete={() => handleDelete(staff, m.id, m.name)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddStudentModal
        open={(modalOpen && activeTab === 'students') || !!editStudent}
        onClose={closeUserModals}
        student={editStudent}
      />
      <AddParentModal
        open={(modalOpen && activeTab === 'parents') || !!editParent}
        onClose={closeUserModals}
        parent={editParent}
      />
      <AddTeacherModal
        open={(modalOpen && activeTab === 'staff') || !!editStaff}
        onClose={closeUserModals}
        staffMember={editStaff}
      />
    </>
  )
}
