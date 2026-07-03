import React, { useEffect, useRef, useState } from "react";
import ImageUploader from "../components/ImageUploader";

// ══════════════════════════════════════════════════════════
//  PANTALLA SECRETA DE CUMPLEANOS 🌌
//
//  - Nadie mas conoce esta ruta: no esta enlazada en ningun
//    menu ni boton del sitio. Solo se puede entrar escribiendo
//    la direccion directamente en el navegador.
//  - Ademas pide una contrasena antes de mostrar nada.
//    Cambia la contrasena aqui abajo por la que tu quieras:
const SECRET_PASSWORD = "cumple2024";
//
//  - El titulo y el nombre tambien se pueden cambiar aqui:
const PERSON_NAME = "Mi Amor";
const BIRTHDAY_TITLE = "Feliz Cumpleanos";
//
//  - Las fotos y frases se agregan y editan directamente desde
//    esta misma pantalla (boton "Editar recuerdos"), una vez
//    dentro. Se guardan en este navegador para que no se
//    pierdan al recargar la pagina.
// ══════════════════════════════════════════════════════════

const AUTH_KEY = "sk_bday_auth";
const MEMORIES_KEY = "sk_bday_memories";

const DEFAULT_MEMORIES = [
  {
    id: "seed-1",
    image: "",
    phrase: "Cada momento contigo es una estrella mas en nuestra galaxia ✨",
  },
  {
    id: "seed-2",
    image: "",
    phrase: "Feliz cumpleanos a la persona que ilumina todo mi universo 🌸",
  },
  {
    id: "seed-3",
    image: "",
    phrase: "Que este nuevo viaje alrededor del sol este lleno de magia",
  },
];

function loadMemories() {
  try {
    const raw = localStorage.getItem(MEMORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) {
    console.error("No se pudieron leer los recuerdos guardados", e);
  }
  return DEFAULT_MEMORIES;
}

function saveMemories(memories) {
  try {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
  } catch (e) {
    console.error("No se pudieron guardar los recuerdos", e);
  }
}

export default function BirthdayPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === "1",
  );

  function handleLock() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }

  function handleUnlock() {
    sessionStorage.setItem(AUTH_KEY, "1");
    setAuthed(true);
  }

  return authed ? (
    <Galaxy onLock={handleLock} />
  ) : (
    <PasswordGate onSuccess={handleUnlock} />
  );
}

// ── Pantalla de contrasena ─────────────────────────────────
function PasswordGate({ onSuccess }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (value === SECRET_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 900);
    }
  }

  return (
    <div style={gateStyles.page}>
      <StarsCanvas dim />
      <form style={gateStyles.card} onSubmit={handleSubmit}>
        <span style={gateStyles.icon}>🌙</span>
        <div style={gateStyles.title}>Acceso privado</div>
        <div style={gateStyles.sub}>Esta pantalla es solo para ti</div>
        <input
          autoFocus
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Contrasena"
          style={{
            ...gateStyles.input,
            borderColor: error ? "#ff4d6d" : "#2a1a22",
          }}
        />
        <button type="submit" style={gateStyles.btn}>
          Entrar
        </button>
        {error && <div style={gateStyles.error}>Contrasena incorrecta</div>}
      </form>
    </div>
  );
}

const gateStyles = {
  page: {
    minHeight: "100vh",
    background: "#020105",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    padding: "40px 36px",
    background: "rgba(10,8,16,0.75)",
    border: "1px solid rgba(232,96,154,0.25)",
    borderRadius: 12,
    backdropFilter: "blur(10px)",
    width: 280,
  },
  icon: { fontSize: 30, marginBottom: 4 },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 24,
    letterSpacing: 3,
    color: "#f0e0e8",
  },
  sub: { fontSize: 12, color: "#8a7a88", marginBottom: 12 },
  input: {
    width: "100%",
    padding: "10px 14px",
    background: "#0d0810",
    border: "1px solid #2a1a22",
    borderRadius: 6,
    color: "#f0e0e8",
    fontSize: 14,
    textAlign: "center",
    outline: "none",
  },
  btn: {
    width: "100%",
    marginTop: 6,
    padding: "10px 14px",
    background: "linear-gradient(135deg,#e8609a,#8a4fd6)",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: 700,
    cursor: "pointer",
  },
  error: { fontSize: 11, color: "#ff4d6d" },
};

