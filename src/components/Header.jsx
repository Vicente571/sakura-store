import React from 'react'
import { Link } from 'react-router-dom'

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(10,10,10,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #0f4250',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  logoWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
    textDecoration: 'none',
  },
  logoMain: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 26,
    letterSpacing: 4,
    color: '#34c8ff',
  },
  logoJp: {
    fontFamily: "'Noto Serif JP', serif",
    fontSize: 9,
    color: 'rgba(52,200,255,0.45)',
    letterSpacing: 2,
    marginTop: 2,
  },
  deliveryBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '5px 12px',
    border: '1px solid #145767',
    borderRadius: 2,
    background: 'rgba(52,200,255,0.08)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#34c8ff',
    animation: 'pulse 2s infinite',
  },
  badgeText: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'rgba(52,200,255,0.7)',
    fontWeight: 600,
  },
}

export default function Header() {
  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoWrap}>
        <span style={styles.logoMain}>Sakura Store 🌸</span>
        <span style={styles.logoJp}>サクラストア　・　宝石＆アクセサリー</span>
      </Link>

      <div style={styles.deliveryBadge}>
        <div style={styles.dot} />
        <span style={styles.badgeText}>Irapuato &amp; Leon</span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </header>
  )
}
