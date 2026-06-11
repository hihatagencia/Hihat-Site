import { useState, useEffect } from 'react'
import { addLead } from '../lib/storage'
import Icon from '../components/Icons'

function GradText({ children }) {
  return (
    <span style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      {children}
    </span>
  )
}

function scroll(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const SERVICES = [
  {
    icon: 'ig',
    title: 'Social Media',
    desc: 'Planejamento, criação de conteúdo e gestão completa das redes sociais da sua marca — com consistência, identidade e estratégia em cada publicação.',
  },
  {
    icon: 'ch',
    title: 'Gestão de Tráfego Pago',
    desc: 'Campanhas no Meta Ads e Google Ads criadas para gerar resultado real — mais clientes, mais vendas, com verba bem aplicada e otimização contínua.',
  },
  {
    icon: 'tag',
    title: 'Identidade Visual',
    desc: 'Criação de logotipo, paleta de cores, tipografia e todos os elementos visuais que fazem sua marca ser reconhecida e lembrada.',
  },
  {
    icon: 'st',
    title: 'Marketing',
    desc: 'Estratégia integrada — posicionamento, comunicação, presença digital e ações coordenadas para que sua marca cresça de forma consistente.',
  },
]

const PROCESS = [
  { n: '01', t: 'Diagnóstico',   d: 'Entendemos sua marca, mercado, concorrência e público antes de qualquer decisão. Nada de soluções prontas.' },
  { n: '02', t: 'Estratégia',    d: 'Definimos posicionamento, tom de voz, plataformas e metas mensuráveis alinhadas ao seu negócio.' },
  { n: '03', t: 'Produção',      d: 'Criamos conteúdo com identidade visual consistente, copy estratégica e calendário editorial.' },
  { n: '04', t: 'Gestão',        d: 'Publicação, engajamento, comunidade e ajustes táticos baseados nos dados de cada semana.' },
  { n: '05', t: 'Resultados',    d: 'Reports mensais com métricas reais e recomendações para o próximo ciclo. Transparência total.' },
]

const FAQS = [
  { q: 'Quanto custa contratar a hihat?',           a: 'Nossos serviços são personalizados conforme o escopo de cada cliente. Entre em contato para receber uma proposta sem compromisso.' },
  { q: 'Vocês atendem qualquer segmento?',           a: 'Sim! Trabalhamos com marcas de diferentes segmentos — moda, gastronomia, saúde, educação, beleza, serviços e muito mais.' },
  { q: 'Quanto tempo para ver resultados?',          a: 'Os primeiros resultados aparecem entre 30 e 60 dias. Resultados em vendas costumam ser mais sólidos entre 3 e 6 meses de trabalho consistente.' },
  { q: 'Vocês criam os conteúdos?',                  a: 'Sim, nós cuidamos de tudo: estratégia, criação de arte, copy e publicação. Você apenas revisa antes de publicar.' },
  { q: 'Atendem empresas de outras cidades?',        a: 'Sim! Trabalhamos 100% remoto com clientes em todo o Brasil. Reuniões por videochamada e comunicação pelo WhatsApp.' },
  { q: 'Preciso assinar contrato de fidelidade?',    a: 'Não temos fidelidade obrigatória. Recomendamos pelo menos 3 meses para avaliar os resultados com consistência.' },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
        background: 'none', border: 'none', padding: '18px 0', fontFamily: 'var(--sans)',
        fontSize: 14, fontWeight: 600, color: open ? 'var(--a2)' : 'var(--fg)', cursor: 'pointer', textAlign: 'left', transition: 'color .2s',
      }}>
        {q}
        <span style={{ fontSize: 20, color: open ? 'var(--a2)' : 'var(--fg40)', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .25s', flexShrink: 0, lineHeight: 1 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 300 : 0, overflow: 'hidden', transition: 'max-height .35s ease', fontSize: 13, color: 'var(--fg40)', lineHeight: 1.8, paddingBottom: open ? 16 : 0 }}>
        {a}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [stuck,    setStuck]    = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form,     setForm]     = useState({ nome: '', email: '', empresa: '', msg: '' })
  const [sent,     setSent]     = useState(false)

  useEffect(() => {
    const h = () => setStuck(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const handleContact = () => {
    if (!form.nome || !form.email) return
    addLead({ nome: form.nome, email: form.email, empresa: form.empresa, msg: form.msg, source: 'contato' })
    setSent(true)
  }

  const CLIENTS = ['Boutique Estilo','Bistrô Urbano','Studio RF','Café Central','Moda Única','Wellness Co','Urban Store','Fit Life','Saúde & Vida','Move Studio','Flower House','Tech Startup']

  const navLinks = [
    ['Serviços', 'servicos'],
    ['Sobre',    'sobre'],
    ['FAQ',      'faq'],
    ['Contato',  'contato'],
  ]

  // Shared rounded section style
  const secBrand = {
    background: 'var(--grad)',
    color: '#0D0D0D',
    borderRadius: '48px',
    padding: '80px 52px',
    position: 'relative',
    zIndex: 10,
  }
  const secDark = { background: 'var(--bg)', padding: '80px 52px' }

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ── WA Float ─────────────────────────────────────────────────────── */}
      <a href="https://wa.me/5511941543335?text=Olá! Vim pelo site da hihat agency."
        target="_blank" rel="noopener"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 300, width: 52, height: 52,
          background: '#25d366', borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontSize: 22, textDecoration: 'none',
          animation: 'wapulse 3s infinite', transition: 'transform .25s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Icon n="wa" s={24} />
      </a>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, padding: stuck ? '13px 52px' : '20px 52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: stuck ? 'rgba(13,13,13,.96)' : 'transparent',
        backdropFilter: stuck ? 'blur(20px)' : 'none',
        borderBottom: stuck ? '1px solid var(--border)' : 'none',
        transition: 'all .3s',
      }}>
        <button onClick={() => scroll('topo')} style={{ fontFamily: 'var(--sans)', fontSize: 20, fontWeight: 900, background: 'none', border: 'none', cursor: 'pointer', color: stuck ? 'var(--fg)' : '#0D0D0D', letterSpacing: -1 }}>
          {stuck ? <><GradText>hi</GradText>hat</> : 'hihat'}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, opacity: .5, marginLeft: 4, letterSpacing: 2 }}>AGENCY</span>
        </button>

        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {navLinks.map(([l, id]) => (
            <button key={id} onClick={() => scroll(id)} style={{
              display: 'none', background: 'none', border: 'none', fontFamily: 'var(--sans)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'opacity .2s',
              color: stuck ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.65)',
              // show on md+ via CSS class would be better, simplified here
            }}
              className="nav-link-desktop"
            >
              {l}
            </button>
          ))}
        </div>

        <a href="#contato" onClick={e => { e.preventDefault(); scroll('contato') }} style={{
          display: 'none', alignItems: 'center', gap: 8, textDecoration: 'none',
          background: stuck ? 'var(--grad)' : '#0D0D0D',
          color: stuck ? '#fff' : '#FF6B00',
          padding: '9px 20px', borderRadius: 'var(--r100)', fontFamily: 'var(--sans)',
          fontSize: 12, fontWeight: 700, transition: 'all .25s',
        }} className="nav-cta-desktop">
          Falar com a gente
        </a>

        {/* Mobile CTA (simple) */}
        <a href="#contato" onClick={e => { e.preventDefault(); scroll('contato') }} style={{
          display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
          background: stuck ? 'var(--grad)' : '#0D0D0D',
          color: stuck ? '#fff' : '#FF6B00',
          padding: '8px 16px', borderRadius: 'var(--r100)', fontFamily: 'var(--sans)',
          fontSize: 12, fontWeight: 700,
        }}>
          Falar
        </a>
      </nav>

      {/* ── HERO (fundo gradiente com borda arredondada) ──────────────────── */}
      <header id="topo" style={{ background: 'var(--grad)', color: '#0D0D0D', paddingTop: 96, paddingBottom: 80, paddingLeft: 52, paddingRight: 52, borderRadius: '0 0 48px 48px', position: 'relative', overflow: 'hidden', zIndex: 10 }}>

        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32, marginTop: 48, position: 'relative' }}>

            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', opacity: .65, marginBottom: 8 }}>
                Marketing Digital
              </div>
              <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: 'clamp(64px, 13vw, 180px)', letterSpacing: -6, lineHeight: .88, textTransform: 'uppercase', color: '#0D0D0D', margin: 0 }}>
                hihat<br />agency
              </h1>
            </div>

            <div style={{ maxWidth: 420 }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'rgba(0,0,0,.7)', lineHeight: 1.8, marginBottom: 24 }}>
                Desde 2019 ajudando empreendedores a construir marcas fortes no digital — com identidade visual, social media e tráfego pago que geram resultado de verdade.
              </p>
              <button onClick={() => scroll('contato')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#0D0D0D', color: '#FF6B00', border: 'none',
                padding: '13px 26px', borderRadius: 'var(--r100)', fontFamily: 'var(--sans)',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'opacity .2s',
              }}>
                Falar com a gente →
              </button>
            </div>

            {/* BG letter */}
            <div style={{ position: 'absolute', bottom: -40, left: -20, fontSize: 'clamp(200px, 30vw, 400px)', fontWeight: 900, opacity: .04, color: '#0D0D0D', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>H</div>
          </div>
        </div>

        {/* Notch */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%) translateY(50%)', background: 'var(--bg)', width: 48, height: 24, borderRadius: '12px 12px 0 0' }} />
      </header>

      {/* ── TICKER ────────────────────────────────────────────────────────── */}
      <div style={{ padding: '18px 0', background: 'var(--bg)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', animation: 'ticker 30s linear infinite', width: 'max-content' }}>
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 40, padding: '0 24px', fontFamily: 'var(--mono)', fontSize: 10, color: 'rgba(255,255,255,.18)', textTransform: 'uppercase', letterSpacing: 2, whiteSpace: 'nowrap' }}>
              {c} <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--a2)', opacity: .7, flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVIÇOS ──────────────────────────────────────────────────────── */}
      <section id="servicos" style={secDark}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="sec-label">Serviços</div>
              <h2 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, color: 'var(--fg)', letterSpacing: -3, lineHeight: .92 }}>
                Marketing completo<br />pra sua <GradText>marca crescer</GradText>
              </h2>
            </div>
            <p style={{ fontSize: 14, color: 'var(--fg40)', maxWidth: 320, lineHeight: 1.8 }}>
              Tudo que um negócio precisa no digital — em um único lugar, com quem entende de verdade.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2, background: 'var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            {SERVICES.map((svc, i) => (
              <div key={i} style={{ background: 'var(--bg2)', padding: 36, cursor: 'default', transition: 'background .25s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
              >
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg40)', marginBottom: 20, letterSpacing: 1 }}>0{i + 1}</div>
                <div style={{ width: 52, height: 52, background: 'rgba(255,107,0,.08)', border: '1px solid rgba(255,107,0,.15)', borderRadius: 'var(--r12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a2)', marginBottom: 20 }}>
                  <Icon n={svc.icon} s={22} />
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 800, color: 'var(--fg)', marginBottom: 10 }}>{svc.title}</div>
                <div style={{ fontSize: 13, color: 'var(--fg40)', lineHeight: 1.75 }}>{svc.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, background: 'var(--grad)', color: '#0D0D0D', padding: '4px 12px', borderRadius: 'var(--r100)', fontWeight: 700 }}>Gratuito</span>
            <span style={{ fontSize: 14, color: 'var(--fg40)' }}>Primeira conversa sem compromisso</span>
            <button onClick={() => scroll('contato')} style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', border: 'none', fontFamily: 'var(--sans)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              Falar agora →
            </button>
          </div>
        </div>
      </section>

      {/* ── PROCESSO (gradiente arredondado) ──────────────────────────────── */}
      <section style={{ ...secBrand, margin: '0 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', opacity: .6, marginBottom: 8 }}>Nossa metodologia</div>
            <h2 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: -2.5 }}>Como trabalhamos</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {PROCESS.map((s, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,.08)', border: '1px solid rgba(0,0,0,.1)', borderRadius: 'var(--r12)', padding: 24 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 900, background: '#0D0D0D', color: '#fff', padding: '2px 8px', borderRadius: 6, letterSpacing: 1 }}>{s.n}</span>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 800, marginTop: 14, marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 12, opacity: .7, lineHeight: 1.65 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOBRE ─────────────────────────────────────────────────────────── */}
      <section id="sobre" style={secDark}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="sec-label" style={{ justifyContent: 'center' }}>Sobre a hihat</div>
            <h2 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 900, color: 'var(--fg)', letterSpacing: -2.5, lineHeight: .95 }}>
              Uma agência que<br /><GradText>nasceu da vontade de ajudar</GradText>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 14, color: 'var(--fg40)', lineHeight: 1.85, marginBottom: 14 }}>
                A hihat começou em 2019 de um jeito simples: ajudar amigos empreendedores a se posicionarem no digital. O que era um projeto de estudos foi crescendo, se aprimorando, e se tornando uma agência de marketing completa.
              </p>
              <p style={{ fontSize: 14, color: 'var(--fg40)', lineHeight: 1.85, marginBottom: 14 }}>
                Com o tempo, surgiu a vontade real de trabalhar com quem está começando — os pequenos negócios que precisam de uma marca forte mas não sabem por onde começar. Foi assim que a hihat construiu sua identidade: do logo ao tráfego pago, tudo em um lugar só.
              </p>
              <p style={{ fontSize: 14, color: 'var(--fg40)', lineHeight: 1.85 }}>
                À frente está Ednilson Silva, formado em Marketing e head da agência desde o início.
              </p>

              <div style={{ marginTop: 28, borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  ['01', 'Começamos pela identidade',     'Nenhuma marca cresce sem saber quem é. Por isso identidade visual sempre foi o primeiro passo.'],
                  ['02', 'Evoluímos para o digital completo', 'Social media, tráfego pago e marketing integrado — ampliando conforme os clientes precisavam crescer.'],
                  ['03', 'Foco em quem está construindo', 'Nosso maior propósito é estar ao lado de quem está iniciando e quer fazer certo desde o começo.'],
                ].map(([n, t, d]) => (
                  <div key={n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', flexShrink: 0, marginTop: 2 }}>{n}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginBottom: 3 }}>{t}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg40)', lineHeight: 1.6 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r16)', padding: 40, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'var(--grad)', opacity: .04 }} />
              <div style={{ position: 'relative' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 44, fontWeight: 900, letterSpacing: -3, marginBottom: 6, color: 'var(--fg)' }}>
                  <GradText>hi</GradText>hat
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--fg40)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
                  Agência de Marketing · Piracaia, SP · desde 2019
                </div>
                <p style={{ fontSize: 14, color: 'var(--fg40)', lineHeight: 1.85, marginBottom: 28 }}>
                  Liderada por Ednilson Silva, formado em Marketing, a hihat foi criada para ajudar empreendedores que iniciam — entregando identidade visual, social media, tráfego pago e marketing integrado.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                  {[['2019', 'ano de fundação'], ['4 serviços', 'marketing completo']].map(([v, l]) => (
                    <div key={l}>
                      <div style={{ fontSize: 22, fontWeight: 900, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg40)', marginTop: 3 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ (gradiente arredondado) ───────────────────────────────────── */}
      <section id="faq" style={{ ...secBrand }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', opacity: .6, marginBottom: 8 }}>Dúvidas</div>
            <h2 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: -2.5 }}>Perguntas frequentes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48 }}>
            <div style={{ borderTop: '1px solid rgba(0,0,0,.15)' }}>
              {FAQS.map((f, i) => (
                <div key={i} style={{ borderBottom: '1px solid rgba(0,0,0,.12)' }}>
                  <FaqItemDark q={f.q} a={f.a} />
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(0,0,0,.08)', border: '1px solid rgba(0,0,0,.1)', borderRadius: 'var(--r16)', padding: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: .6 }}>Ainda com dúvidas?</div>
              <h3 style={{ fontFamily: 'var(--sans)', fontSize: 28, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1 }}>Fale com a gente agora</h3>
              <p style={{ fontSize: 13, opacity: .7, lineHeight: 1.7 }}>Nossa equipe responde em até 2h. Diagnóstico inicial sempre gratuito.</p>
              <a
                href="https://wa.me/5511941543335?text=Olá! Quero saber mais sobre os serviços da hihat."
                target="_blank" rel="noopener"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0D0D0D', color: '#FF6B00', padding: '13px 24px', borderRadius: 'var(--r100)', fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: 'var(--sans)' }}
              >
                <Icon n="wa" s={15} /> Falar no WhatsApp
              </a>
              <button onClick={() => scroll('contato')} style={{ background: 'none', border: '1.5px solid rgba(0,0,0,.2)', borderRadius: 'var(--r100)', padding: '12px 24px', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#0D0D0D' }}>
                Preencher formulário →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTATO ───────────────────────────────────────────────────────── */}
      <section id="contato" style={secDark}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 64, alignItems: 'start' }}>
            <div>
              <div className="sec-label">Contato</div>
              <h2 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 900, color: 'var(--fg)', letterSpacing: -2.5, lineHeight: .92, marginBottom: 20 }}>
                Vamos construir<br /><GradText>algo incrível?</GradText>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--fg40)', lineHeight: 1.8, marginBottom: 32, maxWidth: 380 }}>
                Conte sobre seu projeto. Respondemos em até 24h com diagnóstico inicial sem custo.
              </p>
              {[
                { i: 'wa', l: 'WhatsApp',  v: '(11) 9 4154-3335',    href: 'https://wa.me/5511941543335' },
                { i: 'ig', l: 'Instagram', v: '@hihatagencia',        href: 'https://instagram.com/hihatagencia' },
              ].map((c, i) => (
                <a key={i} href={c.href} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, textDecoration: 'none' }}>
                  <div style={{ width: 38, height: 38, background: 'rgba(255,107,0,.08)', border: '1px solid rgba(255,107,0,.2)', borderRadius: 'var(--r8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a2)', flexShrink: 0 }}>
                    <Icon n={c.i} s={16} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--fg40)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{c.l}</div>
                    <div style={{ fontSize: 14, color: 'var(--fg)', fontWeight: 600 }}>{c.v}</div>
                  </div>
                </a>
              ))}
            </div>

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r16)', padding: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 48, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 14 }}>✓</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg)', marginBottom: 8 }}>Mensagem enviada!</div>
                  <div style={{ fontSize: 13, color: 'var(--fg40)' }}>Retornamos em até 24h via WhatsApp.</div>
                </div>
              ) : (
                <>
                  {[
                    { f: 'nome',    l: 'Nome',    p: 'Seu nome' },
                    { f: 'email',   l: 'E-mail',  p: 'seu@email.com' },
                    { f: 'empresa', l: 'Empresa', p: 'Nome da empresa' },
                  ].map(({ f, l, p }) => (
                    <div key={f} className="field">
                      <label>{l}</label>
                      <input className="fi" value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} placeholder={p} />
                    </div>
                  ))}
                  <div className="field">
                    <label>Mensagem</label>
                    <textarea className="fta" value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} placeholder="Conte sobre seu projeto..." />
                  </div>
                  <button className="btn-grad" style={{ justifyContent: 'center' }} onClick={handleContact}>
                    Enviar mensagem <Icon n="ar" s={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ background: 'var(--grad)', color: '#0D0D0D', padding: '64px 52px', borderRadius: '48px 48px 0 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 28, fontWeight: 900, letterSpacing: -1.5, marginBottom: 10 }}>hihat</div>
              <div style={{ fontSize: 13, opacity: .65, lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>
                Agência de marketing digital para marcas que crescem com estratégia e identidade.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { href: 'https://instagram.com/hihatagencia', ic: 'ig' },
                ].map(({ href, ic }) => (
                  <a key={ic} href={href} target="_blank" rel="noopener" style={{ width: 34, height: 34, background: 'rgba(0,0,0,.1)', borderRadius: 'var(--r8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D0D0D', textDecoration: 'none', transition: 'background .2s' }}>
                    <Icon n={ic} s={15} />
                  </a>
                ))}
              </div>
            </div>

            {[
              ['Serviços', ['Social Media', 'Tráfego Pago', 'Identidade Visual', 'Marketing']],
              ['Empresa',  ['Sobre', 'FAQ', 'Contato']],
            ].map(([title, links]) => (
              <div key={title}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: .5, marginBottom: 16 }}>{title}</div>
                {links.map(l => (
                  <button key={l} onClick={() => scroll(l === 'Sobre' ? 'sobre' : l === 'FAQ' ? 'faq' : l === 'Contato' ? 'contato' : 'servicos')}
                    style={{ display: 'block', background: 'none', border: 'none', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,.7)', cursor: 'pointer', marginBottom: 10, padding: 0, textAlign: 'left', transition: 'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#0D0D0D'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,.7)'}
                  >
                    {l}
                  </button>
                ))}
              </div>
            ))}

            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: .5, marginBottom: 16 }}>Contato</div>
              <div style={{ fontSize: 13, fontWeight: 600, opacity: .7, marginBottom: 8 }}>(11) 9 4154-3335</div>
              <div style={{ fontSize: 13, fontWeight: 600, opacity: .7, marginBottom: 20 }}>@hihatagencia</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(0,0,0,.12)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: .5 }}>© 2026 hihat agency. Todos os direitos reservados.</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: .5 }}>Piracaia, SP — Brasil</div>
          </div>
        </div>
      </footer>

      {/* CSS extras (ticker, wa pulse) */}
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes wapulse { 0%,100% { box-shadow: 0 4px 20px rgba(37,211,102,.3); } 50% { box-shadow: 0 4px 36px rgba(37,211,102,.55); } }
        @media(min-width: 768px) {
          .nav-link-desktop { display: block !important; }
          .nav-cta-desktop { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

// FAQ item escuro para a seção colorida
function FaqItemDark({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
        background: 'none', border: 'none', padding: '16px 0', fontFamily: 'var(--sans)',
        fontSize: 13, fontWeight: 700, color: open ? '#0D0D0D' : 'rgba(0,0,0,.7)', cursor: 'pointer', textAlign: 'left',
      }}>
        {q}
        <span style={{ fontSize: 20, color: 'rgba(0,0,0,.4)', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .25s', flexShrink: 0, lineHeight: 1 }}>+</span>
      </button>
      {open && (
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,.65)', lineHeight: 1.8, paddingBottom: 14 }}>{a}</div>
      )}
    </>
  )
}
