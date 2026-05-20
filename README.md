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

Los productos y categorías se guardan en **localStorage** del navegador.
Los datos persisten aunque se cierre el navegador.

> Nota: si Daniela cambia de dispositivo o limpia el navegador, los datos locales
> se pierden. Para respaldo, considera exportar los datos periódicamente
> (se puede agregar esa función más adelante).

---

## WhatsApp e Instagram configurados

- WhatsApp: +52 462 436 0831
- Instagram: @storee.sakura

El botón "Hacer encargo" manda un mensaje automático con el nombre del producto.
