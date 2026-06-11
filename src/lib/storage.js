// ── STORAGE ──────────────────────────────────────────────────────────────────
// Camada de abstração: hoje usa localStorage, depois migra pro Supabase
// sem mudar nada nos componentes.

const KEYS = {
  proposals: 'hihat_proposals',
  leads:     'hihat_leads',
  session:   'hihat_admin_session',
}

const ADMIN_PASSWORD = 'hihat2025'

// ── Auth ─────────────────────────────────────────────────────────────────────
export const isAuthenticated = () => {
  try { return localStorage.getItem(KEYS.session) === '1' } catch { return false }
}
export const login  = () => { try { localStorage.setItem(KEYS.session, '1') } catch {} }
export const logout = () => { try { localStorage.removeItem(KEYS.session) } catch {} }
export const checkPassword = (pw) => pw === ADMIN_PASSWORD

// ── Proposals ────────────────────────────────────────────────────────────────
export const getProposals = () => {
  try {
    const raw = localStorage.getItem(KEYS.proposals)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export const saveProposals = (data) => {
  try { localStorage.setItem(KEYS.proposals, JSON.stringify(data)) } catch {}
}

export const getProposalById = (id) => {
  const all = getProposals()
  return Object.values(all).find(p => p.id === id) || null
}

export const upsertProposal = (proposal) => {
  const all = getProposals()
  all[proposal.id] = proposal
  saveProposals(all)
  return proposal
}

export const deleteProposal = (id) => {
  const all = getProposals()
  delete all[id]
  saveProposals(all)
}

export const updateProposalStatus = (id, status) => {
  const all = getProposals()
  if (all[id]) { all[id].status = status; saveProposals(all) }
}

// ── Leads ─────────────────────────────────────────────────────────────────────
export const getLeads = () => {
  try {
    const raw = localStorage.getItem(KEYS.leads)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export const addLead = (lead) => {
  const leads = getLeads()
  leads.push({ ...lead, createdAt: new Date().toLocaleDateString('pt-BR') })
  try { localStorage.setItem(KEYS.leads, JSON.stringify(leads)) } catch {}
}

// ── Utils ─────────────────────────────────────────────────────────────────────
export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2)

export const fmt = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
