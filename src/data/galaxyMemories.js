// Datos de la galaxia secreta 🩷
// Todo se guarda en el navegador (localStorage) desde la pantalla editora.
// Si algun dia limpias el cache del navegador donde editaste, se perderan
// los cambios locales y la galaxia volvera a mostrar estos valores de
// ejemplo. Para respaldarlos, usa el boton "Copiar respaldo" en el editor
// y guarda ese texto en un lugar seguro.

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
    image: placeholder("#ffd7ec", "#7a2f66"),
    phrase: "Mi niña, contigo hasta las estrellas se ven mas bonitas 🩷",
  },
  {
    id: "demo-2",
    image: placeholder("#e5c9ff", "#4a2472"),
    phrase: "Mi vida, eres la luz que ilumina toda mi galaxia 😍",
  },
  {
    id: "demo-3",
    image: placeholder("#c9e3ff", "#2a3a72"),
    phrase: "Mi cielo, gracias por existir y por ser mi persona favorita 🩶",
  },
];

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
