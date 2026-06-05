import { useState, useRef, useEffect } from 'react'
import { Filter, ChevronDown } from '../icons.jsx'

export default function FilterDropdown({ label, options, value, onChange, variant }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selected = options.find((o) => o.value === value)
  const menuClass = variant === 'department'
    ? 'att-dept-menu'
    : 'modal-select-menu att-filter-menu'

  return (
    <div className="att-filter-wrap" ref={ref}>
      <button
        type="button"
        className={`um-select att-filter-btn${open ? ' open' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Filter size={16} /> {selected?.label || label} <ChevronDown size={16} />
      </button>
      {open && (
        <ul className={menuClass}>
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={
                  variant === 'department'
                    ? `att-dept-option${value === opt.value ? ' selected' : ''}`
                    : `modal-select-option${value === opt.value ? ' selected' : ''}`
                }
                onClick={() => { onChange(opt.value); setOpen(false) }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
