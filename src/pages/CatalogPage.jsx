import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

const JP_BG =
  "宝石アクセサリー美しい輝きジュエリー愛装飾品桜ストア宝石アクセサリー美しい輝きジュエリー";

export default function CatalogPage() {
  const { categories, products, loading } = useStore();
  const [activeCat, setActiveCat] = useState("all");

  const filtered =
    activeCat === "all"
      ? products
      : products.filter((p) => p.categoryId === activeCat);

  const s = {
    page: {
      minHeight: "100vh",
      background: "#04141b",
      position: "relative",
      overflowX: "hidden",
    },
    jpBg: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 130,
      color: "rgba(52,200,255,0.025)",
      pointerEvents: "none",
      overflow: "hidden",
      lineHeight: 1,
      letterSpacing: 6,
      wordBreak: "break-all",
      padding: 10,
      zIndex: 0,
      userSelect: "none",
    },
    content: { position: "relative", zIndex: 1 },
    hero: {
      padding: "52px 24px 28px",
      textAlign: "center",
    },
    heroJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 11,
      color: "rgba(52,200,255,0.4)",
      letterSpacing: 5,
      display: "block",
      marginBottom: 14,
    },
    heroTitle: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 58,
      letterSpacing: 7,
      color: "#e6fbff",
      lineHeight: 1,
      marginBottom: 10,
    },
    heroSpan: { color: "#34c8ff" },
    heroSub: {
      fontSize: 11,
      color: "#5f7f89",
      letterSpacing: 3,
      textTransform: "uppercase",
    },
    accentLine: {
      width: 60,
      height: 2,
      background: "#34c8ff",
      margin: "16px auto 0",
    },
    deliveryBanner: {
      margin: "0 24px 24px",
      background: "#0a1d24",
      border: "1px solid #145767",
      borderLeft: "3px solid #34c8ff",
      borderRadius: 2,
      padding: "13px 18px",
    },
    dbTitle: {
      fontSize: 9,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "#34c8ff",
      marginBottom: 5,
      fontWeight: 700,
    },
    dbCities: { fontSize: 13, color: "#9fe7d5", marginBottom: 4 },
    dbCitiesStrong: { color: "#e6fbff", fontWeight: 600 },
    dbSoon: { fontSize: 11, color: "#5f7f89" },
    dbSoonSpan: { color: "rgba(88,224,164,0.6)" },
    catsWrap: {
      display: "flex",
      gap: 8,
      padding: "0 24px 24px",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    sectionLabel: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 24px 14px",
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 13,
      letterSpacing: 5,
      color: "#47666f",
      textTransform: "uppercase",
    },
    sectionLine: { flex: 1, height: 1, background: "#123540" },
    sectionJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 11,
      color: "rgba(88,224,164,0.25)",
      fontWeight: "normal",
      letterSpacing: 2,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: 18,
      padding: "0 24px 48px",
    },
    empty: {
      textAlign: "center",
      padding: "60px 24px",
      color: "#47666f",
    },
    emptyJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 28,
      color: "rgba(52,200,255,0.15)",
      display: "block",
      marginBottom: 12,
    },
    footer: {
      textAlign: "center",
      padding: "20px 24px",
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 12,
      color: "rgba(52,200,255,0.12)",
      letterSpacing: 6,
      borderTop: "1px solid #0d313b",
    },
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#04141b",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 32,
            letterSpacing: 6,
            color: "#34c8ff",
          }}
        >
          Sakura Store 🌸
        </div>
        <div
          style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 13,
            color: "rgba(52,200,255,0.4)",
            letterSpacing: 4,
          }}
        >
          読み込み中...
        </div>
        <div
          style={{
            width: 200,
            height: 2,
            background: "#0d313b",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "#34c8ff",
              borderRadius: 2,
              animation: "loading 1.5s ease-in-out infinite",
            }}
          />
        </div>
        <style>{`
        @keyframes loading {
          0%   { width: 0%;   margin-left: 0; }
          50%  { width: 100%; margin-left: 0; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
      </div>
    );

  return (
    <div style={s.page}>
      <div style={s.jpBg}>{JP_BG.repeat(4)}</div>
      <div style={s.content}>
        <Header />

        <div style={s.hero}>
          <span style={s.heroJp}>コスチュームジュエリー　＆　アクセサリー</span>
          <div style={s.heroTitle}>
            Bisuteria &amp; <span style={s.heroSpan}>Accesorios</span>
          </div>
          <p style={s.heroSub}>Sakura Store　・　コスチュームジュエリ</p>
          <div style={s.accentLine} />
        </div>

        <div style={s.deliveryBanner}>
          <div style={s.dbTitle}>Entregas locales disponibles</div>
          <div style={s.dbCities}>
            Realizamos entregas en{" "}
            <strong style={s.dbCitiesStrong}>Irapuato</strong> y{" "}
            <strong style={s.dbCitiesStrong}>Leon</strong>, Guanajuato.
          </div>
          <div style={s.dbSoon}>
            Proximamente <span style={s.dbSoonSpan}>envios a todo Mexico</span>
          </div>
        </div>

        <div style={s.catsWrap}>
          <CatButton
            active={activeCat === "all"}
            onClick={() => setActiveCat("all")}
            label="Todos"
            jp="全部"
          />
          {categories.map((cat) => (
            <CatButton
              key={cat.id}
              active={activeCat === cat.id}
              onClick={() => setActiveCat(cat.id)}
              label={cat.name}
              jp={cat.jp}
            />
          ))}
        </div>

        <div style={s.sectionLabel}>
          Coleccion disponible
          <span style={s.sectionJp}>コレクション</span>
          <div style={s.sectionLine} />
        </div>

        {filtered.length === 0 ? (
          <div style={s.empty}>
            <span style={s.emptyJp}>空</span>
            <div>No hay productos en esta categoria aun</div>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}

        <div style={s.footer}>
          桜　・　宝石　・　アクセサリー　・　美　・　輝き
        </div>
      </div>
    </div>
  );
}

function CatButton({ active, onClick, label, jp }) {
  const s = {
    btn: {
      padding: "7px 18px",
      background: active ? "rgba(52,200,255,0.12)" : "transparent",
      border: `1px solid ${active ? "#34c8ff" : "#1a4b59"}`,
      color: active ? "#34c8ff" : "#8db6bf",
      fontSize: 11,
      letterSpacing: 2,
      cursor: "pointer",
      textTransform: "uppercase",
      borderRadius: 2,
      transition: "all 0.2s",
      lineHeight: 1.2,
    },
    jp: {
      display: "block",
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 8,
      color: active ? "rgba(88,224,164,0.5)" : "rgba(52,200,255,0.2)",
      letterSpacing: 1,
      marginTop: 3,
    },
  };

  return (
    <button
      style={s.btn}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "#34c8ff";
          e.currentTarget.style.color = "#34c8ff";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "#1a4b59";
          e.currentTarget.style.color = "#8db6bf";
        }
      }}
    >
      {label}
      <span style={s.jp}>{jp}</span>
    </button>
  );
}
