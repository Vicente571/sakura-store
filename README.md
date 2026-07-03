# Sakura Store 🌸

Tienda de joyería y accesorios de Daniela Abigail.
100% Frontend — sin backend, sin base de datos, costo cero.

---

## Instalación y uso

```bash
# 1. Entra a la carpeta
cd sakura-store

# 2. Instala las dependencias
npm install

# 3. Arranca el servidor de desarrollo
npm run dev
```

Abre http://localhost:5173 en tu navegador.

---

## Pantallas

| Ruta | Descripcion |
|------|-------------|
| `/` | Catalogo público con filtros por categoría |
| `/admin` | Panel de administrador (requiere login) |

**Credenciales admin:**
- Usuario: `admin`
- Contraseña: `abigail`

---

## Configurar subida de fotos (ImgBB — recomendado, gratis)

1. Crea cuenta gratis en https://imgbb.com
2. Ve a https://api.imgbb.com y copia tu **API Key**
3. Abre `src/hooks/useImageUpload.js` y reemplaza:

```js
const IMGBB_KEY = 'TU_API_KEY_IMGBB'  // ← pega tu key aqui
```

Las fotos quedan públicas y permanentes en ImgBB sin costo.

## Alternativa: Cloudinary

Si prefieres Cloudinary:
1. Crea cuenta en https://cloudinary.com
2. Copia tu **Cloud Name** y crea un **Upload Preset** (Unsigned)
3. En `src/hooks/useImageUpload.js` reemplaza:

```js
const CLOUDINARY_CLOUD  = 'TU_CLOUD_NAME'
const CLOUDINARY_PRESET = 'TU_UPLOAD_PRESET'
```

---

## Publicar gratis en internet

### Opción 1 — Vercel (recomendada, la más fácil)
```bash
npm install -g vercel
vercel
```
Te da una URL tipo `https://sakura-store.vercel.app`

### Opción 2 — Netlify
```bash
npm run build
# Arrastra la carpeta dist/ a https://app.netlify.com/drop
```

---

## Almacenamiento

Los productos y categorías se guardan en el backend de Google Apps Script /
Google Sheets configurado en `src/data/api.js`.

---

## Galaxia secreta (`/mi-universo`)

Pantalla oculta (sin enlaces desde el sitio publico ni desde `/admin`) que
muestra fotos y frases como "planetas" flotando en una galaxia 3D. Se edita
desde `/mi-universo/editar` con las mismas credenciales de `/admin`.

Para que lo que agregues se vea **en cualquier celular o computadora** (y no
solo en el navegador donde lo editaste), el contenido se guarda en el mismo
backend de Google Apps Script que usan los productos. Si tu Apps Script
todavia no tiene las acciones `getGalaxy` / `saveGalaxy`, agrega esto a tu
`Code.gs` (usa `PropertiesService`, así no necesitas tocar tu hoja de
calculo):

```js
function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getGalaxy') {
    const raw = PropertiesService.getScriptProperties().getProperty('galaxy');
    return respond(raw ? JSON.parse(raw) : { intro: '', memories: [] });
  }

  if (action === 'saveGalaxy') {
    const data = JSON.parse(e.parameter.data);
    PropertiesService.getScriptProperties().setProperty('galaxy', JSON.stringify(data));
    return respond({ ok: true });
  }

  // ... el resto de tus acciones existentes (getProducts, getCategories, etc.)
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Mientras no agregues esas acciones, la galaxia sigue funcionando pero cada
dispositivo vera solo lo guardado en su propio navegador (localStorage), tal
como antes.

---

## WhatsApp e Instagram configurados

- WhatsApp: +52 462 436 0831
- Instagram: @storee.sakura

El botón "Hacer encargo" manda un mensaje automático con el nombre del producto.
