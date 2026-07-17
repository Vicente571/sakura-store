import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

const WA_NUMBER = "524624360831";
const IG_USER = "storee.sakura";
const JP_CHARS = ["桜", "愛", "美", "輝", "宝", "星", "月", "花", "光", "夢"];

function buildWALink(product) {
  const msg = encodeURIComponent(
    `Hola! Vi el producto *${product.name}* en Sakura Store y me interesa hacer un encargo.\n` +
      `💰 Precio: $${product.price}\n` +
      `${product.image ? "📸 Foto: " + product.image + "\n" : ""}` +
      `¿Tienes disponibilidad? 🌸`,
  );
  return `https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${msg}`;
}

function buildIGLink() {
  return `https://ig.me/m/${IG_USER}`;
}

export default function ProductCard({ product, index }) {
  const { categories } = useStore();
  const [imgError, setImgError] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const cat = categories.find((c) => c.id === product.categoryId);
  const jpChar = JP_CHARS[index % JP_CHARS.length];

  const s = {
    card: {
      background: "#0a1d24",
      border: "1px solid #123540",
      borderRadius: 4,
      overflow: "hidden",
      position: "relative",
      transition: "border-color 0.25s, transform 0.25s",
      animation: `fadeIn 0.4s ease ${index * 0.06}s both`,
      display: "flex",
      flexDirection: "column",
    },
    imgWrap: {
      width: "100%",
      height: 220,
      position: "relative",
      overflow: "hidden",
      cursor: product.image && !imgError ? "zoom-in" : "default",
      background: "#08242d",
    },
    img: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPosition: "center",
      display: "block",
      transition: "transform 0.4s ease",
      background: "#08242d",
    },
    placeholder: {
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #0d313b 0%, #145767 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    phJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 36,
      color: "rgba(88,224,164,0.25)",
    },
    phLabel: {
      fontSize: 10,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "rgba(52,200,255,0.15)",
    },
    zoomHint: {
      position: "absolute",
      bottom: 8,
      right: 8,
      background: "rgba(10,10,10,0.7)",
      border: "1px solid rgba(52,200,255,0.2)",
      borderRadius: 2,
      padding: "3px 8px",
      fontSize: 9,
      letterSpacing: 1,
      color: "rgba(88,224,164,0.6)",
      textTransform: "uppercase",
      pointerEvents: "none",
    },
    corner: {
      position: "absolute",
      top: 10,
      right: 10,
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 18,
      color: "rgba(52,200,255,0.45)",
      pointerEvents: "none",
    },
    body: {
      padding: "14px 16px 16px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    catRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 5 },
    catTag: {
      fontSize: 9,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "#34c8ff",
      border: "1px solid rgba(88,224,164,0.25)",
      padding: "2px 7px",
      borderRadius: 2,
    },
    catJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 9,
      color: "rgba(88,224,164,0.3)",
    },
    price: {
      fontSize: 12,
      fontWeight: 700,
      color: "#34c8ff",
      marginLeft: "auto",
    },
    name: {
      fontSize: 15,
      fontWeight: 600,
      color: "#e6fbff",
      marginBottom: 6,
      lineHeight: 1.35,
    },
    desc: {
      fontSize: 11,
      color: "#6b8e99",
      lineHeight: 1.6,
      marginBottom: 10,
      flex: 1,
    },
    btnGroup: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 6,
      marginBottom: 6,
    },
    btnWA: {
      padding: "9px 6px",
      background: "#34c8ff",
      border: "none",
      color: "#04141b",
      fontSize: 9,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      fontWeight: 700,
      borderRadius: 2,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.2s",
    },
    btnIG: {
      padding: "9px 6px",
      background: "transparent",
      border: "1px solid rgba(88,224,164,0.35)",
      color: "#34c8ff",
      fontSize: 9,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      fontWeight: 700,
      borderRadius: 2,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s",
    },
    igNote: {
      fontSize: 9,
      color: "#47666f",
      textAlign: "center",
      lineHeight: 1.4,
    },
    lightboxOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.92)",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      cursor: "zoom-out",
      animation: "fadeIn 0.2s ease",
    },
    lightboxImg: {
      maxWidth: "90vw",
      maxHeight: "80vh",
      objectFit: "contain",
      borderRadius: 4,
      border: "1px solid rgba(52,200,255,0.2)",
      boxShadow: "0 0 60px rgba(52,200,255,0.15)",
    },
    lightboxName: {
      marginTop: 16,
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 20,
      letterSpacing: 4,
      color: "#34c8ff",
    },
    lightboxClose: {
      position: "absolute",
      top: 20,
      right: 24,
      background: "transparent",
      border: "1px solid rgba(88,224,164,0.3)",
      color: "#34c8ff",
      fontSize: 11,
      letterSpacing: 2,
      textTransform: "uppercase",
      padding: "5px 14px",
      borderRadius: 2,
      cursor: "pointer",
    },
    lightboxPrice: {
      marginTop: 6,
      fontSize: 13,
      color: "#9fe7d5",
      letterSpacing: 2,
    },
  };

  return (
    <>
      <div
        style={s.card}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#34c8ff";
          e.currentTarget.style.transform = "translateY(-4px)";
          const img = e.currentTarget.querySelector(".card-img");
          if (img) img.style.transform = "scale(1.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#123540";
          e.currentTarget.style.transform = "translateY(0)";
          const img = e.currentTarget.querySelector(".card-img");
          if (img) img.style.transform = "scale(1)";
        }}
      >
        <div
          style={s.imgWrap}
          onClick={() => product.image && !imgError && setLightbox(true)}
        >
          {product.image && !imgError ? (
            <>
              <img
                className="card-img"
                src={product.image}
                alt={product.name}
                style={s.img}
                onError={() => setImgError(true)}
              />
              <div style={s.zoomHint}>Ver foto</div>
            </>
          ) : (
            <div style={s.placeholder}>
              <span style={s.phJp}>{jpChar}</span>
              <span style={s.phLabel}>{cat?.name || "producto"}</span>
            </div>
          )}
          <div style={s.corner}>{jpChar}</div>
        </div>

        <div style={s.body}>
          <div style={s.catRow}>
            {cat && <span style={s.catTag}>{cat.name}</span>}
            {cat && <span style={s.catJp}>{cat.jp}</span>}
            {product.price && <span style={s.price}>${product.price}</span>}
          </div>
          <div style={s.name}>{product.name}</div>
          <div style={s.desc}>{product.desc}</div>
          <div style={s.btnGroup}>
            <button
              style={s.btnWA}
              onClick={() =>
                window.open(
                  buildWALink(product),
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#66e1c6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#34c8ff")
              }
            >
              WhatsApp
            </button>
            <button
              style={s.btnIG}
              onClick={() =>
                window.open(buildIGLink(), "_blank", "noopener,noreferrer")
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(52,200,255,0.12)";
                e.currentTarget.style.borderColor = "#34c8ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(88,224,164,0.35)";
              }}
            >
              Instagram
            </button>
          </div>
          <div style={s.igNote}>
            Whatsapp si manda con info y foto del producto que quieras.
            Instagram solo abre el chat. Para preguntar toma captura de la foto
            del producto.
          </div>
        </div>
      </div>

      {lightbox && (
        <div style={s.lightboxOverlay} onClick={() => setLightbox(false)}>
          <button style={s.lightboxClose} onClick={() => setLightbox(false)}>
            Cerrar
          </button>
          <img
            src={product.image}
            alt={product.name}
            style={s.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
          <div style={s.lightboxName}>{product.name}</div>
          {product.price && (
            <div style={s.lightboxPrice}>${product.price} MXN</div>
          )}
        </div>
      )}
    </>
  );
}
