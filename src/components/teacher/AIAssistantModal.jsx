import { useState } from 'react'
import { Close, Bot, TrendUp, Lightbulb, Shield } from '../../icons.jsx'
import { useData } from '../../context/DataContext.jsx'
import { resolveIcon } from '../../utils/iconsMap.js'

const tabs = [
  { id: 'insights', label: 'Insights', icon: TrendUp },
  { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
  { id: 'alerts', label: 'Alerts', icon: Shield },
]

export default function AIAssistantModal({ open, onClose }) {
  const { teacherAi } = useData()
  const [activeTab, setActiveTab] = useState('insights')

  if (!open) return null

  const items = teacherAi[activeTab] || []

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="ai-modal-head">
          <div className="ai-modal-brand">
            <div className="ai-modal-bot"><Bot size={20} /></div>
            <div>
              <h2>AI Teaching Assistant</h2>
              <p>Powered by classroom analytics</p>
            </div>
          </div>
          <button type="button" className="ai-modal-close" onClick={onClose} aria-label="Close">
            <Close size={20} />
          </button>
        </div>

        <div className="ai-modal-tabs">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`ai-modal-tab${activeTab === id ? ' active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div className="ai-modal-body">
          {items.map(({ id, tone, icon, text }) => {
            const ItemIcon = resolveIcon(icon)
            return (
              <div key={id} className={`ai-insight ai-insight-${tone}`}>
                <div className={`ai-insight-icon icon-${tone}`}><ItemIcon size={18} /></div>
                <p>{text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
