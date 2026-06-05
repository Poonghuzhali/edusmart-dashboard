export function FormField({
  label, error, children, full,
}) {
  return (
    <label className={`modal-field${full ? ' modal-field--full' : ''}${error ? ' has-error' : ''}`}>
      <span className="modal-label">{label}</span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}

export function FormAlert({ type, message }) {
  if (!message) return null
  return <div className={`form-alert form-alert-${type}`}>{message}</div>
}
