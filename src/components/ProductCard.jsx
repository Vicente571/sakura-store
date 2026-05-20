import React, { useState } from 'react'
import { useStore } from '../context/StoreContext'

const WA_NUMBER  = '524624360831'
const IG_USER    = 'storee.sakura'
const JP_CHARS   = ['桜','愛','美','輝','宝','星','月','花','光','夢']

function buildWALink(product) {
  const msg = encodeURIComponent(
    `Hola! Vi el producto *${product.name}* en Sakura Store y me interesa hacer un encargo. ¿Tienes disponibilidad? 🌸`
  )
  // api.whatsapp.com/send es mas compatible con todos los navegadores
  return `https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${msg}`
}

function buildIGLink(product) {
  // Direct DM link to Instagram
  return `https://ig.me/m/${IG_USER}`
}

export default function ProductCard({ product, index }) {
  const { categories } = useStore()
  const [imgError, setImgError] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const cat = categories.find(c => c.id === product.categoryId)
  const jpChar = JP_CHARS[index % JP_CHARS.length]

  const s = {
    card: {
      background: '#111014',
      border: '1px solid #1e0e18',
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
      transition: 'border-color 0.25s, transform 0.25s',
      animation: `fadeIn 0.4s ease ${index * 0.06}s both`,
    },
    imgWrap: {
      width: '100%',
      height: 200,
      position: 'relative',
      overflow: 'hidden',
    },
    img: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transition: 'transform 0.4s ease',
    },
    placeholder: {
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1a0a14 0%, #2a0a1e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    phJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 36,
      color: 'rgba(232,96,154,0.25)',
    },
    phLabel: {
      fontSize: 10,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: 'rgba(232,96,154,0.15)',
    },
    corner: {
      position: 'absolute',
      top: 10, right: 10,
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 18,
      color: 'rgba(232,96,154,0.45)',
      pointerEvents: 'none',
    },
    body: { padding: '14px 16px 16px' },
    catRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 5,
    },
    catTag: {
      fontSize: 9,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: '#e8609a',
      border: '1px solid rgba(232,96,154,0.25)',
      padding: '2px 7px',
      borderRadius: 2,
    },
    catJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 9,
      color: 'rgba(232,96,154,0.3)',
    },
    price: {
      fontSize: 11,
      fontWeight: 700,
      color: '#e8609a',
      marginLeft: 'auto',
    },
    name: {
      fontSize: 15,
      fontWeight: 600,
      color: '#f0e0e8',
      marginBottom: 6,
      lineHeight: 1.35,
    },
    desc: {
      fontSize: 11,
      color: '#666',
      lineHeight: 1.6,
      marginBottom: 14,
    },
    btnGroup: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 6,
    },
    btnWA: {
      padding: '9px 6px',
      background: '#e8609a',
      border: 'none',
      color: '#0a0a0a',
      fontSize: 9,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      fontWeight: 700,
      borderRadius: 2,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      transition: 'background 0.2s',
    },
    btnIG: {
      padding: '9px 6px',
      background: 'transparent',
      border: '1px solid rgba(232,96,154,0.35)',
      color: '#e8609a',
      fontSize: 9,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      fontWeight: 700,
      borderRadius: 2,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      transition: 'all 0.2s',
    },
  }

  return (
    <div
      style={s.card}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#e8609a'
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1e0e18'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={s.imgWrap}>
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            style={s.img}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={s.placeholder}>
            <span style={s.phJp}>{jpChar}</span>
            <span style={s.phLabel}>{cat?.name || 'producto'}</span>
          </div>
        )}
        <div style={s.corner}>{jpChar}</div>
      </div>

      <div style={s.body}>
        <div style={s.catRow}>
          {cat && <span style={s.catTag}>{cat.name}</span>}
          {cat && <span style={s.catJp}>{cat.jp}</span>}
          {product.price && <span style={s.price}>${product.price}</span>}
        </div>
        <div style={s.name}>{product.name}</div>
        <div style={s.desc}>{product.desc}</div>
        <div style={s.btnGroup}>
          <button
            style={s.btnWA}
            onClick={() => window.open(buildWALink(product), '_blank', 'noopener,noreferrer')}
            onMouseEnter={e => e.currentTarget.style.background = '#f07ab0'}
            onMouseLeave={e => e.currentTarget.style.background = '#e8609a'}
          >
            WhatsApp
          </button>
          <button
            style={s.btnIG}
            onClick={() => window.open(buildIGLink(), '_blank', 'noopener,noreferrer')}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(232,96,154,0.1)'
              e.currentTarget.style.borderColor = '#e8609a'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(232,96,154,0.35)'
            }}
          >
            Instagram
          </button>
        </div>
      </div>
    </div>
  )
}
