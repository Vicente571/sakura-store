import React, { useState, useRef } from 'react'
import { useImageUpload, uploadConfigured } from '../hooks/useImageUpload'

// Image editor modal for adjusting and centering images
function ImageEditor({ imageData, onSave, onCancel }) {
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(1)
  const canvasRef = useRef()

  function handleSave() {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.scale(scale, scale)
      ctx.drawImage(
        img,
        -img.width / 2 + offsetX,
        -img.height / 2 + offsetY
      )
      ctx.restore()
      
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob)
        onSave(url)
      })
    }
    img.src = imageData
  }

  React.useEffect(() => {
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      const maxSize = 400
      const scale = Math.min(maxSize / img.width, maxSize / img.height)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    img.src = imageData
  }, [imageData])

  const s = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)',
    },
    modal: {
      background: '#0d0810',
      border: '1px solid #2a1a22',
      borderRadius: 8,
      padding: 24,
      maxWidth: 500,
      width: '90%',
    },
    title: {
      fontSize: 14,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: '#e8609a',
      marginBottom: 16,
      fontWeight: 700,
    },
    preview: {
      marginBottom: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#050208',
      borderRadius: 4,
      overflow: 'hidden',
      minHeight: 320,
    },
    canvas: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    controls: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginBottom: 16,
    },
    control: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    },
    label: {
      fontSize: 11,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: '#888',
    },
    slider: {
      width: '100%',
      cursor: 'pointer',
    },
    buttons: {
      display: 'flex',
      gap: 10,
    },
    btn: {
      flex: 1,
      padding: '10px 16px',
      border: '1px solid #2a1a22',
      borderRadius: 4,
      fontSize: 11,
      letterSpacing: 2,
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    cancelBtn: {
      background: 'transparent',
      color: '#888',
    },
    saveBtn: {
      background: '#e8609a',
      color: '#0a0a0a',
      fontWeight: 700,
      border: 'none',
    },
  }

  return (
    <div style={s.overlay} onClick={onCancel}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.title}>Ajustar foto 🎨</div>
        <div style={s.preview}>
          <canvas ref={canvasRef} style={s.canvas} />
        </div>
        <div style={s.controls}>
          <div style={s.control}>
            <label style={s.label}>Mover horizontalmente</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={offsetX}
              onChange={e => setOffsetX(parseInt(e.target.value))}
              style={s.slider}
            />
          </div>
          <div style={s.control}>
            <label style={s.label}>Mover verticalmente</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={offsetY}
              onChange={e => setOffsetY(parseInt(e.target.value))}
              style={s.slider}
            />
          </div>
          <div style={s.control}>
            <label style={s.label}>Zoom</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={e => setScale(parseFloat(e.target.value))}
              style={s.slider}
            />
          </div>
        </div>
        <div style={s.buttons}>
          <button
            style={{ ...s.btn, ...s.cancelBtn }}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            style={{ ...s.btn, ...s.saveBtn }}
            onClick={handleSave}
          >
            Guardar ajustes
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ImageUploader({ value, onChange }) {
  const [preview, setPreview] = useState(value || null)
  const [dragging, setDragging] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editorImage, setEditorImage] = useState(null)
  const { upload, uploading, progress, error } = useImageUpload()
  const inputRef = useRef()

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return

    // Preview local inmediato mientras sube
    const reader = new FileReader()
    reader.onload = e => {
      setEditorImage(e.target.result)
      setShowEditor(true)
    }
    reader.readAsDataURL(file)
  }

  async function handleEditorSave(editedImageUrl) {
    setShowEditor(false)
    setPreview(editedImageUrl)
    
    // Convert data URL to blob and upload
    const response = await fetch(editedImageUrl)
    const blob = await response.blob()
    
    const url = await upload(blob)
    if (url) {
      setPreview(url)
      onChange(url)
    } else {
      setPreview(editedImageUrl)
      onChange(editedImageUrl)
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
      cursor: 'pointer',
      transition: 'opacity 0.2s',
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
      bottom: 10,
      right: 10,
      padding: '5px 14px',
      background: 'rgba(10,10,10,0.85)',
      border: '1px solid rgba(232,96,154,0.4)',
      color: '#e8609a',
      fontSize: 10,
      letterSpacing: 2,
      textTransform: 'uppercase',
      borderRadius: 2,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    progressWrap: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
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
            <img
              src={preview}
              alt="preview"
              style={s.preview}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            />
            {!uploading && (
              <button
                style={s.changeBtn}
                onClick={e => { e.stopPropagation(); inputRef.current.click() }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(10,10,10,0.95)'
                  e.target.style.borderColor = 'rgba(232,96,154,0.6)'
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'rgba(10,10,10,0.85)'
                  e.target.style.borderColor = 'rgba(232,96,154,0.4)'
                }}
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

      {showEditor && (
        <ImageEditor
          imageData={editorImage}
          onSave={handleEditorSave}
          onCancel={() => setShowEditor(false)}
        />
      )}

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
