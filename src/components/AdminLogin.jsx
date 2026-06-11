import { useState } from 'react'
import { checkPassword, login } from '../lib/storage'
import Icon from './Icons'

export default function AdminLogin({ onSuccess }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  const tryLogin = () => {
    if (checkPassword(pw)) { login(); onSuccess() }
    else setErr('Senha incorreta.')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--r16)', padding: 48, width: '100%', maxWidth: 380 }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 28, fontWeight: 900, letterSpacing: -1.5, marginBottom: 4, color: 'var(--fg)' }}>
          <span style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>hi</span>hat
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg40)', marginBottom: 32, letterSpacing: 1.5, textTransform: 'uppercase' }}>Painel Administrativo</div>

        {err && (
          <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 'var(--r8)', padding: '9px 13px', fontSize: 12, color: '#ef4444', marginBottom: 14 }}>
            {err}
          </div>
        )}

        <div className="field" style={{ marginBottom: 16 }}>
          <label>Senha</label>
          <input
            className="fi" type="password" value={pw} autoFocus
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && tryLogin()}
            placeholder="••••••••"
          />
        </div>

        <button className="btn-grad" style={{ width: '100%', justifyContent: 'center' }} onClick={tryLogin}>
          Entrar <Icon n="ar" s={14} />
        </button>
      </div>
    </div>
  )
}
