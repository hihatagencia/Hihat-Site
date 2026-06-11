import { useState, useEffect } from 'react'
import { getProposalById, updateProposalStatus, fmt } from '../lib/storage'
import Icon from './Icons'

function GradText({ children, style = {} }) {
  return (
    <span style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', ...style }}>
      {children}
    </span>
  )
}

export default function ProposalView({ id, onBack }) {
  const [unlocked, setUnlocked] = useState(false)
  const [phone,    setPhone]    = useState('')
  const [err,      setErr]      = useState('')
  const [verdict,  setVerdict]  = useState(null) // 'accepted' | 'declined'
  const [proposal, setProposal] = useState(null)

  useEffect(() => {
    const p = getProposalById(id)
    setProposal(p)
    if (p?.status === 'accepted' || p?.status === 'declined') setVerdict(p.status)
  }, [id])

  if (!proposal) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--sans)', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 40, opacity: .3 }}>🔍</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>Proposta não encontrada.</div>
      {onBack && <button className="btn-ghost" onClick={onBack}>← Voltar</button>}
    </div>
  )

  const tryUnlock = () => {
    const clean = v => v.replace(/\D/g, '')
    if (clean(phone) === clean(proposal.clientPhone)) {
      setUnlocked(true)
      if (proposal.status === 'active') {
        updateProposalStatus(id, 'viewed')
        setProposal({ ...proposal, status: 'viewed' })
      }
      setErr('')
    } else {
      setErr('Número incorreto. Tente novamente.')
    }
  }

  const handleVerdict = (v) => {
    updateProposalStatus(id, v)
    setVerdict(v)
  }

  // ── Tela de desbloqueio ───────────────────────────────────────────────────
  if (!unlocked) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 20 }}>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--r16)', padding: 48, width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, background: 'rgba(255,107,0,.1)', border: '1px solid rgba(255,107,0,.25)', borderRadius: 'var(--r12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--a2)' }}>
          <Icon n="lk" s={22} />
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 22, fontWeight: 800, color: 'var(--fg)', marginBottom: 6, letterSpacing: -1 }}>
          Acesso à Proposta
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg40)', marginBottom: 28, letterSpacing: .5 }}>
          Digite seu número de celular para acessar
        </div>

        {err && (
          <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 'var(--r8)', padding: '9px 13px', fontSize: 12, color: '#ef4444', marginBottom: 14 }}>
            {err}
          </div>
        )}

        <div className="field" style={{ marginBottom: 16, textAlign: 'left' }}>
          <label>Celular</label>
          <input className="fi" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 9 9999-9999" onKeyDown={e => e.key === 'Enter' && tryUnlock()} autoFocus />
        </div>
        <button className="btn-grad" style={{ width: '100%', justifyContent: 'center' }} onClick={tryUnlock}>
          Ver proposta <Icon n="ar" s={14} />
        </button>
      </div>
    </div>
  )

  const p = proposal

  // ── Tela de veredito já dado ───────────────────────────────────────────────
  if (verdict) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 20 }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>{verdict === 'accepted' ? '🎉' : '👋'}</div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 28, fontWeight: 900, color: 'var(--fg)', letterSpacing: -1.5, marginBottom: 12 }}>
          {verdict === 'accepted' ? 'Proposta aceita!' : 'Tudo bem!'}
        </div>
        <div style={{ fontSize: 15, color: 'var(--fg40)', lineHeight: 1.8, marginBottom: 28 }}>
          {verdict === 'accepted'
            ? 'Ótimo! Entraremos em contato em breve para dar início ao projeto. Aguarde nosso retorno.'
            : 'Obrigado pelo retorno. Se mudar de ideia ou quiser conversar, é só nos chamar.'}
        </div>
        <a
          href={`https://wa.me/5511941543335?text=Olá Ednilson! ${verdict === 'accepted' ? 'Acabei de aceitar a proposta' : 'Vi a proposta'} de ${p.headline || 'vocês'}.`}
          target="_blank" rel="noopener noreferrer"
          className="btn-grad" style={{ justifyContent: 'center', textDecoration: 'none' }}
        >
          <Icon n="wa" s={15} /> Falar no WhatsApp
        </a>
      </div>
    </div>
  )

  // ── Proposta completa ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--sans)' }}>

      {/* Nav sticky */}
      <div style={{ position: 'sticky', top: 0, background: 'rgba(13,13,13,.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '13px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 18, fontWeight: 900, color: 'var(--fg)', letterSpacing: -1 }}>
          <GradText>hi</GradText>hat
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg40)', letterSpacing: .5 }}>
          Proposta para {p.clientName}
        </div>
        {onBack && <button className="btn-ghost" onClick={onBack}>← Voltar</button>}
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 32px 100px' }}>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 56, paddingBottom: 56, borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--a2)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>
            hihat agency · Proposta Comercial
          </div>
          <h1 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 900, letterSpacing: -3, lineHeight: .92, color: 'var(--fg)', marginBottom: 16 }}>
            {p.headline || 'Proposta Comercial'}
          </h1>
          {p.subheadline && (
            <div style={{ fontSize: 18, color: 'var(--fg40)', marginBottom: 20 }}>{p.subheadline}</div>
          )}
          {(p.badges || []).length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {p.badges.map((b, i) => (
                <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '5px 14px', border: '1px solid rgba(255,107,0,.3)', borderRadius: 'var(--r100)', color: 'var(--a2)', background: 'rgba(255,107,0,.08)', letterSpacing: 1 }}>
                  {b}
                </span>
              ))}
            </div>
          )}
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg40)', letterSpacing: .5 }}>
            Válida por {p.validity || 7} dias · Emitida em {p.createdAt}
          </div>
        </div>

        {/* ── Introdução ───────────────────────────────────────── */}
        {p.intro && (
          <div style={{ marginBottom: 56, paddingBottom: 56, borderBottom: '1px solid var(--border)' }}>
            <div className="sec-label">Contexto</div>
            <p style={{ fontSize: 15, color: 'var(--fg40)', lineHeight: 1.85 }}>{p.intro}</p>
          </div>
        )}

        {/* ── Serviços ──────────────────────────────────────────── */}
        {(p.services || []).length > 0 && (
          <div style={{ marginBottom: 56, paddingBottom: 56, borderBottom: '1px solid var(--border)' }}>
            <div className="sec-label">O que será entregue</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {p.services.map((svc, i) => (
                <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r16)', padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, background: 'rgba(255,107,0,.1)', border: '1px solid rgba(255,107,0,.25)', color: 'var(--a2)', padding: '3px 10px', borderRadius: 'var(--r4)' }}>
                      0{i + 1}
                    </span>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 17, fontWeight: 800, color: 'var(--fg)' }}>{svc.label}</div>
                  </div>
                  {svc.deliverables && (
                    <p style={{ fontSize: 14, color: 'var(--fg40)', lineHeight: 1.8, marginBottom: 16 }}>{svc.deliverables}</p>
                  )}
                  {(svc.includes || []).filter(Boolean).length > 0 && (
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--fg40)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Incluso</div>
                      {svc.includes.filter(Boolean).map((inc, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                          <span style={{ color: 'var(--a2)', fontSize: 12, flexShrink: 0 }}>→</span>
                          <span style={{ fontSize: 13, color: 'var(--fg40)' }}>{inc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Investimento ──────────────────────────────────────── */}
        <div style={{ marginBottom: 56, paddingBottom: 56, borderBottom: '1px solid var(--border)' }}>
          <div className="sec-label">Investimento</div>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r16)', overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 120px', padding: '11px 20px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--fg40)' }}>
              <span>Serviço</span><span style={{ textAlign: 'center' }}>Qtd</span><span style={{ textAlign: 'right' }}>Valor</span>
            </div>
            {(p.items || []).map((it, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 120px', padding: '14px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{it.desc}</div>
                <div style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg40)' }}>{it.qty}</div>
                <div style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>
                  {fmt((parseFloat(it.price) || 0) * (parseInt(it.qty) || 1))}
                </div>
              </div>
            ))}
            {(parseFloat(p.discount) || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, color: '#22c55e' }}>
                <span>Desconto</span><span>-{fmt(p.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)' }}>Total</span>
              <span style={{ fontSize: 30, fontWeight: 900, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {fmt(p.total || 0)}
              </span>
            </div>
          </div>

          {/* Pagamento */}
          {(p.payment || []).length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(p.payment.length, 3)}, 1fr)`, gap: 10 }}>
              {p.payment.map((pm, i) => (
                <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r12)', padding: 18, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--a2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{pm.badge}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--fg)', marginBottom: 3 }}>{pm.value || '—'}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg40)' }}>{pm.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Cronograma ────────────────────────────────────────── */}
        {(p.timeline || []).filter(t => t.event).length > 0 && (
          <div style={{ marginBottom: 56, paddingBottom: 56, borderBottom: '1px solid var(--border)' }}>
            <div className="sec-label">Cronograma</div>
            {p.timeline.filter(t => t.event).map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 20, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--a2)' }}>{t.period}</div>
                <div style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 600 }}>{t.event}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Nota de fechamento ────────────────────────────────── */}
        {p.closingNote && (
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r12)', padding: 24, marginBottom: 56, fontSize: 14, color: 'var(--fg40)', lineHeight: 1.8 }}>
            {p.closingNote}
          </div>
        )}

        {/* ── Veredito ──────────────────────────────────────────── */}
        <div style={{ background: 'var(--bg3)', border: '1px solid rgba(255,107,0,.2)', borderRadius: 'var(--r16)', padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--fg)', marginBottom: 8, letterSpacing: -1 }}>
            O que você decide?
          </div>
          <div style={{ fontSize: 14, color: 'var(--fg40)', marginBottom: 28, lineHeight: 1.7 }}>
            Aceite a proposta aqui mesmo ou nos chame no WhatsApp se tiver dúvidas antes de decidir.
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-grad"
              style={{ justifyContent: 'center', padding: '15px 36px', fontSize: 15 }}
              onClick={() => handleVerdict('accepted')}
            >
              <Icon n="ok" s={16} /> Aceitar proposta
            </button>
            <a
              href={`https://wa.me/5511941543335?text=Oi Ednilson! Tenho uma dúvida sobre a proposta "${p.headline || ''}".`}
              target="_blank" rel="noopener noreferrer"
              className="btn-outline"
              style={{ textDecoration: 'none', justifyContent: 'center', padding: '14px 28px' }}
            >
              <Icon n="wa" s={15} /> Tirar dúvida
            </a>
            <button
              className="btn-danger"
              style={{ padding: '14px 22px' }}
              onClick={() => handleVerdict('declined')}
            >
              <Icon n="cl" s={14} /> Recusar
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
