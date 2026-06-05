import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Upload, Search, Calendar, ChevronDown, Folder, FileText, Medal,
  Trash, Download, GradCap,
} from '../icons.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { downloadExcel, downloadDocument, downloadCertificate } from '../utils/download.js'
import { resolveIcon } from '../utils/iconsMap.js'

const tabs = [
  { id: 'all', label: 'All documents', icon: Folder },
  { id: 'records', label: 'Student records', icon: Folder },
  { id: 'certificates', label: 'Certificates', icon: Medal },
]

function DocTag({ label, tone }) {
  return <span className={`doc-tag doc-tag-${tone}`}>{label}</span>
}

function DocumentRow({ doc, onDownload, onDelete }) {
  return (
    <div className="doc-row">
      <div className={`doc-row-icon tone-${doc.iconTone}`}>
        <FileText size={18} />
      </div>
      <div className="doc-row-text">
        <strong>{doc.title}</strong>
        <p>{doc.meta}</p>
      </div>
      <DocTag label={doc.tag} tone={doc.tagTone} />
      <div className="doc-row-actions">
        <button type="button" className="um-action-btn" aria-label="Download" onClick={onDownload}>
          <Upload size={16} />
        </button>
        <button type="button" className="um-action-btn delete" aria-label="Delete" onClick={onDelete}>
          <Trash size={16} />
        </button>
      </div>
    </div>
  )
}

function CertificateCard({ cert, onDownload }) {
  const Icon = resolveIcon(cert.icon, GradCap)
  return (
    <article className={`doc-cert-card doc-cert-${cert.tone}`}>
      <div className="doc-cert-head">
        <Icon size={22} />
        <span className="doc-cert-badge">{cert.badge}</span>
      </div>
      <h3>{cert.title}</h3>
      <p className="doc-cert-student">{cert.student}</p>
      <p className="doc-cert-date">Issued: {cert.issued}</p>
      <button type="button" className="btn btn-ghost doc-cert-btn" onClick={onDownload}>
        <Download size={16} /> Download Certificate
      </button>
    </article>
  )
}

function DocumentList({ items, search, onDownload, onDelete }) {
  const q = search.toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return items
    return items.filter((d) => d.title.toLowerCase().includes(q) || d.meta.toLowerCase().includes(q))
  }, [items, search])

  return (
    <div className="card um-card doc-list-panel">
      {filtered.map((doc) => (
        <DocumentRow
          key={doc.id}
          doc={doc}
          onDownload={() => onDownload(doc)}
          onDelete={() => onDelete(doc)}
        />
      ))}
    </div>
  )
}

export default function Documents() {
  const {
    documents, studentRecords, certificates, documentStats, documentTypeOptions,
  } = useData()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [typeOpen, setTypeOpen] = useState(false)
  const typeRef = useRef(null)

  const typeOptions = documentTypeOptions || ['All Types']

  useEffect(() => {
    if (!typeOpen) return undefined
    const handleClick = (e) => {
      if (typeRef.current && !typeRef.current.contains(e.target)) setTypeOpen(false)
    }
    globalThis.document.addEventListener('mousedown', handleClick)
    return () => globalThis.document.removeEventListener('mousedown', handleClick)
  }, [typeOpen])

  const listItems = useMemo(() => {
    const base = activeTab === 'records' ? studentRecords.items : documents.items
    if (typeFilter === 'All Types') return base
    return base.filter((d) => d.tag === typeFilter)
  }, [activeTab, documents.items, studentRecords.items, typeFilter])

  const handleExport = () => {
    try {
      if (activeTab === 'certificates') {
        downloadExcel(certificates.items, 'Certificates', 'certificates')
      } else if (activeTab === 'records') {
        downloadExcel(studentRecords.items, 'Student Records', 'student-records')
      } else {
        downloadExcel(documents.items, 'Documents', 'documents')
      }
      showToast('Excel exported successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Export failed', 'error')
    }
  }

  const handleDocDownload = (doc) => {
    try {
      downloadDocument(doc)
      showToast('PDF downloaded', 'success')
    } catch {
      showToast('Download failed', 'error')
    }
  }

  const handleCertDownload = (cert) => {
    try {
      downloadCertificate(cert)
      showToast('Certificate downloaded', 'success')
    } catch {
      showToast('Download failed', 'error')
    }
  }

  const handleDelete = (collection, doc) => {
    if (!window.confirm(`Delete "${doc.title}"?`)) return
    collection.remove(doc.id)
    showToast('Document deleted', 'success')
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Documents</h1>
          <p>Managr students records, certificates and uploaded files</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-ghost" onClick={handleExport}>
            <Upload size={18} /> Export Excel
          </button>
        </div>
      </div>

      <div className="doc-stats">
        {documentStats.map(({ id, value, label }) => (
          <div key={id ?? label} className="doc-stat-card">
            <span className="doc-stat-value">{value}</span>
            <span className="doc-stat-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="page-tabs doc-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`page-tab${activeTab === id ? ' active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>

      {activeTab !== 'certificates' && (
        <div className="um-toolbar doc-toolbar">
          <div className="um-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search Student or roll no......"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="att-filter-wrap" ref={typeRef}>
            <button
              type="button"
              className={`um-select att-filter-btn${typeOpen ? ' open' : ''}`}
              onClick={() => setTypeOpen((v) => !v)}
            >
              <Calendar size={16} /> {typeFilter} <ChevronDown size={16} />
            </button>
            {typeOpen && (
              <ul className="att-dept-menu fee-month-menu">
                {typeOptions.map((t) => (
                  <li key={t}>
                    <button
                      type="button"
                      className={`att-dept-option${typeFilter === t ? ' selected' : ''}`}
                      onClick={() => { setTypeFilter(t); setTypeOpen(false) }}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === 'certificates' ? (
        <div className="doc-cert-grid">
          {certificates.items.map((cert) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              onDownload={() => handleCertDownload(cert)}
            />
          ))}
        </div>
      ) : (
        <DocumentList
          items={listItems}
          search={search}
          onDownload={handleDocDownload}
          onDelete={(doc) => handleDelete(activeTab === 'records' ? studentRecords : documents, doc)}
        />
      )}
    </>
  )
}
