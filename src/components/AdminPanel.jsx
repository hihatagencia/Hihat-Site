import { useState, useEffect } from 'react'
import { getProposals, deleteProposal, logout, getLeads, fmt } from '../lib/storage'
import BuilderModal from './BuilderModal'
import ProposalView from './ProposalView'
import Icon from './Icons'

function Toast({ toast }) {
  if (!toast) return null
  return <div className={`toast ${toast.type}`}>{toast.msg}</div>
}

const statusLabel = { active: 'Ativa', viewed: 'Vista', accepted: 'Aceita', declined: 'Recusada' }
const statusClass  = { active: 'badge-active', viewed: 'badge-viewed', accepted: 'badge-accepted', declined: 'badge-declined' }

export default function AdminPanel() {
  const [tab,         setTab]         = useState('proposals')
  const [proposals,   setProposals]   = useState([])
  const [leads,       setLeads]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [showBuilder, setShowBuilder] = useState(false)
  const [editProposal,setEditProposal]= useState(null)
  const [viewId,      setViewId]      = useState(null)
  const [toast,       setToast]       = useState(null)

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const refresh = async () => {
    setLoading(true)
    const [ps, ls] = await Promise.all([getProposals(), getLeads()])
    setProposals(ps)
    setLeads(ls)
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta proposta?')) return
    await deleteProposal(id)
    await refresh()
    showToast('Proposta excluída.')
  }

  const copyLink = (p) => {
    const url = `${window.location.origin}/?proposta=${p.id}`
    navigator.clipboard?.writeText(url)
      .then(() => showToast('Link copiado!'))
      .catch(() => showToast('Copie: ' + url))
  }

  const G = { background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }

  if (viewId) return (
    <ProposalView id={viewId} onBack={() => { setViewId(null); refresh() }} />
  )

  return (
    <div className="adm-wrap">
      <Toast toast={toast} />

      {/* Sidebar */}
      <div className="adm-sidebar">
        <div style={{ fontFamily: 'var(--sans)', fontSize: 20, fontWeight: 900, marginBottom: 28, padding: '0 6px', letterSpacing: -1, color: 'var(--fg)' }}>
          <span style={G}>hi</span>hat
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--fg40)', padding: '0 6px', marginBottom: 6, letterSpacing: 2, textTransform: 'uppercase' }}>Menu</div>
        {[['proposals','fi','Propostas'],['leads','users','Leads']].map(([id, ic, lbl]) => (
          <button key={id} className={`sb-item${tab === id ? ' on' : ''}`} onClick={() => setTab(id)}>
            <Icon n={ic} s={14} /> {lbl}
          </button>
        ))}
        <div style={{ marginTop: 'auto' }}>
          <button className="sb-item" onClick={() => { logout(); window.location.reload() }}>
            <Icon n="lo" s={14} /> Sair
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="adm-main">

        {/* ── Propostas ── */}
        {tab === 'proposals' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 24, fontWeight: 900, letterSpacing: -1, color: 'var(--fg)' }}>Propostas</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg40)', marginTop: 3 }}>{proposals.length} proposta{proposals.length !== 1 ? 's' : ''}</div>
              </div>
              <button className="btn-grad" onClick={() => { setEditProposal(null); setShowBuilder(true) }}>
                <Icon n="pl" s={14} /> Nova proposta
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
              {[
                ['fi',    'Total',     proposals.length],
                ['ey',    'Vistas',    proposals.filter(p => ['viewed','accepted','declined'].includes(p.status)).length],
                ['ok',    'Aceitas',   proposals.filter(p => p.status === 'accepted').length],
                ['cl',    'Recusadas', proposals.filter(p => p.status === 'declined').length],
                ['dl',    'Receita',   fmt(proposals.filter(p => p.status === 'accepted').reduce((s, p) => s + (p.total || 0), 0))],
              ].map(([ic, lbl, val], i) => (
                <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r12)', padding: 18 }}>
                  <div style={{ width: 32, height: 32, background: 'rgba(255,107,0,.08)', border: '1px solid rgba(255,107,0,.15)', borderRadius: 'var(--r8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a2)', marginBottom: 10 }}>
                    <Icon n={ic} s={14} />
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 22, fontWeight: 800, color: 'var(--fg)', marginBottom: 2 }}>{val}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg40)' }}>{lbl}</div>
                </div>
              ))}
            </div>

            {/* Tabela */}
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r12)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 90px 100px 120px 140px', padding: '11px 18px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--fg40)' }}>
                <span>Cliente</span><span>Proposta</span><span>Status</span><span>Data</span><span>Total</span><span>Ações</span>
              </div>

              {loading ? (
                <div style={{ padding: '32px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg40)' }}>Carregando...</div>
              ) : proposals.length === 0 ? (
                <div style={{ padding: '40px 18px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg40)' }}>
                  Nenhuma proposta criada ainda.<br />
                  <button className="btn-ghost" style={{ marginTop: 12 }} onClick={() => setShowBuilder(true)}>Criar a primeira →</button>
                </div>
              ) : proposals.map(p => (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 90px 100px 120px 140px', padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', alignItems: 'center', transition: 'background .2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--fg15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--fg)' }}>{p.client_name}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg40)', marginTop: 1 }}>{p.client_phone}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg40)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{p.headline || '—'}</div>
                  <div><span className={`badge ${statusClass[p.status] || 'badge-active'}`}>{statusLabel[p.status] || 'Ativa'}</span></div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg40)' }}>{p.created_at}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{fmt(p.total || 0)}</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn-icon" title="Visualizar" onClick={() => setViewId(p.id)}><Icon n="ey" s={13} /></button>
                    <button className="btn-icon" title="Copiar link" onClick={() => copyLink(p)}><Icon n="cp" s={13} /></button>
                    <button className="btn-icon" title="Editar" onClick={() => { setEditProposal(p); setShowBuilder(true) }}><Icon n="ed" s={13} /></button>
                    <button className="btn-icon del" title="Excluir" onClick={() => handleDelete(p.id)}><Icon n="tr" s={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Leads ── */}
        {tab === 'leads' && (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 24, fontWeight: 900, letterSpacing: -1, color: 'var(--fg)' }}>Leads</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg40)', marginTop: 3 }}>{leads.length} contato{leads.length !== 1 ? 's' : ''}</div>
            </div>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r12)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 120px', padding: '11px 18px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--fg40)' }}>
                <span>Nome</span><span>E-mail</span><span>Empresa</span><span>Data</span>
              </div>
              {loading ? (
                <div style={{ padding: '24px', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg40)' }}>Carregando...</div>
              ) : leads.length === 0 ? (
                <div style={{ padding: '32px 18px', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg40)' }}>Nenhum lead ainda.</div>
              ) : leads.map((l, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 120px', padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,.04)', fontSize: 13, color: 'var(--fg)' }}>
                  <span>{l.nome || '—'}</span>
                  <span style={{ color: 'var(--fg40)' }}>{l.email}</span>
                  <span style={{ color: 'var(--fg40)' }}>{l.empresa || '—'}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg40)' }}>{l.created_at}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showBuilder && (
        <BuilderModal
          init={editProposal}
          onClose={() => { setShowBuilder(false); setEditProposal(null) }}
          onSaved={refresh}
          showToast={showToast}
        />
      )}
    </div>
  )
}
