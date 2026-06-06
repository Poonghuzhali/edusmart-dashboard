import { useCallback, useEffect, useState } from 'react'
import { parseHash, setRoute } from '../utils/session.js'

export function usePortalPage(role, validPages, defaultPage = 'dashboard') {
  const resolvePage = useCallback(() => {
    const route = parseHash()
    if (route?.role === role && validPages.includes(route.page)) {
      return route.page
    }
    return defaultPage
  }, [role, validPages, defaultPage])

  const [page, setPage] = useState(resolvePage)

  useEffect(() => {
    const route = parseHash()
    if (!route || route.role !== role) {
      setRoute(role, page)
    }
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      const route = parseHash()
      if (route?.role === role) {
        setPage(route.page)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [role])

  const navigate = useCallback((nextPage) => {
    if (!validPages.includes(nextPage)) return
    setPage(nextPage)
    setRoute(role, nextPage)
  }, [role, validPages])

  return [page, navigate]
}
