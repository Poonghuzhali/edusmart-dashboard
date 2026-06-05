export function validateRequired(value, label = 'This field') {
  if (value == null || String(value).trim() === '') return `${label} is required`
  return null
}

export function validateEmail(value) {
  const req = validateRequired(value, 'Email')
  if (req) return req
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) {
    return 'Enter a valid email address'
  }
  return null
}

export function validatePassword(value, min = 6) {
  const req = validateRequired(value, 'Password')
  if (req) return req
  if (String(value).length < min) return `Password must be at least ${min} characters`
  return null
}

export function validatePhone(value) {
  const req = validateRequired(value, 'Phone')
  if (req) return req
  if (!/^[\d\s+\-()]{7,15}$/.test(String(value).trim())) {
    return 'Enter a valid phone number'
  }
  return null
}

export function validateDate(value, label = 'Date') {
  const req = validateRequired(value, label)
  if (req) return req
  if (!/^\d{2}-\d{2}-\d{4}$/.test(String(value).trim()) && !/^\d{4}-\d{2}-\d{2}$/.test(String(value).trim())) {
    return `${label} must be DD-MM-YYYY or YYYY-MM-DD`
  }
  return null
}

export function validateAmount(value) {
  const req = validateRequired(value, 'Amount')
  if (req) return req
  const cleaned = String(value).replace(/[^0-9.]/g, '')
  if (!cleaned || Number.isNaN(Number(cleaned)) || Number(cleaned) <= 0) {
    return 'Enter a valid amount'
  }
  return null
}

export function validateNumber(value, label, min = 0, max = 100) {
  const req = validateRequired(value, label)
  if (req) return req
  const num = Number(value)
  if (Number.isNaN(num) || num < min || num > max) {
    return `${label} must be between ${min} and ${max}`
  }
  return null
}

export function validatePriority(value) {
  const req = validateRequired(value, 'Priority')
  if (req) return req
  const allowed = ['low', 'medium', 'high', 'Low', 'Medium', 'High']
  if (!allowed.some((p) => p.toLowerCase() === String(value).trim().toLowerCase())) {
    return 'Priority must be Low, Medium, or High'
  }
  return null
}

export function runValidation(fields) {
  const errors = {}
  for (const [key, validators] of Object.entries(fields)) {
    for (const validator of validators) {
      const err = validator()
      if (err) {
        errors[key] = err
        break
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
