// Datos de la galaxia secreta 🩷
// El contenido (fotos + frases + mensaje de bienvenida) se guarda en el
// mismo backend (Google Apps Script) que usa la tienda, para que se vea
// igual sin importar desde que celular, tablet o computadora entren al
// link. localStorage se usa solo como cache: hace que la galaxia cargue
// al instante y siga funcionando un momento si no hay internet, pero la
// version que manda siempre es la del servidor.

import { apiGet, apiPost } from "./api";

export const MEMORIES_KEY = "sk_galaxy_memories";
export const INTRO_KEY = "sk_galaxy_intro";

export const defaultIntro = "Para mi niña, mi universo entero 🩷";

function placeholder(from, to) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <radialGradient id="g" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g)" />
    </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const defaultMemories = [
  {
    id: "demo-1",
    image: placeholder("#c7fff1", "#1b5f63"),
    phrase: "Mi niña, contigo hasta las estrellas se ven mas bonitas 🩷",
  },
  {
    id: "demo-2",
    image: placeholder("#bde6ff", "#1b4e72"),
    phrase: "Mi vida, eres la luz que ilumina toda mi galaxia 😍",
  },
  {
    id: "demo-3",
    image: placeholder("#9fe7d5", "#1e5b58"),
    phrase: "Mi cielo, gracias por existir y por ser mi persona favorita 🩶",
  },
];

// ── Cache local (localStorage) ────────────────────────────────
export function loadMemories() {
  try {
    const raw = localStorage.getItem(MEMORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse errors, fall back to defaults
  }
  return defaultMemories;
}

export function saveMemories(memories) {
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
}

export function loadIntro() {
  const raw = localStorage.getItem(INTRO_KEY);
  return raw && raw.trim() ? raw : defaultIntro;
}

export function saveIntro(text) {
  localStorage.setItem(INTRO_KEY, text);
}

function cacheLocally({ intro, memories }) {
  // Un mensaje vacio vuelve al mensaje de ejemplo (igual que loadIntro),
  // y una lista vacia de recuerdos vuelve a los ejemplos de muestra para
  // que la pantalla nunca se quede completamente vacia.
  saveIntro(intro && intro.trim() ? intro : defaultIntro);
  saveMemories(memories && memories.length > 0 ? memories : defaultMemories);
}

// ── Backend compartido (Google Apps Script) ───────────────────
// Trae el contenido guardado en el servidor. Si no hay internet o el
// backend aun no soporta estas acciones, regresa lo que haya en cache
// local (o los ejemplos de muestra) para que la pantalla nunca truene.
export async function fetchGalaxy() {
  try {
    const remote = await apiGet("getGalaxy");
    if (remote && !remote.error && Array.isArray(remote.memories)) {
      cacheLocally(remote);
      return {
        intro: remote.intro || defaultIntro,
        memories:
          remote.memories.length > 0 ? remote.memories : defaultMemories,
        synced: true,
      };
    }
  } catch {
    // sin internet o backend no disponible: usamos la cache local
  }
  return { intro: loadIntro(), memories: loadMemories(), synced: false };
}

// Guarda el contenido completo (recuerdos + mensaje) en el servidor para
// que se vea igual en todos los dispositivos, y actualiza la cache local
// al mismo tiempo para que quede como respaldo instantaneo.
export async function saveGalaxy({ intro, memories }) {
  cacheLocally({ intro, memories });
  try {
    const res = await apiPost("saveGalaxy", { intro, memories });
    return !res?.error;
  } catch {
    return false;
  }
}
