import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from '../icons.jsx'
import { useData } from '../context/DataContext.jsx'

export default function GradeSelect({ value, onChange }) {
  const { grades } = useData()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const gradeNames = grades.map((g) => (typeof g === 'string' ? g : g.name))

  return (
    <div className="modal-select-wrap" ref={ref}>
      <button
        type="button"
        className={`modal-select${open ? ' open' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={value ? '' : 'modal-select-placeholder'}>
          {value || 'Select Grade'}
        </span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <ul className="modal-select-menu">
          {gradeNames.map((g) => (
            <li key={g}>
              <button
                type="button"
                className={`modal-select-option${value === g ? ' selected' : ''}`}
                onClick={() => { onChange(g); setOpen(false) }}
              >
                {g}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
