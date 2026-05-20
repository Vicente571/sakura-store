import { useState } from "react";

// ══════════════════════════════════════════════════════════
//  OPCION A — ImgBB (recomendada, mas facil)
//  1. Ve a https://imgbb.com y crea cuenta gratis
//  2. Ve a https://api.imgbb.com → copia tu API key
//  3. Pega tu key abajo en IMGBB_KEY
//
//  OPCION B — Cloudinary
//  1. Ve a https://cloudinary.com → cuenta gratis
//  2. Copia tu Cloud Name y crea un Upload Preset (Unsigned)
//  3. Llena CLOUDINARY_CLOUD y CLOUDINARY_PRESET abajo
// ══════════════════════════════════════════════════════════

const IMGBB_KEY = "091273da6f9c6a3632dd5b138192ee6b"; // ← pega aqui tu key de ImgBB
const CLOUDINARY_CLOUD = "TU_CLOUD_NAME"; // ← solo si usas Cloudinary
const CLOUDINARY_PRESET = "TU_UPLOAD_PRESET"; // ← solo si usas Cloudinary

// Detecta cual esta configurado
const USE_IMGBB = IMGBB_KEY !== "TU_API_KEY_IMGBB";
const USE_CLOUDINARY = CLOUDINARY_CLOUD !== "TU_CLOUD_NAME";

export const uploadConfigured = USE_IMGBB || USE_CLOUDINARY;

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  async function upload(file) {
    if (!file) return null;
    setUploading(true);
    setProgress(10);
    setError(null);

    try {
      if (USE_IMGBB) {
        return await uploadImgBB(file, setProgress);
      } else if (USE_CLOUDINARY) {
        return await uploadCloudinary(file, setProgress);
      } else {
        // Sin configuracion: usa URL local temporal (solo para pruebas)
        return await toLocalURL(file);
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, progress, error };
}

// ── ImgBB ──────────────────────────────────────────────────
async function uploadImgBB(file, setProgress) {
  setProgress(30);
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: form,
  });
  setProgress(90);
  const data = await res.json();
  if (!data.success)
    throw new Error(data.error?.message || "Error al subir a ImgBB");
  setProgress(100);
  return data.data.url; // URL publica permanente
}

// ── Cloudinary ─────────────────────────────────────────────
async function uploadCloudinary(file, setProgress) {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_PRESET);
  form.append("folder", "sakura-store");

  const xhr = new XMLHttpRequest();
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

  return new Promise((resolve, reject) => {
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        setProgress(Math.round((e.loaded / e.total) * 90));
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setProgress(100);
        resolve(data.secure_url);
      } else {
        reject(new Error("Error al subir a Cloudinary"));
      }
    };
    xhr.onerror = () => reject(new Error("Error de red"));
    xhr.open("POST", url);
    xhr.send(form);
  });
}

// ── Fallback local (solo pruebas, no persiste) ─────────────
function toLocalURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result); // base64, solo dura en sesion
    reader.readAsDataURL(file);
  });
}
