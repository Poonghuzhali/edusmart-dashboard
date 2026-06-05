import { useState } from 'react'
import {
  Plus, GradCap, Book, Clock, Clipboard, Users, Pencil, Trash,
  Search, Filter, ChevronDown,
} from '../icons.jsx'
import AddClassModal from './AddClassModal.jsx'
import AddSubjectModal from './AddSubjectModal.jsx'
import AddExamModal from './AddExamModal.jsx'
import TimetablePanel from './TimetablePanel.jsx'
import ExamsPanel from './ExamsPanel.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const tabs = [
  { id: 'classes', label: 'Classes & sections', icon: GradCap },
  { id: 'subjects', label: 'Subjects', icon: Book },
  { id: 'timetable', label: 'Timetable', icon: Clock },
  { id: 'exams', label: 'Exams & Results', icon: Clipboard },
]

const addActions = {
  classes: { label: 'Add Class' },
  subjects: { label: 'Add Subject' },
  exams: { label: 'Add Exam' },
}

function ClassCard({ cls, onEdit, onDelete }) {
  return (
    <article className="ac-class-card">
      <div className="ac-card-top">
        <div className="ac-card-icon"><GradCap size={18} /></div>
        <div className="ac-card-actions">
          <button type="button" className="ac-card-action" aria-label="Edit" onClick={() => onEdit(cls)}>
            <Pencil size={16} />
          </button>
          <button type="button" className="ac-card-action delete" aria-label="Delete" onClick={onDelete}>
            <Trash size={16} />
          </button>
        </div>
      </div>

      <div className="ac-card-main">
        <div>
          <h3 className="ac-card-title">{cls.title}</h3>
          <p className="ac-card-room">{cls.room}</p>
          <p className="ac-card-students">
            <Users size={15} /> {cls.students} Students
          </p>
        </div>
        <span className="ac-grade-tag">{cls.gradeTag}</span>
      </div>

      <div className="ac-card-footer">
        <p>Class Teacher: {cls.teacher}</p>
        <p>Schedule: {cls.schedule}</p>
      </div>
    </article>
  )
}

function SubjectsPanel({ items, search, onSearchChange, onEdit, onDelete }) {
  const q = search.toLowerCase()
  const filtered = items.filter((s) => (
    !q
    || s.name.toLowerCase().includes(q)
    || s.code.toLowerCase().includes(q)
    || s.teacher.toLowerCase().includes(q)
    || s.grade.toLowerCase().includes(q)
  ))

  return (
    <div className="card um-card">
      <div className="um-toolbar">
        <div className="um-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="um-filters">
          <button type="button" className="um-select">
            <Filter size={16} /> All Grade <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="um-table-wrap">
        <table className="um-table ac-subjects-table">
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Code</th>
              <th>Teacher</th>
              <th>Hrs/Wk</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td className="ac-subject-name">{s.name}</td>
                <td className="um-id">{s.code}</td>
                <td><span className="ac-teacher-pill">{s.teacher}</span></td>
                <td>
                  <span className="ac-hours-pill">
                    <span className="status-dot" /> {s.hours}
                  </span>
                </td>
                <td className="um-date">{s.grade}</td>
                <td>
                  <div className="um-actions">
                    <button type="button" className="um-action-btn" aria-label="Edit" onClick={() => onEdit(s)}>
                      <Pencil size={17} />
                    </button>
                    <button type="button" className="um-action-btn delete" aria-label="Delete" onClick={() => onDelete(s)}>
                      <Trash size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AcademicManagement() {
  const { classes, subjects } = useData()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('classes')
  const [classModalOpen, setClassModalOpen] = useState(false)
  const [subjectModalOpen, setSubjectModalOpen] = useState(false)
  const [examModalOpen, setExamModalOpen] = useState(false)
  const [editClass, setEditClass] = useState(null)
  const [editSubject, setEditSubject] = useState(null)
  const [editExam, setEditExam] = useState(null)
  const [subjectSearch, setSubjectSearch] = useState('')

  const action = addActions[activeTab]

  const closeAllModals = () => {
    setClassModalOpen(false)
    setSubjectModalOpen(false)
    setExamModalOpen(false)
    setEditClass(null)
    setEditSubject(null)
    setEditExam(null)
  }

  const handleAddClick = () => {
    setEditClass(null)
    setEditSubject(null)
    setEditExam(null)
    if (activeTab === 'classes') setClassModalOpen(true)
    if (activeTab === 'subjects') setSubjectModalOpen(true)
    if (activeTab === 'exams') setExamModalOpen(true)
  }

  const handleDeleteClass = (cls) => {
    if (!window.confirm(`Delete class "${cls.title}"?`)) return
    classes.remove(cls.id)
    showToast('Class deleted', 'success')
  }

  const handleDeleteSubject = (subject) => {
    if (!window.confirm(`Delete subject "${subject.name}"?`)) return
    subjects.remove(subject.id)
    showToast('Subject deleted', 'success')
  }

  return (
    <>
      <div className="page-head ac-head">
        <div>
          <h1>Academic Management</h1>
          <p>Classes, subject, Timetable and exams</p>
        </div>
        {action && (
          <div className="page-actions">
            <button type="button" className="btn btn-primary" onClick={handleAddClick}>
              <Plus size={18} /> {action.label}
            </button>
          </div>
        )}
      </div>

      <div className="ac-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`ac-tab${activeTab === id ? ' active' : ''}`}
            onClick={() => {
              setActiveTab(id)
              closeAllModals()
            }}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'classes' && (
        <div className="ac-class-grid">
          {classes.items.map((cls) => (
            <ClassCard
              key={cls.id}
              cls={cls}
              onEdit={setEditClass}
              onDelete={() => handleDeleteClass(cls)}
            />
          ))}
        </div>
      )}

      {activeTab === 'subjects' && (
        <SubjectsPanel
          items={subjects.items}
          search={subjectSearch}
          onSearchChange={setSubjectSearch}
          onEdit={setEditSubject}
          onDelete={handleDeleteSubject}
        />
      )}

      {activeTab === 'timetable' && <TimetablePanel />}

      {activeTab === 'exams' && <ExamsPanel onEdit={setEditExam} />}

      <AddClassModal
        open={classModalOpen || !!editClass}
        classItem={editClass}
        onClose={closeAllModals}
      />
      <AddSubjectModal
        open={subjectModalOpen || !!editSubject}
        subject={editSubject}
        onClose={closeAllModals}
      />
      <AddExamModal
        open={examModalOpen || !!editExam}
        exam={editExam}
        onClose={closeAllModals}
      />
    </>
  )
}
