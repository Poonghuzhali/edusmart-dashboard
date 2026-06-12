import parentsSeed from '../data/parents.json'

/** Shared password for the first 5 parent accounts (see parents.json). */
export const PARENT_PASSWORD = 'Parent@123'

export const PARENT_LOGIN_ACCOUNTS = parentsSeed.slice(0, 5).map((p) => ({
  id: p.id,
  name: p.name,
  email: p.email.toLowerCase(),
}))

export function isParentLoginEmail(email) {
  const normalized = email.trim().toLowerCase()
  return PARENT_LOGIN_ACCOUNTS.some((p) => p.email === normalized)
}

export function validateParentLogin(email, password) {
  if (!isParentLoginEmail(email)) {
    return 'This email is not registered for parent login.'
  }
  if (password !== PARENT_PASSWORD) {
    return 'Incorrect password. Use the shared parent password.'
  }
  return null
}

export function getParentAccountByEmail(email, parents = parentsSeed) {
  const normalized = email.trim().toLowerCase()
  return parents.find((p) => p.email.toLowerCase() === normalized) || null
}
