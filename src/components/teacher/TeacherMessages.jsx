import { useState, useMemo } from 'react'
import {
  Search, MoreVertical, Send, Paperclip, ImageIcon, Smile,
  Phone, Video, Info,
} from '../../icons.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { validateRequired, runValidation } from '../../utils/validation.js'

export default function TeacherMessages() {
  const { messageState, setMessageState } = useData()
  const { showToast } = useToast()
  const {
    filterTabs, contacts, chatMessages, chatDate, teacherAvatar, activeContactId,
  } = messageState

  const [filter, setFilter] = useState(filterTabs[0])
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [messageError, setMessageError] = useState(null)

  const activeContact = useMemo(
    () => contacts.find((c) => c.id === activeContactId) || contacts[0],
    [contacts, activeContactId],
  )

  const filteredContacts = contacts.filter((c) => {
    if (filter === 'Students') return c.role === 'Student'
    if (filter === 'Parents') return c.role === 'Parent'
    return true
  }).filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()))

  const setActiveContact = (contact) => {
    setMessageState((prev) => ({ ...prev, activeContactId: contact.id }))
  }

  const handleMarkAllRead = () => {
    setMessageState((prev) => ({
      ...prev,
      contacts: prev.contacts.map((c) => ({ ...c, unread: 0 })),
    }))
    showToast('All messages marked as read')
  }

  const handleSend = (e) => {
    e.preventDefault()
    const { valid, errors } = runValidation({
      message: [() => validateRequired(message, 'Message')],
    })
    setMessageError(errors.message)
    if (!valid) {
      showToast('Please enter a message before sending', 'error')
      return
    }

    const trimmed = message.trim()
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setMessageState((prev) => ({
      ...prev,
      chatMessages: [
        ...prev.chatMessages,
        { id: prev.chatMessages.length + 1, from: 'me', text: trimmed, time },
      ],
      contacts: prev.contacts.map((c) => (
        c.id === activeContact.id
          ? { ...c, preview: trimmed, time }
          : c
      )),
    }))
    setMessage('')
    setMessageError(null)
    showToast('Message sent')
  }

  const handleNewMessage = () => {
    showToast('Select a contact from the list to start messaging')
  }

  return (
    <>
      <div className="page-head">
        <div><h1>Messages</h1></div>
        <div className="page-actions">
          <button type="button" className="btn btn-ghost" onClick={handleMarkAllRead}>
            <MoreVertical size={18} /> Mark all as read
          </button>
          <button type="button" className="btn btn-primary" onClick={handleNewMessage}>
            <Send size={16} /> New Message
          </button>
        </div>
      </div>

      <div className="card tch-msg-panel">
        <div className="tch-msg-contacts">
          <div className="tch-msg-search">
            <Search size={16} />
            <input type="text" placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="tch-msg-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tch-msg-tab${filter === tab ? ' active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="tch-msg-list">
            {filteredContacts.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`tch-msg-item${activeContact.id === c.id ? ' active' : ''}`}
                onClick={() => setActiveContact(c)}
              >
                <div className="tch-msg-avatar-wrap">
                  <img src={`https://i.pravatar.cc/80?img=${c.avatar}`} alt={c.name} className="um-avatar" />
                  {c.online && <span className="tch-online-dot" />}
                </div>
                <div className="tch-msg-item-text">
                  <div className="tch-msg-item-top">
                    <strong>{c.name}</strong>
                    <span>{c.time}</span>
                  </div>
                  <p>{c.preview}</p>
                </div>
                {c.unread > 0 && <span className="tch-unread-badge">{c.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="tch-msg-chat">
          <div className="tch-chat-head">
            <img src={`https://i.pravatar.cc/80?img=${activeContact.avatar}`} alt={activeContact.name} className="um-avatar" />
            <div>
              <strong>{activeContact.name}</strong>
              <span>{activeContact.subtitle || activeContact.role}</span>
            </div>
            <div className="tch-chat-actions">
              <button type="button" className="icon-btn" aria-label="Call"><Phone size={18} /></button>
              <button type="button" className="icon-btn" aria-label="Video"><Video size={18} /></button>
              <button type="button" className="icon-btn" aria-label="Info"><Info size={18} /></button>
            </div>
          </div>

          <div className="tch-chat-body">
            <div className="tch-chat-date">{chatDate}</div>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`tch-bubble-wrap${msg.from === 'me' ? ' mine' : ''}`}>
                {msg.from === 'them' && (
                  <img src={`https://i.pravatar.cc/80?img=${activeContact.avatar}`} alt="" className="tch-bubble-avatar" />
                )}
                <div>
                  <div className={`tch-bubble${msg.from === 'me' ? ' mine' : ''}`}>{msg.text}</div>
                  <span className="tch-bubble-time">{msg.time}</span>
                </div>
                {msg.from === 'me' && (
                  <img src={`https://i.pravatar.cc/80?img=${teacherAvatar}`} alt="" className="tch-bubble-avatar" />
                )}
              </div>
            ))}
          </div>

          <form className="tch-chat-input" onSubmit={handleSend}>
            <button type="button" className="icon-btn" aria-label="Attach"><Paperclip size={18} /></button>
            <button type="button" className="icon-btn" aria-label="Image"><ImageIcon size={18} /></button>
            <input
              type="text"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => { setMessage(e.target.value); setMessageError(null) }}
              className={messageError ? 'has-error' : ''}
            />
            <button type="button" className="icon-btn" aria-label="Emoji"><Smile size={18} /></button>
            <button type="submit" className="tch-send-btn" aria-label="Send"><Send size={16} /></button>
          </form>
        </div>
      </div>
    </>
  )
}
