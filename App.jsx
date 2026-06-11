import { useState, useEffect } from 'react'
import { injectCSS } from './lib/styles'
import { isAuthenticated } from './lib/storage'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import ProposalView from './components/ProposalView'
import HomePage from './pages/HomePage'

function getRoute() {
  const p = window.location.pathname
  const q = new URLSearchParams(window.location.search)
  if (p === '/admin' || p === '/admin/') return { page: 'admin' }
  if (q.get('proposta')) return { page: 'proposal', id: q.get('proposta') }
  return { page: 'home' }
}

function nav(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export { nav }

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [auth,  setAuth]  = useState(isAuthenticated)

  useEffect(() => {
    injectCSS()
    const h = () => setRoute(getRoute())
    window.addEventListener('popstate', h)
    return () => window.removeEventListener('popstate', h)
  }, [])

  if (route.page === 'proposal') {
    return <ProposalView id={route.id} onBack={() => nav('/')} />
  }

  if (route.page === 'admin') {
    if (!auth) return <AdminLogin onSuccess={() => setAuth(true)} />
    return <AdminPanel />
  }

  return <HomePage />
}