// ── Fondo de galaxia animado (canvas 2D con perspectiva 3D) ─
function StarsCanvas({ dim }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let width, height, cx, cy;
    let particles = [];
    let angle = 0;
    let mouseX = 0;
    let mouseY = 0;

    const COUNT = 420;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cx = width / 2;
      cy = height / 2;
    }

    function makeParticle() {
      const armAngle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.5) * 560;
      const armOffset = (Math.random() - 0.5) * 0.6;
      const hueRoll = Math.random();
      const color =
        hueRoll < 0.5
          ? `rgba(232,96,154,${0.4 + Math.random() * 0.6})`
          : hueRoll < 0.8
            ? `rgba(150,120,255,${0.4 + Math.random() * 0.6})`
            : `rgba(255,255,255,${0.4 + Math.random() * 0.6})`;
      return {
        baseAngle: armAngle + armOffset,
        radius,
        z: Math.random() * 800 + 50,
        size: Math.random() * 1.8 + 0.4,
        color,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      };
    }

    function init() {
      particles = Array.from({ length: COUNT }, makeParticle);
    }

    function draw() {
      ctx.fillStyle = "rgba(2,1,5,0.35)";
      ctx.fillRect(0, 0, width, height);

      angle += 0.0009;

      for (const p of particles) {
        const a = p.baseAngle + angle * (300 / p.z);
        const x3 = Math.cos(a) * p.radius;
        const y3 = Math.sin(a) * p.radius * 0.55;

        const scale = 350 / (350 + p.z);
        const px = cx + (x3 + mouseX * 20) * scale;
        const py = cy + (y3 + mouseY * 20) * scale;

        const twinkle =
          0.55 + 0.45 * Math.sin(Date.now() * p.twinkleSpeed + p.twinkleOffset);
        const r = Math.max(0.3, p.size * scale * 1.6);

        ctx.beginPath();
        ctx.globalAlpha = dim ? twinkle * 0.5 : twinkle;
        ctx.fillStyle = p.color;
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    }

    function handleMove(e) {
      mouseX = (e.clientX / width - 0.5) * 2;
      mouseY = (e.clientY / height - 0.5) * 2;
    }

    resize();
    init();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [dim]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

// ── Pantalla principal ─────────────────────────────────────
function Galaxy({ onLock }) {
  const [memories, setMemories] = useState(loadMemories);
  const [index, setIndex] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    saveMemories(memories);
  }, [memories]);

  useEffect(() => {
    if (editing || memories.length < 2) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % memories.length);
    }, 6000);
    return () => clearInterval(t);
  }, [editing, memories.length]);

  useEffect(() => {
    if (index >= memories.length) setIndex(0);
  }, [memories.length, index]);

  function next() {
    setIndex((i) => (i + 1) % memories.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + memories.length) % memories.length);
  }

  function addMemory() {
    setMemories((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, image: "", phrase: "" },
    ]);
  }
  function updateMemory(id, patch) {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );
  }
  function removeMemory(id) {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  }

  const current = memories[index];

  return (
    <div style={styles.page}>
      <StarsCanvas />

      <div style={styles.content}>
        <button style={styles.lockBtn} onClick={onLock} title="Bloquear pantalla">
          🔒
        </button>

        <div style={styles.header}>
          <span style={styles.headerIcon}>🌌</span>
          <div style={styles.title}>{BIRTHDAY_TITLE}</div>
          <div style={styles.name}>{PERSON_NAME}</div>
          <div style={styles.accentLine} />
        </div>

        {!editing && memories.length > 0 && current && (
          <div style={styles.carousel}>
            <button style={styles.arrow} onClick={prev} aria-label="Anterior">
              ‹
            </button>

            <div style={styles.card} key={current.id}>
              {current.image ? (
                <img src={current.image} alt="" style={styles.cardImg} />
              ) : (
                <div style={styles.cardImgEmpty}>🌸</div>
              )}
              <div style={styles.cardPhrase}>
                {current.phrase || "Agrega una frase para este recuerdo"}
              </div>
            </div>

            <button style={styles.arrow} onClick={next} aria-label="Siguiente">
              ›
            </button>
          </div>
        )}

        {!editing && memories.length > 0 && (
          <div style={styles.dots}>
            {memories.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setIndex(i)}
                style={{
                  ...styles.dot,
                  background: i === index ? "#e8609a" : "rgba(232,96,154,0.2)",
                }}
                aria-label={`Recuerdo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {!editing && memories.length === 0 && (
          <div style={styles.empty}>Aun no hay recuerdos, agrega el primero ✨</div>
        )}

        <div style={styles.editToggleWrap}>
          <button style={styles.editToggle} onClick={() => setEditing((v) => !v)}>
            {editing ? "Listo, ver galaxia" : "✎ Editar recuerdos"}
          </button>
        </div>

        {editing && (
          <div style={styles.editPanel}>
            {memories.map((m) => (
              <div key={m.id} style={styles.editItem}>
                <ImageUploader
                  value={m.image}
                  onChange={(url) => updateMemory(m.id, { image: url })}
                />
                <textarea
                  style={styles.textarea}
                  placeholder="Escribe una frase bonita..."
                  value={m.phrase}
                  onChange={(e) => updateMemory(m.id, { phrase: e.target.value })}
                />
                <button
                  style={styles.deleteBtn}
                  onClick={() => removeMemory(m.id)}
                >
                  Eliminar recuerdo
                </button>
              </div>
            ))}
            <button style={styles.addBtn} onClick={addMemory}>
              + Agregar recuerdo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020105",
    position: "relative",
    overflow: "hidden",
  },
  content: {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 20px 80px",
  },
  lockBtn: {
    position: "fixed",
    top: 18,
    right: 18,
    background: "rgba(10,8,16,0.6)",
    border: "1px solid rgba(232,96,154,0.25)",
    borderRadius: "50%",
    width: 38,
    height: 38,
    color: "#e8609a",
    fontSize: 15,
    cursor: "pointer",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 46,
    textAlign: "center",
  },
  headerIcon: { fontSize: 34, marginBottom: 10 },
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 46,
    letterSpacing: 5,
    background: "linear-gradient(135deg,#f0e0e8,#e8609a 60%,#8a4fd6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  name: {
    fontSize: 15,
    letterSpacing: 3,
    color: "#c0a0b0",
    marginTop: 6,
    textTransform: "uppercase",
  },
  accentLine: {
    width: 60,
    height: 2,
    background: "linear-gradient(90deg,#e8609a,#8a4fd6)",
    margin: "16px auto 0",
    borderRadius: 2,
  },
  carousel: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    width: "100%",
    maxWidth: 560,
    justifyContent: "center",
  },
  arrow: {
    background: "rgba(232,96,154,0.08)",
    border: "1px solid rgba(232,96,154,0.25)",
    color: "#e8609a",
    width: 40,
    height: 40,
    borderRadius: "50%",
    fontSize: 20,
    cursor: "pointer",
    flexShrink: 0,
  },
  card: {
    flex: 1,
    background: "rgba(15,10,20,0.65)",
    border: "1px solid rgba(232,96,154,0.25)",
    borderRadius: 14,
    padding: 18,
    backdropFilter: "blur(10px)",
    boxShadow: "0 0 40px rgba(232,96,154,0.12)",
    animation: "bdayFadeIn 0.6s ease both",
    minHeight: 320,
    display: "flex",
    flexDirection: "column",
  },
  cardImg: {
    width: "100%",
    height: 260,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 14,
  },
  cardImgEmpty: {
    width: "100%",
    height: 260,
    borderRadius: 10,
    marginBottom: 14,
    background: "#0d0810",
    border: "1px dashed #2a1a22",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
  },
  cardPhrase: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "#f0e0e8",
    textAlign: "center",
    fontStyle: "italic",
  },
  dots: {
    display: "flex",
    gap: 8,
    marginTop: 22,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
  },
  empty: {
    color: "#8a7a88",
    fontSize: 14,
    padding: "40px 0",
  },
  editToggleWrap: { marginTop: 34 },
  editToggle: {
    background: "transparent",
    border: "1px solid rgba(232,96,154,0.35)",
    color: "#e8609a",
    padding: "9px 20px",
    borderRadius: 6,
    fontSize: 12,
    letterSpacing: 1.5,
    cursor: "pointer",
  },
  editPanel: {
    width: "100%",
    maxWidth: 480,
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },
  editItem: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 16,
    background: "rgba(15,10,20,0.55)",
    border: "1px solid rgba(232,96,154,0.15)",
    borderRadius: 10,
  },
  textarea: {
    width: "100%",
    minHeight: 70,
    padding: "10px 12px",
    background: "#0d0810",
    border: "1px solid #2a1a22",
    borderRadius: 6,
    color: "#f0e0e8",
    fontSize: 13,
    resize: "vertical",
  },
  deleteBtn: {
    alignSelf: "flex-end",
    background: "transparent",
    border: "1px solid rgba(255,77,109,0.35)",
    color: "#ff4d6d",
    padding: "6px 14px",
    borderRadius: 6,
    fontSize: 11,
    cursor: "pointer",
  },
  addBtn: {
    background: "linear-gradient(135deg,#e8609a,#8a4fd6)",
    border: "none",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 8,
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: 700,
    cursor: "pointer",
  },
};
