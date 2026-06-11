import { useState, useEffect } from 'react'

const DRAFT_KEY = 'hihat_proposal_draft'
const loadDraft = () => { try { const r = localStorage.getItem(DRAFT_KEY); return r ? JSON.parse(r) : null } catch { return null } }
const saveDraft = (d) => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)) } catch {} }
const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY) } catch {} }
import { fmt, generateId, upsertProposal } from '../lib/storage'
import Icon from './Icons'

const STEPS = ['Cliente', 'Apresentação', 'Serviços', 'Investimento', 'Condições', 'Revisão']

const SERVICES = [
  { id: 'trafego',    label: 'Gestão de Tráfego Pago', desc: 'Meta Ads e Google Ads' },
  { id: 'social',     label: 'Social Media',            desc: 'Gestão de redes sociais' },
  { id: 'site',       label: 'Site',                    desc: 'Criação de site/landing page' },
  { id: 'marketing',  label: 'Marketing Completo',      desc: 'Estratégia integrada' },
  { id: 'identidade', label: 'Identidade Visual',       desc: 'Logo e branding' },
  { id: 'custom',     label: 'Outro',                   desc: 'Serviço personalizado' },
]

export default function BuilderModal({ init, onClose, onSaved, showToast }) {
  const isEdit = !!init

  // step 0
  const [clientName,  setClientName]  = useState(init?.client_name  || '')
  const [clientPhone, setClientPhone] = useState(init?.client_phone || '')
  const [clientEmail, setClientEmail] = useState(init?.client_email || '')
  const [validity,    setValidity]    = useState(init?.validity    || '7')

  // step 1
  const [headline,    setHeadline]    = useState(init?.headline    || '')
  const [subheadline, setSubheadline] = useState(init?.subheadline || '')
  const [intro,       setIntro]       = useState(init?.intro       || '')
  const [badges,      setBadges]      = useState(init?.badges      || [])

  // step 2
  const [selectedSvcs, setSelectedSvcs] = useState(init?.services || [])

  const toggleSvc = (svc) => {
    const exists = selectedSvcs.find(s => s.id === svc.id)
    if (exists) setSelectedSvcs(selectedSvcs.filter(s => s.id !== svc.id))
    else setSelectedSvcs([...selectedSvcs, { ...svc, includes: [''], deliverables: '' }])
  }
  const updateSvcField  = (id, f, v) => setSelectedSvcs(selectedSvcs.map(s => s.id === id ? { ...s, [f]: v } : s))
  const addInclude      = (id)       => setSelectedSvcs(selectedSvcs.map(s => s.id === id ? { ...s, includes: [...s.includes, ''] } : s))
  const updateInclude   = (id, i, v) => setSelectedSvcs(selectedSvcs.map(s => { if (s.id !== id) return s; const inc = [...s.includes]; inc[i] = v; return { ...s, includes: inc } }))
  const removeInclude   = (id, i)    => setSelectedSvcs(selectedSvcs.map(s => s.id !== id ? s : { ...s, includes: s.includes.filter((_, j) => j !== i) }))

  // step 3
  const [items,    setItems]    = useState(init?.items    || [{ desc: '', qty: 1, price: '' }])
  const [discount, setDiscount] = useState(init?.discount || '')
  const addItem    = ()        => setItems([...items, { desc: '', qty: 1, price: '' }])
  const removeItem = (i)       => setItems(items.filter((_, j) => j !== i))
  const updateItem = (i, f, v) => { const n = [...items]; n[i] = { ...n[i], [f]: v }; setItems(n) }
  const subtotal = items.reduce((s, it) => s + (parseFloat(it.price) || 0) * (parseInt(it.qty) || 1), 0)
  const total    = subtotal - (parseFloat(discount) || 0)

  // step 4
  const [payment,     setPayment]     = useState(init?.payment     || [{ label: 'Entrada', badge: 'Início', value: '' }, { label: '30 dias', badge: '30d', value: '' }])
  const [timeline,    setTimeline]    = useState(init?.timeline    || [{ period: 'Semana 1', event: '' }, { period: 'Semana 2–3', event: '' }, { period: 'Semana 4', event: '' }])
  const [closingNote, setClosingNote] = useState(init?.closing_note || 'Após o aceite, enviaremos o contrato para assinatura e iniciamos o onboarding.')
  const addPayment  = () => setPayment([...payment, { label: '', badge: '', value: '' }])
  const updPay      = (i, f, v) => { const n = [...payment]; n[i] = { ...n[i], [f]: v }; setPayment(n) }
  const addTimeline = () => setTimeline([...timeline, { period: '', event: '' }])
  const updTL       = (i, f, v) => { const n = [...timeline]; n[i] = { ...n[i], [f]: v }; setTimeline(n) }

  const [step,    setStep]    = useState(() => {
    if (isEdit) return 0
    const d = loadDraft()
    return d?.step || 0
  })
  const [saving,  setSaving]  = useState(false)

  // Carrega rascunho ao abrir (nova proposta)
  useEffect(() => {
    if (isEdit) return
    const d = loadDraft()
    if (!d || !d.clientName) return
    if (confirm('Encontramos um rascunho não salvo. Deseja continuar de onde parou?')) {
      if (d.clientName)   setClientName(d.clientName)
      if (d.clientPhone)  setClientPhone(d.clientPhone)
      if (d.clientEmail)  setClientEmail(d.clientEmail)
      if (d.validity)     setValidity(d.validity)
      if (d.headline)     setHeadline(d.headline)
      if (d.subheadline)  setSubheadline(d.subheadline)
      if (d.intro)        setIntro(d.intro)
      if (d.badges)       setBadges(d.badges)
      if (d.selectedSvcs) setSelectedSvcs(d.selectedSvcs)
      if (d.items)        setItems(d.items)
      if (d.discount)     setDiscount(d.discount)
      if (d.payment)      setPayment(d.payment)
      if (d.timeline)     setTimeline(d.timeline)
      if (d.closingNote)  setClosingNote(d.closingNote)
    } else { clearDraft() }
  }, [])

  // Auto-save rascunho a cada mudança
  useEffect(() => {
    if (isEdit) return
    saveDraft({ clientName, clientPhone, clientEmail, validity, headline, subheadline, intro, badges, selectedSvcs, items, discount, payment, timeline, closingNote, step })
  }, [clientName, clientPhone, clientEmail, validity, headline, subheadline, intro, badges, selectedSvcs, items, discount, payment, timeline, closingNote, step])

  const save = async () => {
    if (!clientName || !clientPhone) { showToast('Preencha nome e celular do cliente', 'err'); setStep(0); return }
    setSaving(true)
    const id = init?.id || generateId()
    const proposal = {
      id,
      client_name:  clientName,
      client_phone: clientPhone,
      client_email: clientEmail,
      validity,
      headline,
      subheadline,
      intro,
      badges:       badges.filter(Boolean),
      services:     selectedSvcs,
      items,
      discount:     parseFloat(discount) || 0,
      subtotal,
      total,
      payment,
      timeline,
      closing_note: closingNote,
      status:       init?.status || 'active',
      created_at:   init?.created_at || new Date().toLocaleDateString('pt-BR'),
    }
    await upsertProposal(proposal)
    clearDraft()
    await onSaved()
    showToast(isEdit ? 'Proposta atualizada!' : 'Proposta criada!')
    setSaving(false)
    onClose()
  }

  const G = { background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget && confirm('Tem certeza? As alterações não salvas serão perdidas.')) onClose() }}>
      <div className="modal" style={{ maxWidth: 860 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 20, fontWeight: 800, color: 'var(--fg)', letterSpacing: -1 }}>
              {isEdit ? 'Editar' : 'Nova'} Proposta
            </div>
            {clientName && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg40)', marginTop: 2 }}>{clientName}</div>}
          </div>
          <button className="btn-icon" onClick={onClose}><Icon n="cl" s={14} /></button>
        </div>

        {/* Steps nav */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
              padding: '5px 12px', borderRadius: 'var(--r100)', cursor: 'pointer', border: '1.5px solid', transition: 'all .2s',
              background: step === i ? 'var(--grad)' : 'transparent',
              color: step === i ? '#fff' : 'var(--fg40)',
              borderColor: step === i ? 'transparent' : 'var(--border2)',
            }}>{i + 1}. {s}</button>
          ))}
        </div>

        {/* ── Step 0: Cliente ── */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field"><label>Nome / Empresa *</label><input className="fi" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ex: Mariana Silva" /></div>
              <div className="field"><label>Celular (senha de acesso) *</label><input className="fi" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="(11) 9 9999-9999" /></div>
            </div>
            <div className="field"><label>E-mail</label><input className="fi" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="cliente@email.com" /></div>
            <div className="field" style={{ maxWidth: 160 }}><label>Validade (dias)</label><input className="fi" type="number" value={validity} onChange={e => setValidity(e.target.value)} /></div>
            <div style={{ background: 'rgba(255,107,0,.08)', border: '1px solid rgba(255,107,0,.2)', borderRadius: 'var(--r8)', padding: '10px 14px', fontSize: 12, color: 'var(--fg40)', display: 'flex', gap: 8 }}>
              <Icon n="lk" s={13} /> O celular é a senha que o cliente usará para abrir a proposta.
            </div>
          </div>
        )}

        {/* ── Step 1: Apresentação ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field"><label>Headline da proposta</label><input className="fi" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Ex: Proposta de Marketing Digital Completo" /></div>
            <div className="field"><label>Subheadline / Programa</label><input className="fi" value={subheadline} onChange={e => setSubheadline(e.target.value)} placeholder='Ex: Programa "Marca que Vende"' /></div>
            <div className="field"><label>Introdução / Diagnóstico</label><textarea className="fta" value={intro} onChange={e => setIntro(e.target.value)} placeholder="Descreva o contexto do cliente e o que a hihat vai resolver..." style={{ minHeight: 120 }} /></div>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--a2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Badges de destaque</div>
              {badges.map((b, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 34px', gap: 8, marginBottom: 8 }}>
                  <input className="fi" value={b} onChange={e => { const n = [...badges]; n[i] = e.target.value; setBadges(n) }} placeholder={`Destaque ${i + 1}`} />
                  <button className="btn-icon del" onClick={() => setBadges(badges.filter((_, j) => j !== i))}><Icon n="tr" s={13} /></button>
                </div>
              ))}
              <button className="add-btn" onClick={() => setBadges([...badges, ''])}><Icon n="pl" s={13} /> Adicionar badge</button>
            </div>
          </div>
        )}

        {/* ── Step 2: Serviços ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--a2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Selecione os serviços</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {SERVICES.map(svc => {
                  const active = !!selectedSvcs.find(s => s.id === svc.id)
                  return (
                    <button key={svc.id} onClick={() => toggleSvc(svc)} style={{
                      background: active ? 'rgba(255,107,0,.1)' : 'var(--bg4)',
                      border: active ? '1.5px solid rgba(255,107,0,.4)' : '1px solid var(--border)',
                      borderRadius: 'var(--r12)', padding: '12px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all .2s', fontFamily: 'var(--sans)',
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: active ? 'var(--a2)' : 'var(--fg)', marginBottom: 2 }}>{svc.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg40)' }}>{svc.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>
            {selectedSvcs.map(svc => (
              <div key={svc.id} style={{ background: 'var(--bg4)', border: '1px solid rgba(255,107,0,.2)', borderRadius: 'var(--r12)', padding: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--a2)', marginBottom: 14 }}>{svc.label}</div>
                <div className="field" style={{ marginBottom: 12 }}>
                  <label>Descrição do serviço</label>
                  <textarea className="fta" value={svc.deliverables} onChange={e => updateSvcField(svc.id, 'deliverables', e.target.value)} placeholder="Descreva o que será entregue..." style={{ minHeight: 80 }} />
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--fg40)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>O que está incluso</div>
                {svc.includes.map((inc, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 34px', gap: 8, marginBottom: 7 }}>
                    <input className="fi" value={inc} onChange={e => updateInclude(svc.id, idx, e.target.value)} placeholder={`Item ${idx + 1}`} />
                    <button className="btn-icon del" onClick={() => removeInclude(svc.id, idx)}><Icon n="tr" s={13} /></button>
                  </div>
                ))}
                <button className="add-btn" onClick={() => addInclude(svc.id)} style={{ marginTop: 4 }}><Icon n="pl" s={13} /> Add item</button>
              </div>
            ))}
          </div>
        )}

        {/* ── Step 3: Investimento ── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--a2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Itens do investimento</div>
            {items.map((it, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 110px 34px', gap: 8, alignItems: 'center' }}>
                <input className="fi" value={it.desc}  onChange={e => updateItem(i, 'desc',  e.target.value)} placeholder="Descrição do item" />
                <input className="fi" type="number" value={it.qty} onChange={e => updateItem(i, 'qty', e.target.value)} placeholder="Qtd" style={{ textAlign: 'center' }} />
                <input className="fi" value={it.price} onChange={e => updateItem(i, 'price', e.target.value)} placeholder="R$ Valor" />
                <button className="btn-icon del" onClick={() => removeItem(i)}><Icon n="tr" s={13} /></button>
              </div>
            ))}
            <button className="add-btn" onClick={addItem}><Icon n="pl" s={13} /> Adicionar item</button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 12 }}>
              <div /><div className="field"><label>Desconto (R$)</label><input className="fi" type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0" /></div>
            </div>
            <div style={{ background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: 'var(--r12)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--fg40)', fontWeight: 600 }}>Total da proposta</div>
              <div style={{ fontSize: 26, fontWeight: 800, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{fmt(total)}</div>
            </div>
          </div>
        )}

        {/* ── Step 4: Condições ── */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--a2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Condições de pagamento</div>
              {payment.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px 34px', gap: 8, marginBottom: 8 }}>
                  <input className="fi" value={p.label} onChange={e => updPay(i, 'label', e.target.value)} placeholder="Label (ex: Entrada)" />
                  <input className="fi" value={p.badge} onChange={e => updPay(i, 'badge', e.target.value)} placeholder="Badge" />
                  <input className="fi" value={p.value} onChange={e => updPay(i, 'value', e.target.value)} placeholder="Valor ou %" />
                  <button className="btn-icon del" onClick={() => setPayment(payment.filter((_, j) => j !== i))}><Icon n="tr" s={13} /></button>
                </div>
              ))}
              <button className="add-btn" onClick={addPayment}><Icon n="pl" s={13} /> Add parcela</button>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--a2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Cronograma de entregas</div>
              {timeline.map((t, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 34px', gap: 8, marginBottom: 8 }}>
                  <input className="fi" value={t.period} onChange={e => updTL(i, 'period', e.target.value)} placeholder="Período" />
                  <input className="fi" value={t.event}  onChange={e => updTL(i, 'event',  e.target.value)} placeholder="Entrega / Marco" />
                  <button className="btn-icon del" onClick={() => setTimeline(timeline.filter((_, j) => j !== i))}><Icon n="tr" s={13} /></button>
                </div>
              ))}
              <button className="add-btn" onClick={addTimeline}><Icon n="pl" s={13} /> Add etapa</button>
            </div>
            <div className="field"><label>Nota de fechamento</label><textarea className="fta" value={closingNote} onChange={e => setClosingNote(e.target.value)} style={{ minHeight: 80 }} /></div>
          </div>
        )}

        {/* ── Step 5: Revisão ── */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: 'var(--r12)', padding: 20 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--a2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Resumo</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                {[
                  ['Cliente',  clientName  || '—'],
                  ['Celular',  clientPhone || '—'],
                  ['Headline', headline    || '—'],
                  ['Serviços', selectedSvcs.map(s => s.label).join(', ') || '—'],
                  ['Total',    fmt(total)],
                  ['Validade', `${validity} dias`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--fg40)', letterSpacing: 1, marginBottom: 3, textTransform: 'uppercase' }}>{k}</div>
                    <div style={{ color: 'var(--fg)', fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            {!clientName  && <div style={{ color: '#ef4444', fontSize: 12 }}>⚠ Preencha o nome do cliente (etapa 1)</div>}
            {!clientPhone && <div style={{ color: '#ef4444', fontSize: 12 }}>⚠ Preencha o celular do cliente (etapa 1)</div>}
          </div>
        )}

        {/* Navegação */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button className="btn-outline" onClick={onClose}>Cancelar</button>
          {step > 0 && <button className="btn-outline" onClick={() => setStep(step - 1)}>← Anterior</button>}
          {step < STEPS.length - 1
            ? <button className="btn-grad" onClick={() => setStep(step + 1)}>Próximo →</button>
            : <button className="btn-grad" disabled={saving} onClick={save}><Icon n="ok" s={14} /> {saving ? 'Salvando...' : 'Salvar proposta'}</button>
          }
        </div>
      </div>
    </div>
  )
}
