import { Star } from '../../icons.jsx'

export default function AIFab({ onClick }) {
  return (
    <button type="button" className="ai-fab" onClick={onClick}>
      <Star size={18} /> AI Assistant
    </button>
  )
}
