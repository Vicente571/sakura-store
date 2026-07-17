import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (login(user, pass)) return
    setError('Usuario o contrasena incorrectos')
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const s = {
    page: {
      minHeight: '100vh',
      background: '#04141b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    jpBg: {
      position: 'fixed',
      inset: 0,
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 130,
      color: 'rgba(52,200,255,0.025)',
      pointerEvents: 'none',
      overflow: 'hidden',
      lineHeight: 1,
      letterSpacing: 6,
      wordBreak: 'break-all',
      padding: 10,
      userSelect: 'none',
    },
    card: {
      position: 'relative',
      zIndex: 1,
      width: '100%',
      maxWidth: 360,
      padding: 36,
      background: '#0a1d24',
      border: '1px solid #1a4b59',
      borderRadius: 4,
      animation: 'fadeIn 0.4s ease',
    },
    cardShake: {
      animation: 'shake 0.4s ease',
    },
    logo: {
      textAlign: 'center',
      marginBottom: 32,
    },
    logoMain: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 28,
      letterSpacing: 5,
      color: '#34c8ff',
      display: 'block',
    },
    logoJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 9,
      color: 'rgba(52,200,255,0.35)',
      letterSpacing: 3,
      display: 'block',
      marginTop: 4,
    },
    adminLabel: {
      fontSize: 10,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: '#47666f',
      textAlign: 'center',
      marginBottom: 24,
      display: 'block',
    },
    group: { marginBottom: 18 },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 9,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: '#8db6bf',
      marginBottom: 7,
    },
    labelJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 9,
      color: 'rgba(88,224,164,0.3)',
    },
    input: {
      width: '100%',
      background: '#071c23',
      border: '1px solid #1a4b59',
      color: '#e6fbff',
      padding: '10px 14px',
      fontSize: 14,
      borderRadius: 2,
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    error: {
      fontSize: 11,
      color: '#66e1c6',
      textAlign: 'center',
      marginBottom: 14,
      padding: '7px 12px',
      background: 'rgba(52,200,255,0.1)',
      borderRadius: 2,
      border: '1px solid rgba(52,200,255,0.15)',
    },
    btn: {
      width: '100%',
      padding: 13,
      background: '#34c8ff',
      border: 'none',
      color: '#04141b',
      fontSize: 11,
      letterSpacing: 3,
      textTransform: 'uppercase',
      fontWeight: 700,
      borderRadius: 2,
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    accentLine: {
      width: 30, height: 2,
      background: 'rgba(88,224,164,0.3)',
      margin: '0 auto 24px',
    },
  }

  return (
    <div style={s.page}>
      <div style={s.jpBg}>管理パネル・ログイン・桜ストア・管理パネル・ログイン・桜ストア・管理パネル・ログイン</div>
      <div style={{ ...s.card, ...(shake ? s.cardShake : {}) }}>
        <div style={s.logo}>
          <span style={s.logoMain}>Sakura Store 🌸</span>
          <span style={s.logoJp}>管理パネル</span>
        </div>
        <div style={s.accentLine} />
        <span style={s.adminLabel}>Acceso de administrador</span>

        {error && <div style={s.error}>{error}</div>}

        <div style={s.group}>
          <label style={s.label}>
            Usuario <span style={s.labelJp}>ユーザー</span>
          </label>
          <input
            style={s.input}
            type="text"
            value={user}
            onChange={e => setUser(e.target.value)}
            placeholder="admin"
            autoComplete="username"
            onFocus={e => e.target.style.borderColor = '#34c8ff'}
            onBlur={e => e.target.style.borderColor = '#1a4b59'}
          />
        </div>

        <div style={{ ...s.group, marginBottom: 22 }}>
          <label style={s.label}>
            Contrasena <span style={s.labelJp}>パスワード</span>
          </label>
          <input
            style={s.input}
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
            onFocus={e => e.target.style.borderColor = '#34c8ff'}
            onBlur={e => e.target.style.borderColor = '#1a4b59'}
          />
        </div>

        <button
          style={s.btn}
          onClick={handleSubmit}
          onMouseEnter={e => e.currentTarget.style.background = '#66e1c6'}
          onMouseLeave={e => e.currentTarget.style.background = '#34c8ff'}
        >
          Entrar al panel
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}
