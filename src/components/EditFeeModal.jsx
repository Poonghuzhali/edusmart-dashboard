import { useState, useEffect } from 'react'
import { Close } from '../icons.jsx'
import { FormField, FormAlert } from './FormField.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { validateRequired, validateAmount, runValidation } from '../utils/validation.js'

export default function EditFeeModal({ open, fee, onClose }) {
  const { feeCategories } = useData()
  const { showToast } = useToast()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState('')
  const [grades, setGrades] = useState('')
  const [errors, setErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')

  useEffect(() => {
    if (fee) {
      setName(fee.name || '')
      setAmount(fee.amount || '')
      setFrequency(fee.frequency || '')
      setGrades(fee.grades || '')
      setErrors({})
      setFormMessage('')
    }
  }, [fee])

  if (!open || !fee) return null

  const handleClose = () => onClose()

  const handleSubmit = (e) => {
    e.preventDefault()
    const { valid, errors: fieldErrors } = runValidation({
      name: [() => validateRequired(name, 'Fee category name')],
      amount: [() => validateAmount(amount)],
      frequency: [() => validateRequired(frequency, 'Frequency')],
      grades: [() => validateRequired(grades, 'Grade applicability')],
    })
    setErrors(fieldErrors)
    if (!valid) {
      setFormMessage('Please fix the errors below.')
      return
    }

    feeCategories.update(fee.id, {
      name: name.trim(),
      amount: amount.trim().startsWith('$') ? amount.trim() : `$${amount.trim()}`,
      frequency: frequency.trim(),
      grades: grades.trim(),
    })
    showToast('Fee structure updated', 'success')
    handleClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-dialog modal-dialog--compact"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header modal-header--compact">
          <h2 className="modal-title">Edit Fee Structure</h2>
          <button type="button" className="modal-close" onClick={handleClose} aria-label="Close">
            <Close size={20} />
          </button>
        </div>

        <form
          className="modal-body modal-body--compact"
          onSubmit={handleSubmit}
        >
          <FormAlert type="error" message={formMessage} />
          <div className="modal-form">
            <div className="modal-row">
              <FormField label="Fee Category Name" error={errors.name} full>
                <input
                  type="text"
                  className="modal-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormField>
            </div>
            <div className="modal-row modal-row--2">
              <FormField label="Amount" error={errors.amount}>
                <input
                  type="text"
                  className="modal-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FormField>
              <FormField label="Frequency" error={errors.frequency}>
                <input
                  type="text"
                  className="modal-input"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                />
              </FormField>
            </div>
            <div className="modal-row">
              <FormField label="Grade Applicability" error={errors.grades} full>
                <input
                  type="text"
                  className="modal-input"
                  value={grades}
                  onChange={(e) => setGrades(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn modal-btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary modal-btn-submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
