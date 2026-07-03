// Cliente compartido para el backend de Google Apps Script (Sheets).
// Lo usan tanto el catalogo/admin (productos, categorias) como la
// galaxia secreta (recuerdos), para que todo se guarde en un solo lugar
// y se vea igual en cualquier dispositivo.

export const API_URL =
  "https://script.google.com/macros/s/AKfycbyDRYsv9yO7dXr6RycvPieJioq5AM2R_TyRJR_S0QZ7mwadIr7l89hJ7SkBb6OVo2Yh/exec";

export async function apiGet(action, params = "") {
  const res = await fetch(`${API_URL}?action=${action}${params}`);
  return res.json();
}

export async function apiPost(action, data) {
  const encoded = encodeURIComponent(JSON.stringify(data));
  const res = await fetch(`${API_URL}?action=${action}&data=${encoded}`);
  return res.json();
}
