import { GradCap, Pencil, Trash, ChevronDown } from '../icons.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function ExamsPanel({ onEdit }) {
  const { examsAdmin } = useData()
  const { showToast } = useToast()

  const handleDelete = (exam) => {
    if (!window.confirm(`Delete exam "${exam.title}"?`)) return
    examsAdmin.remove(exam.id)
    showToast('Exam deleted', 'success')
  }

  return (
    <div className="ac-exams-list">
      {examsAdmin.items.map((exam) => (
        <article key={exam.id} className="ac-exam-card">
          <div className="ac-exam-icon"><GradCap size={18} /></div>
          <div className="ac-exam-body">
            <div className="ac-exam-title-row">
              <h3>{exam.title}</h3>
              <span className={`ac-exam-status ac-exam-status--${exam.statusTone}`}>
                {exam.status}
              </span>
            </div>
            <p className="ac-exam-meta">
              {exam.date} . {exam.grade} . {exam.subject}
            </p>
            {exam.passed && <p className="ac-exam-passed">{exam.passed}</p>}
          </div>
          <div className="ac-exam-actions">
            <button type="button" className="um-action-btn" aria-label="Edit" onClick={() => onEdit?.(exam)}>
              <Pencil size={17} />
            </button>
            <button type="button" className="um-action-btn delete" aria-label="Delete" onClick={() => handleDelete(exam)}>
              <Trash size={17} />
            </button>
            <button type="button" className="um-action-btn" aria-label="More">
              <ChevronDown size={17} />
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
