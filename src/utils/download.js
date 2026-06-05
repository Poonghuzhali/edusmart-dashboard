import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function downloadExcel(rows, sheetName, filename) {
  if (!rows?.length) {
    throw new Error('No data available to export')
  }
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31))
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`)
}

export function downloadMultiSheetExcel(sheets, filename) {
  const wb = XLSX.utils.book_new()
  sheets.forEach(({ name, rows }) => {
    if (rows?.length) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), name.slice(0, 31))
    }
  })
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`)
}

export function downloadCSV(rows, filename) {
  if (!rows?.length) throw new Error('No data available to export')
  const ws = XLSX.utils.json_to_sheet(rows)
  const csv = XLSX.utils.sheet_to_csv(ws)
  const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`)
}

export function downloadPDF({ title, lines, filename }) {
  const doc = new jsPDF()
  let y = 20
  doc.setFontSize(16)
  doc.text(title, 14, y)
  y += 12
  doc.setFontSize(11)
  lines.forEach((line) => {
    const wrapped = doc.splitTextToSize(String(line), 180)
    wrapped.forEach((row) => {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(row, 14, y)
      y += 7
    })
    y += 3
  })
  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
}

export function downloadCertificate(cert) {
  downloadPDF({
    title: cert.title,
    filename: `${cert.title.replace(/\s+/g, '_')}_${cert.student.replace(/\s+/g, '_')}.pdf`,
    lines: [
      `Student: ${cert.student}`,
      `Certificate Type: ${cert.badge}`,
      `Issued: ${cert.issued}`,
      '',
      'This certifies that the above student has successfully met the requirements.',
      '',
      'EduSmart International School',
    ],
  })
}

export function downloadDocument(doc) {
  downloadPDF({
    title: doc.title,
    filename: `${doc.title.replace(/\s+/g, '_')}.pdf`,
    lines: [
      doc.meta,
      `Category: ${doc.tag}`,
      `File Size: ${doc.size || 'N/A'}`,
      '',
      'Document exported from EduSmart Document Management.',
    ],
  })
}

export function downloadAssignmentSubmission(assignment) {
  downloadPDF({
    title: assignment.title,
    filename: `Assignment_${assignment.title.replace(/\s+/g, '_')}.pdf`,
    lines: [
      `Class: ${assignment.classTag}`,
      `Due Date: ${assignment.due}`,
      `Submissions: ${assignment.submitted}/${assignment.total} (${assignment.pct}%)`,
      `Status: ${assignment.status}`,
      '',
      'Submission summary exported from EduSmart.',
    ],
  })
}

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        resolve(XLSX.utils.sheet_to_json(sheet))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
