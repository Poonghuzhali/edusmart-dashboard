export const ADMIN_PAGES = [
  'dashboard', 'user-management', 'academic', 'attendance', 'fees',
  'communication', 'reports', 'documents', 'settings', 'approvals',
]

export const TEACHER_PAGES = [
  'dashboard', 'my-classes', 'students', 'attendance', 'assignment',
  'exams', 'messages', 'settings',
]

const AUTH_KEY = 'edusmart_auth'

export function saveAuth(role) {
  sessionStorage.setItem(AUTH_KEY, role)
}

export function loadAuth() {
  const role = sessionStorage.getItem(AUTH_KEY)
  return role === 'admin' || role === 'teacher' ? role : null
}

export function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY)
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
  return null
}

export function setRoute(role, page) {
  const portal = role === 'teacher' ? 'teacher' : 'admin'
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
    return { authed: false, role: 'admin', page: 'dashboard' }
  }

  if (route && route.role === savedRole) {
    return { authed: true, role: savedRole, page: route.page }
  }

  return { authed: true, role: savedRole, page: 'dashboard' }
}
