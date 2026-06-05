import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from '../icons.jsx'

function pad(n) {
  return String(n).padStart(2, '0')
}

function formatDate(d) {
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`
}

function parseDate(str) {
  const [dd, mm, yyyy] = str.split('-').map(Number)
  return new Date(yyyy, mm - 1, dd)
}

export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => parseDate(value))
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const cells = []
  for (let i = 0; i < firstDay; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d)

  const selected = parseDate(value)

  const pick = (day) => {
    const next = new Date(year, month, day)
    onChange(formatDate(next))
    setOpen(false)
  }

  return (
    <div className="att-date-wrap" ref={ref}>
      <div className="att-date-field">
        <input
          type="text"
          readOnly
          value={value}
          onClick={() => setOpen((v) => !v)}
        />
        <button
          type="button"
          className="att-date-btn"
          aria-label="Open calendar"
          onClick={() => setOpen((v) => !v)}
        >
          <Calendar size={18} />
        </button>
      </div>
      {open && (
        <div className="att-calendar">
          <div className="att-cal-head">
            <button type="button" onClick={() => setView(new Date(year, month - 1, 1))}>
              <ChevronLeft size={18} />
            </button>
            <span>{monthNames[month]} {year}</span>
            <button type="button" onClick={() => setView(new Date(year, month + 1, 1))}>
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="att-cal-weekdays">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="att-cal-grid">
            {cells.map((day, i) => (
              day ? (
                <button
                  key={i}
                  type="button"
                  className={`att-cal-day${
                    selected.getDate() === day
                    && selected.getMonth() === month
                    && selected.getFullYear() === year ? ' selected' : ''
                  }`}
                  onClick={() => pick(day)}
                >
                  {day}
                </button>
              ) : <span key={i} className="att-cal-empty" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
