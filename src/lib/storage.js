import { createClient } from '@supabase/supabase-js'

// ── Supabase client ───────────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://ghtsrjmhncjwmgcbzmts.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodHNyam1obmNqd21nY2J6bXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODU5NzAsImV4cCI6MjA5Njc2MTk3MH0.QVf7Vnd_RIfJvElrunGP-oS3BFydPq1Njp0xCEHwq3k'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

// ── Auth (localStorage — só admin local) ─────────────────────────────────────
const ADMIN_PASSWORD = 'hihat2025'
const SESSION_KEY    = 'hihat_admin_session'

export const isAuthenticated = () => {
  try { return localStorage.getItem(SESSION_KEY) === '1' } catch { return false }
}
export const login  = () => { try { localStorage.setItem(SESSION_KEY, '1') } catch {} }
export const logout = () => { try { localStorage.removeItem(SESSION_KEY)   } catch {} }
export const checkPassword = (pw) => pw === ADMIN_PASSWORD

// ── Utils ─────────────────────────────────────────────────────────────────────
export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2)

export const fmt = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// ── Proposals ────────────────────────────────────────────────────────────────
export const getProposals = async () => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

export const getProposalById = async (id) => {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', id)
    .single()
  if (error) { console.error(error); return null }
  return data
}

export const upsertProposal = async (proposal) => {
  const { data, error } = await supabase
    .from('proposals')
    .upsert(proposal, { onConflict: 'id' })
    .select()
    .single()
  if (error) { console.error(error); return null }
  return data
}

export const deleteProposal = async (id) => {
  const { error } = await supabase
    .from('proposals')
    .delete()
    .eq('id', id)
  if (error) console.error(error)
}

export const updateProposalStatus = async (id, status) => {
  const { error } = await supabase
    .from('proposals')
    .update({ status })
    .eq('id', id)
  if (error) console.error(error)
}

// ── Leads ─────────────────────────────────────────────────────────────────────
export const getLeads = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('id', { ascending: false })
  if (error) { console.error(error); return [] }
  return data || []
}

export const addLead = async (lead) => {
  const { error } = await supabase
    .from('leads')
    .insert({ ...lead, created_at: new Date().toLocaleDateString('pt-BR') })
  if (error) console.error(error)
}
