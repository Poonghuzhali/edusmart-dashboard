export const ADMIN_PAGES = [
  'dashboard', 'user-management', 'academic', 'attendance', 'fees',
  'communication', 'reports', 'documents', 'settings', 'approvals',
]

export const TEACHER_PAGES = [
  'dashboard', 'my-classes', 'students', 'attendance', 'assignment',
  'exams', 'messages', 'settings',
]

export const PARENT_PAGES = ['dashboard', 'attendance', 'fees', 'messages', 'settings']

const AUTH_KEY = 'edusmart_auth'
const PARENT_EMAIL_KEY = 'edusmart_parent_email'

export function saveAuth(role, parentEmail = null) {
  sessionStorage.setItem(AUTH_KEY, role)
  if (role === 'parent' && parentEmail) {
    sessionStorage.setItem(PARENT_EMAIL_KEY, parentEmail.trim().toLowerCase())
  } else {
    sessionStorage.removeItem(PARENT_EMAIL_KEY)
  }
}

export function loadAuth() {
  const role = sessionStorage.getItem(AUTH_KEY)
  if (role === 'admin' || role === 'teacher' || role === 'parent') return role
  return null
}

export function loadParentEmail() {
  return sessionStorage.getItem(PARENT_EMAIL_KEY) || null
}

export function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(PARENT_EMAIL_KEY)
}

export function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '').trim()
  if (!raw) return null

  const [portal, page] = raw.split('/')
  if (portal === 'admin' && ADMIN_PAGES.includes(page)) {
    return { role: 'admin', page }
  }
  if (portal === 'teacher' && TEACHER_PAGES.includes(page)) {
    return { role: 'teacher', page }
  }
  if (portal === 'parent' && PARENT_PAGES.includes(page)) {
    return { role: 'parent', page }
  }
  return null
}

export function setRoute(role, page) {
  const portal = role === 'teacher' ? 'teacher' : role === 'parent' ? 'parent' : 'admin'
  const next = `#/${portal}/${page}`
  if (window.location.hash !== next) {
    window.location.hash = next
  }
}

export function clearRoute() {
  const base = `${window.location.pathname}${window.location.search}`
  window.history.replaceState(null, '', base)
}

export function readSession() {
  const savedRole = loadAuth()
  const route = parseHash()

  if (!savedRole) {
    return { authed: false, role: 'admin', page: 'dashboard', parentEmail: null }
  }

  if (route && route.role === savedRole) {
    return {
      authed: true,
      role: savedRole,
      page: route.page,
      parentEmail: savedRole === 'parent' ? loadParentEmail() : null,
    }
  }

  return {
    authed: true,
    role: savedRole,
    page: 'dashboard',
    parentEmail: savedRole === 'parent' ? loadParentEmail() : null,
  }
}
