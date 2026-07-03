import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageUploader from "../components/ImageUploader";
import {
  fetchGalaxy,
  saveGalaxy,
  loadMemories,
  loadIntro,
} from "../data/galaxyMemories";

export default function GalaxyEditorPage() {
  const [memories, setMemories] = useState(() => loadMemories());
  const [intro, setIntro] = useState(() => loadIntro());
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState("");
  const [phrase, setPhrase] = useState("");
  const [toast, setToast] = useState(null);
  const [showBackup, setShowBackup] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchGalaxy().then(({ intro: i, memories: m }) => {
      if (!alive) return;
      setIntro(i);
      setMemories(m);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  async function persist(nextMemories, nextIntro = intro) {
    setMemories(nextMemories);
    const synced = await saveGalaxy({
      intro: nextIntro,
      memories: nextMemories,
    });
    return synced;
  }

  function clearForm() {
    setEditingId(null);
    setImage("");
    setPhrase("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) {
      showToast("Agrega una foto");
      return;
    }
    if (!phrase.trim()) {
      showToast("Escribe una frase");
      return;
    }

    let next;
    if (editingId) {
      next = memories.map((m) =>
        m.id === editingId ? { ...m, image, phrase: phrase.trim() } : m,
      );
    } else {
      next = [
        ...memories,
        { id: Date.now().toString(), image, phrase: phrase.trim() },
      ];
    }
    const synced = await persist(next);
    showToast(
      synced
        ? editingId
          ? "Recuerdo actualizado en todos lados"
          : "Recuerdo agregado en todos lados"
        : "Guardado en este dispositivo (sin conexion)",
    );
    clearForm();
  }

  function handleEdit(m) {
    setEditingId(m.id);
    setImage(m.image);
    setPhrase(m.phrase);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Borrar este recuerdo?")) return;
    const synced = await persist(memories.filter((m) => m.id !== id));
    if (editingId === id) clearForm();
    showToast(synced ? "Recuerdo eliminado" : "Eliminado solo en este dispositivo");
  }

  function handleIntroChange(text) {
    setIntro(text);
  }

  async function handleIntroBlur() {
    const synced = await saveGalaxy({ intro, memories });
    showToast(synced ? "Mensaje guardado" : "Guardado solo en este dispositivo");
  }

  function copyBackup() {
    const backup = JSON.stringify({ intro, memories }, null, 2);
    navigator.clipboard?.writeText(backup);
    showToast("Respaldo copiado");
  }

  const s = {
    page: { minHeight: "100vh", background: "#0a0a0a", position: "relative" },
    header: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(10,10,10,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #2a0a14",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 64,
    },
    headerLeft: { display: "flex", flexDirection: "column", lineHeight: 1 },
    headerTitle: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 22,
      letterSpacing: 4,
      color: "#e8609a",
    },
    headerSub: { fontSize: 10, color: "#666", marginTop: 4 },
    headerRight: { display: "flex", gap: 10, alignItems: "center" },
    viewBtn: {
      padding: "5px 14px",
      background: "transparent",
      border: "1px solid #2a1a22",
      color: "#888",
      fontSize: 10,
      letterSpacing: 2,
      textTransform: "uppercase",
      borderRadius: 2,
      textDecoration: "none",
      display: "inline-block",
    },
    adminBtn: {
      padding: "5px 14px",
      background: "transparent",
      border: "1px solid #2a1a22",
      color: "#888",
      fontSize: 10,
      letterSpacing: 2,
      textTransform: "uppercase",
      borderRadius: 2,
      textDecoration: "none",
      display: "inline-block",
    },
    main: { maxWidth: 640, margin: "0 auto", padding: "32px 24px 64px" },
    sectionTitle: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 20,
      letterSpacing: 4,
      color: "#f0e0e8",
      marginBottom: 14,
    },
    label: {
      fontSize: 9,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "#888",
      marginBottom: 7,
      display: "block",
    },
    input: {
      width: "100%",
      background: "#111014",
      border: "1px solid #2a1a22",
      color: "#f0e0e8",
      padding: "10px 14px",
      fontSize: 13,
      borderRadius: 2,
      outline: "none",
      marginBottom: 26,
    },
    textarea: {
      width: "100%",
      background: "#111014",
      border: "1px solid #2a1a22",
      color: "#f0e0e8",
      padding: "10px 14px",
      fontSize: 13,
      borderRadius: 2,
      outline: "none",
      resize: "vertical",
      minHeight: 70,
      lineHeight: 1.6,
      marginTop: 14,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginBottom: 36,
      padding: 18,
      background: "#111014",
      border: "1px solid #1e0e18",
      borderRadius: 4,
    },
    editingBanner: {
      padding: "8px 14px",
      background: "rgba(232,96,154,0.08)",
      border: "1px solid rgba(232,96,154,0.25)",
      borderRadius: 3,
      marginBottom: 14,
      fontSize: 12,
      color: "#e8609a",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    btnRow: { display: "flex", gap: 10, marginTop: 8 },
    submitBtn: {
      flex: 1,
      padding: "12px 24px",
      background: "#e8609a",
      border: "none",
      color: "#0a0a0a",
      fontSize: 11,
      letterSpacing: 3,
      textTransform: "uppercase",
      fontWeight: 700,
      borderRadius: 2,
    },
    cancelBtn: {
      padding: "12px 18px",
      background: "transparent",
      border: "1px solid #2a1a22",
      color: "#888",
      fontSize: 11,
      letterSpacing: 2,
      textTransform: "uppercase",
      borderRadius: 2,
    },
    divider: { height: 1, background: "#1e0e18", margin: "8px 0 24px" },
    item: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 14px",
      background: "#111014",
      border: "1px solid #1e0e18",
      borderRadius: 2,
      marginBottom: 8,
    },
    itemImg: {
      width: 48,
      height: 48,
      objectFit: "cover",
      borderRadius: 2,
      flexShrink: 0,
    },
    itemInfo: { flex: 1, minWidth: 0, fontSize: 12, color: "#c0a0b0" },
    actionBtns: { display: "flex", gap: 6, flexShrink: 0 },
    editBtn: {
      padding: "4px 10px",
      background: "rgba(232,96,154,0.1)",
      border: "1px solid rgba(232,96,154,0.25)",
      color: "#e8609a",
      fontSize: 10,
      letterSpacing: 1,
      textTransform: "uppercase",
      borderRadius: 2,
    },
    deleteBtn: {
      padding: "4px 10px",
      background: "transparent",
      border: "1px solid #2a1020",
      color: "#555",
      fontSize: 10,
      letterSpacing: 1,
      textTransform: "uppercase",
      borderRadius: 2,
    },
    backupBtn: {
      padding: "8px 16px",
      background: "transparent",
      border: "1px solid #2a1a22",
      color: "#888",
      fontSize: 10,
      letterSpacing: 2,
      textTransform: "uppercase",
      borderRadius: 2,
      marginTop: 10,
    },
    backupBox: {
      marginTop: 10,
      padding: 12,
      background: "#0d0810",
      border: "1px solid #2a1a22",
      borderRadius: 3,
      fontSize: 10,
      color: "#c0a0b0",
      whiteSpace: "pre-wrap",
      wordBreak: "break-all",
      maxHeight: 200,
      overflow: "auto",
    },
    toast: {
      position: "fixed",
      bottom: 28,
      right: 28,
      zIndex: 9999,
      padding: "12px 20px",
      borderRadius: 3,
      background: "#e8609a",
      border: "1px solid #f07ab0",
      color: "#0a0a0a",
      fontSize: 12,
      letterSpacing: 2,
      textTransform: "uppercase",
      fontWeight: 700,
    },
  };

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.headerTitle}>Editor de Galaxia 🩷</span>
          <span style={s.headerSub}>
            {loading
              ? "Cargando contenido guardado..."
              : "Solo tu puedes ver esta pantalla · se ve igual en todos tus dispositivos"}
          </span>
        </div>
        <div style={s.headerRight}>
          <Link to="/admin" style={s.adminBtn}>
            Panel tienda
          </Link>
          <Link to="/mi-universo" style={s.viewBtn} target="_blank">
            Ver galaxia
          </Link>
        </div>
      </header>

      <main style={s.main}>
        <div style={s.sectionTitle}>Mensaje de bienvenida</div>
        <input
          style={s.input}
          value={intro}
          onChange={(e) => handleIntroChange(e.target.value)}
          onBlur={handleIntroBlur}
          placeholder="Para mi niña, mi universo entero 🩷"
        />

        <div style={s.sectionTitle}>
          {editingId ? "Editar recuerdo" : "Agregar recuerdo"}
        </div>

        {editingId && (
          <div style={s.editingBanner}>
            <span>Editando recuerdo</span>
            <button style={s.cancelBtn} onClick={clearForm}>
              Cancelar
            </button>
          </div>
        )}

        <form style={s.form} onSubmit={handleSubmit}>
          <label style={s.label}>Foto</label>
          <ImageUploader value={image} onChange={setImage} />
          <label style={s.label}>Frase bonita</label>
          <textarea
            style={s.textarea}
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Mi niña, eres lo mejor que me ha pasado 🩷"
          />
          <div style={s.btnRow}>
            <button type="submit" style={s.submitBtn}>
              {editingId ? "Guardar cambios" : "Agregar a la galaxia"}
            </button>
            {editingId && (
              <button type="button" style={s.cancelBtn} onClick={clearForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div style={s.divider} />
        <div style={s.sectionTitle}>Recuerdos ({memories.length})</div>
        {memories.length === 0 && (
          <div style={{ fontSize: 12, color: "#444", padding: "16px 0" }}>
            Sin recuerdos aun
          </div>
        )}
        {memories.map((m) => (
          <div key={m.id} style={s.item}>
            <img src={m.image} alt="" style={s.itemImg} />
            <div style={s.itemInfo}>{m.phrase}</div>
            <div style={s.actionBtns}>
              <button style={s.editBtn} onClick={() => handleEdit(m)}>
                Editar
              </button>
              <button style={s.deleteBtn} onClick={() => handleDelete(m.id)}>
                Borrar
              </button>
            </div>
          </div>
        ))}

        <button style={s.backupBtn} onClick={() => setShowBackup((v) => !v)}>
          {showBackup ? "Ocultar respaldo" : "Ver / copiar respaldo"}
        </button>
        {showBackup && (
          <div style={s.backupBox}>
            <button
              style={{ ...s.backupBtn, marginTop: 0, marginBottom: 10 }}
              onClick={copyBackup}
            >
              Copiar respaldo
            </button>
            {JSON.stringify({ intro, memories }, null, 2)}
          </div>
        )}
      </main>

      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}
