import React, { useState, useRef } from 'react'
import { useImageUpload, uploadConfigured } from '../hooks/useImageUpload'

export default function ImageUploader({ value, onChange }) {
  const [preview,  setPreview]  = useState(value || null)
  const [dragging, setDragging] = useState(false)
  const { upload, uploading, progress, error } = useImageUpload()
  const inputRef = useRef()

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return

    // Preview local inmediato mientras sube
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(file)

    const url = await upload(file)
    if (url) {
      setPreview(url)
      onChange(url)
    }
  }

  const s = {
    wrap: {
      border: `2px dashed ${dragging ? '#e8609a' : '#2a1a22'}`,
      borderRadius: 4,
      background: dragging ? 'rgba(232,96,154,0.06)' : '#0d0810',
      transition: 'all 0.2s',
      overflow: 'hidden',
      cursor: 'pointer',
      minHeight: 160,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    preview: {
      width: '100%',
      height: 220,
      objectFit: 'cover',
      display: 'block',
    },
    empty: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      padding: '28px 20px',
    },
    icon: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 36,
      color: 'rgba(232,96,154,0.35)',
    },
    hint: {
      fontSize: 11,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: '#666',
      textAlign: 'center',
    },
    hint2: {
      fontSize: 10,
      color: '#3a3a3a',
      textAlign: 'center',
    },
    changeBtn: {
      position: 'absolute',
      bottom: 10, right: 10,
      padding: '5px 14px',
      background: 'rgba(10,10,10,0.85)',
      border: '1px solid rgba(232,96,154,0.4)',
      color: '#e8609a',
      fontSize: 10,
      letterSpacing: 2,
      textTransform: 'uppercase',
      borderRadius: 2,
      cursor: 'pointer',
    },
    progressWrap: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: 3,
      background: '#1a0a14',
    },
    progressBar: {
      height: '100%',
      background: '#e8609a',
      transition: 'width 0.3s ease',
    },
    uploadingOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(10,10,10,0.6)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    uploadingText: {
      fontSize: 11,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: '#e8609a',
    },
    notConfigured: {
      margin: '8px 0 0',
      padding: '10px 14px',
      background: 'rgba(232,96,154,0.06)',
      border: '1px solid rgba(232,96,154,0.18)',
      borderRadius: 3,
      fontSize: 11,
      color: '#c0a0b0',
      lineHeight: 1.7,
    },
    notConfiguredTitle: {
      fontSize: 10,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: '#e8609a',
      fontWeight: 700,
      display: 'block',
      marginBottom: 5,
    },
    code: {
      background: '#1a0a14',
      padding: '1px 6px',
      borderRadius: 2,
      fontFamily: 'monospace',
      fontSize: 11,
      color: '#f07ab0',
    },
    errorBox: {
      marginTop: 8,
      padding: '8px 12px',
      background: 'rgba(232,96,154,0.08)',
      border: '1px solid rgba(232,96,154,0.2)',
      borderRadius: 3,
      fontSize: 11,
      color: '#f07ab0',
    },
  }

  return (
    <div>
      <div
        style={s.wrap}
        onClick={() => !uploading && inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" style={s.preview} />
            {!uploading && (
              <button
                style={s.changeBtn}
                onClick={e => { e.stopPropagation(); inputRef.current.click() }}
              >
                Cambiar foto
              </button>
            )}
          </>
        ) : (
          <div style={s.empty}>
            <span style={s.icon}>🌸</span>
            <span style={s.hint}>Arrastra tu foto aqui</span>
            <span style={s.hint2}>o haz clic para seleccionarla</span>
            <span style={s.hint2}>JPG · PNG · WEBP</span>
          </div>
        )}

        {uploading && (
          <div style={s.uploadingOverlay}>
            <span style={s.uploadingText}>Subiendo... {progress}%</span>
            <div style={{ width: 120, height: 3, background: '#1a0a14', borderRadius: 2 }}>
              <div style={{ ...s.progressBar, width: `${progress}%`, borderRadius: 2 }} />
            </div>
          </div>
        )}
      </div>

      {!uploadConfigured && (
        <div style={s.notConfigured}>
          <span style={s.notConfiguredTitle}>Configura el almacenamiento de fotos</span>
          Opcion recomendada — <strong>ImgBB</strong> (gratis, sin limite):<br />
          1. Ve a <a href="https://imgbb.com" target="_blank" rel="noreferrer" style={{ color: '#e8609a' }}>imgbb.com</a> y crea una cuenta<br />
          2. Ve a <a href="https://api.imgbb.com" target="_blank" rel="noreferrer" style={{ color: '#e8609a' }}>api.imgbb.com</a> y copia tu API key<br />
          3. Pegala en <code style={s.code}>src/hooks/useImageUpload.js</code> en <code style={s.code}>IMGBB_KEY</code><br />
          <br />
          Por ahora la foto se guarda solo en este navegador (se borra si limpias cache).
        </div>
      )}

      {error && <div style={s.errorBox}>Error al subir: {error}</div>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  )
}
