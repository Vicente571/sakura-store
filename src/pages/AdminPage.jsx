import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import ImageUploader from "../components/ImageUploader";
import { Link } from "react-router-dom";

const JP_CHARS = ["桜", "愛", "美", "輝", "宝", "星", "月", "花"];

export default function AdminPage() {
  const {
    categories,
    addCategory,
    deleteCategory,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useStore();
  const { logout } = useAuth();

  const [tab, setTab] = useState("products");
  const [toast, setToast] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const [pName, setPName] = useState("");
  const [pCat, setPCat] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pImg, setPImg] = useState("");

  const [cName, setCName] = useState("");
  const [cJp, setCJp] = useState("");

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function fillForm(p) {
    setEditingProduct(p);
    setPName(p.name);
    setPCat(p.categoryId);
    setPPrice(p.price);
    setPDesc(p.desc);
    setPImg(p.image);
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearForm() {
    setEditingProduct(null);
    setPName("");
    setPCat("");
    setPPrice("");
    setPDesc("");
    setPImg("");
  }

  async function handleSubmitProduct(e) {
    e.preventDefault();
    if (!pName.trim()) {
      showToast("El nombre es obligatorio", "err");
      return;
    }
    if (!pCat) {
      showToast("Elige una categoria", "err");
      return;
    }

    const data = {
      name: pName.trim(),
      categoryId: pCat,
      price: pPrice.trim(),
      desc: pDesc.trim(),
      image: pImg,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
      showToast("Producto actualizado");
    } else {
      await addProduct(data);
      showToast("Producto agregado");
    }
    clearForm();
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!cName.trim()) {
      showToast("El nombre es obligatorio", "err");
      return;
    }
    const res = await addCategory(cName.trim(), cJp.trim());
    if (res.error) {
      showToast(res.error, "err");
      return;
    }
    setCName("");
    setCJp("");
    showToast("Categoria creada");
  }

  async function handleDeleteCategory(id) {
    const cat = categories.find((c) => c.id === id);
    const count = products.filter((p) => p.categoryId === id).length;
    const msg =
      count > 0
        ? `Esto borrara la categoria "${cat?.name}" y sus ${count} producto(s). Continuar?`
        : `Borrar la categoria "${cat?.name}"?`;
    if (!window.confirm(msg)) return;
    await deleteCategory(id);
    showToast("Categoria eliminada");
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Borrar este producto?")) return;
    await deleteProduct(id);
    showToast("Producto eliminado");
  }

  const s = {
    page: { minHeight: "100vh", background: "#0a0a0a", position: "relative" },
    jpBg: {
      position: "fixed",
      inset: 0,
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 130,
      color: "rgba(220,80,130,0.02)",
      pointerEvents: "none",
      overflow: "hidden",
      lineHeight: 1,
      letterSpacing: 6,
      wordBreak: "break-all",
      padding: 10,
      userSelect: "none",
    },
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
    headerJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 9,
      color: "rgba(220,80,130,0.35)",
      letterSpacing: 2,
      marginTop: 3,
    },
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
      transition: "all 0.2s",
    },
    logoutBtn: {
      padding: "5px 14px",
      background: "transparent",
      border: "1px solid #3a1020",
      color: "#e8609a",
      fontSize: 10,
      letterSpacing: 2,
      textTransform: "uppercase",
      borderRadius: 2,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    main: {
      maxWidth: 700,
      margin: "0 auto",
      padding: "32px 24px 64px",
      position: "relative",
      zIndex: 1,
    },
    statsRow: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 12,
      marginBottom: 28,
    },
    statCard: {
      background: "#111014",
      border: "1px solid #1e0e18",
      borderRadius: 4,
      padding: "16px 20px",
      textAlign: "center",
    },
    statNum: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 36,
      letterSpacing: 3,
      color: "#e8609a",
      lineHeight: 1,
      display: "block",
    },
    statLabel: {
      fontSize: 9,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "#555",
      marginTop: 4,
      display: "block",
    },
    statJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 9,
      color: "rgba(232,96,154,0.25)",
      display: "block",
      marginTop: 2,
    },
    tabs: {
      display: "flex",
      gap: 0,
      marginBottom: 28,
      borderBottom: "1px solid #1e0e18",
    },
    tabBtn: (active) => ({
      padding: "10px 24px",
      background: "transparent",
      border: "none",
      borderBottom: `2px solid ${active ? "#e8609a" : "transparent"}`,
      color: active ? "#e8609a" : "#555",
      fontSize: 11,
      letterSpacing: 2,
      textTransform: "uppercase",
      fontWeight: active ? 700 : 400,
      cursor: "pointer",
      transition: "all 0.2s",
      marginBottom: -1,
    }),
    sectionTitle: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 22,
      letterSpacing: 5,
      color: "#f0e0e8",
      marginBottom: 4,
    },
    editingBanner: {
      padding: "10px 16px",
      background: "rgba(232,96,154,0.08)",
      border: "1px solid rgba(232,96,154,0.25)",
      borderRadius: 3,
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: 12,
      color: "#e8609a",
    },
    sectionJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 10,
      color: "rgba(232,96,154,0.3)",
      letterSpacing: 2,
      marginBottom: 22,
      display: "block",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      marginBottom: 36,
    },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    group: {},
    label: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 9,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "#888",
      marginBottom: 7,
    },
    labelJp: {
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 9,
      color: "rgba(232,96,154,0.3)",
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
      transition: "border-color 0.2s",
    },
    select: {
      width: "100%",
      background: "#111014",
      border: "1px solid #2a1a22",
      color: "#f0e0e8",
      padding: "10px 14px",
      fontSize: 13,
      borderRadius: 2,
      outline: "none",
      transition: "border-color 0.2s",
      appearance: "none",
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
      transition: "border-color 0.2s",
      resize: "vertical",
      minHeight: 80,
      lineHeight: 1.6,
    },
    btnRow: { display: "flex", gap: 10 },
    submitBtn: {
      flex: 1,
      padding: "12px 28px",
      background: "#e8609a",
      border: "none",
      color: "#0a0a0a",
      fontSize: 11,
      letterSpacing: 3,
      textTransform: "uppercase",
      fontWeight: 700,
      borderRadius: 2,
      cursor: "pointer",
      transition: "background 0.2s",
    },
    cancelBtn: {
      padding: "12px 20px",
      background: "transparent",
      border: "1px solid #2a1a22",
      color: "#888",
      fontSize: 11,
      letterSpacing: 2,
      textTransform: "uppercase",
      borderRadius: 2,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    divider: { height: 1, background: "#1e0e18", margin: "8px 0 24px" },
    listTitle: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 14,
      letterSpacing: 4,
      color: "#555",
      marginBottom: 14,
    },
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
      width: 44,
      height: 44,
      objectFit: "cover",
      borderRadius: 2,
      background: "#1a0810",
      flexShrink: 0,
    },
    itemImgPh: {
      width: 44,
      height: 44,
      borderRadius: 2,
      background: "#1a0810",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Noto Serif JP', serif",
      fontSize: 16,
      color: "rgba(232,96,154,0.3)",
    },
    itemInfo: { flex: 1, minWidth: 0 },
    itemName: {
      fontSize: 13,
      color: "#c0a0b0",
      display: "block",
      marginBottom: 3,
    },
    itemMeta: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
    },
    itemPrice: { fontSize: 11, color: "#e8609a", fontWeight: 600 },
    itemCat: {
      fontSize: 9,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "rgba(232,96,154,0.4)",
      border: "1px solid rgba(232,96,154,0.18)",
      padding: "2px 8px",
      borderRadius: 2,
    },
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
      cursor: "pointer",
      transition: "all 0.2s",
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
      cursor: "pointer",
      transition: "all 0.2s",
    },
    toast: (type) => ({
      position: "fixed",
      bottom: 28,
      right: 28,
      zIndex: 9999,
      padding: "12px 20px",
      borderRadius: 3,
      background: type === "ok" ? "#e8609a" : "#3a1020",
      border: `1px solid ${type === "ok" ? "#f07ab0" : "#e8609a"}`,
      color: type === "ok" ? "#0a0a0a" : "#f07ab0",
      fontSize: 12,
      letterSpacing: 2,
      textTransform: "uppercase",
      fontWeight: 700,
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      animation: "fadeIn 0.3s ease",
    }),
  };

  const focusStyle = (e) => (e.target.style.borderColor = "#e8609a");
  const blurStyle = (e) => (e.target.style.borderColor = "#2a1a22");

  return (
    <div style={s.page}>
      <div style={s.jpBg}>
        管理パネル商品登録カテゴリー桜ストア管理パネル商品登録カテゴリー桜ストア管理パネル商品
      </div>

      <header style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.headerTitle}>Panel Admin 🌸</span>
          <span style={s.headerJp}>管理パネル　・　Sakura Store</span>
        </div>
        <div style={s.headerRight}>
          <Link
            to="/"
            style={s.viewBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#e8609a";
              e.currentTarget.style.color = "#e8609a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#2a1a22";
              e.currentTarget.style.color = "#888";
            }}
          >
            Ver tienda
          </Link>
          <Link
            to="/mi-universo/editar"
            style={s.viewBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#e8609a";
              e.currentTarget.style.color = "#e8609a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#2a1a22";
              e.currentTarget.style.color = "#888";
            }}
          >
            Galaxia
          </Link>
          <button
            style={s.logoutBtn}
            onClick={logout}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(232,96,154,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Salir
          </button>
        </div>
      </header>

      <main style={s.main}>
        <div style={s.statsRow}>
          <div style={s.statCard}>
            <span style={s.statNum}>{products.length}</span>
            <span style={s.statLabel}>Productos</span>
            <span style={s.statJp}>商品</span>
          </div>
          <div style={s.statCard}>
            <span style={s.statNum}>{categories.length}</span>
            <span style={s.statLabel}>Categorias</span>
            <span style={s.statJp}>カテゴリー</span>
          </div>
        </div>

        <div style={s.tabs}>
          <button
            style={s.tabBtn(tab === "products")}
            onClick={() => setTab("products")}
          >
            Productos
          </button>
          <button
            style={s.tabBtn(tab === "categories")}
            onClick={() => setTab("categories")}
          >
            Categorias
          </button>
        </div>

        {tab === "products" && (
          <div className="fade-in">
            <div style={s.sectionTitle}>
              {editingProduct ? "Editar Producto" : "Agregar Producto"}
            </div>
            <span style={s.sectionJp}>
              {editingProduct ? "商品を編集する" : "商品を追加する"}
            </span>

            {editingProduct && (
              <div style={s.editingBanner}>
                <span>
                  Editando: <strong>{editingProduct.name}</strong>
                </span>
                <button
                  style={{ ...s.cancelBtn, padding: "4px 12px", fontSize: 10 }}
                  onClick={clearForm}
                >
                  Cancelar edicion
                </button>
              </div>
            )}

            <div style={s.form}>
              <div>
                <label style={s.label}>
                  Foto del producto <span style={s.labelJp}>写真</span>
                </label>
                <ImageUploader value={pImg} onChange={setPImg} />
              </div>
              <div style={s.group}>
                <label style={s.label}>
                  Nombre <span style={s.labelJp}>商品名</span>
                </label>
                <input
                  style={s.input}
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="Ej: Pulsera Sakura"
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
              <div style={s.row}>
                <div style={s.group}>
                  <label style={s.label}>
                    Categoria <span style={s.labelJp}>カテゴリー</span>
                  </label>
                  <select
                    style={s.select}
                    value={pCat}
                    onChange={(e) => setPCat(e.target.value)}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  >
                    <option value="">-- Elige --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={s.group}>
                  <label style={s.label}>
                    Precio <span style={s.labelJp}>価格</span>
                  </label>
                  <input
                    style={s.input}
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    placeholder="150"
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
              </div>
              <div style={s.group}>
                <label style={s.label}>
                  Descripcion <span style={s.labelJp}>説明</span>
                </label>
                <textarea
                  style={s.textarea}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Describe el producto..."
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
              <div style={s.btnRow}>
                <button
                  style={s.submitBtn}
                  onClick={handleSubmitProduct}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f07ab0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#e8609a")
                  }
                >
                  {editingProduct ? "Guardar cambios" : "Agregar producto"}
                </button>
                {editingProduct && (
                  <button
                    style={s.cancelBtn}
                    onClick={clearForm}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#e8609a";
                      e.currentTarget.style.color = "#e8609a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#2a1a22";
                      e.currentTarget.style.color = "#888";
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            <div style={s.divider} />
            <div style={s.listTitle}>
              Productos registrados ({products.length})
            </div>
            {products.length === 0 && (
              <div style={{ fontSize: 12, color: "#444", padding: "16px 0" }}>
                Sin productos aun
              </div>
            )}
            {products.map((p, i) => {
              const cat = categories.find((c) => c.id === p.categoryId);
              return (
                <div key={p.id} style={s.item}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={s.itemImg} />
                  ) : (
                    <div style={s.itemImgPh}>
                      {JP_CHARS[i % JP_CHARS.length]}
                    </div>
                  )}
                  <div style={s.itemInfo}>
                    <span style={s.itemName}>{p.name}</span>
                    <div style={s.itemMeta}>
                      {p.price && <span style={s.itemPrice}>${p.price}</span>}
                      {cat && <span style={s.itemCat}>{cat.name}</span>}
                    </div>
                  </div>
                  <div style={s.actionBtns}>
                    <button
                      style={s.editBtn}
                      onClick={() => fillForm(p)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(232,96,154,0.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(232,96,154,0.1)")
                      }
                    >
                      Editar
                    </button>
                    <button
                      style={s.deleteBtn}
                      onClick={() => handleDeleteProduct(p.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#e8609a";
                        e.currentTarget.style.color = "#e8609a";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#2a1020";
                        e.currentTarget.style.color = "#555";
                      }}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "categories" && (
          <div className="fade-in">
            <div style={s.sectionTitle}>Agregar Categoria</div>
            <span style={s.sectionJp}>カテゴリーを追加する</span>
            <div style={s.form}>
              <div style={s.row}>
                <div style={s.group}>
                  <label style={s.label}>
                    Nombre <span style={s.labelJp}>名前</span>
                  </label>
                  <input
                    style={s.input}
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    placeholder="Ej: Tobilleras"
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
                <div style={s.group}>
                  <label style={s.label}>
                    Nombre en japones <span style={s.labelJp}>（任意）</span>
                  </label>
                  <input
                    style={s.input}
                    value={cJp}
                    onChange={(e) => setCJp(e.target.value)}
                    placeholder="Ej: アンクレット"
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
              </div>
              <button
                style={{ ...s.submitBtn, alignSelf: "flex-start" }}
                onClick={handleAddCategory}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f07ab0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#e8609a")
                }
              >
                Crear categoria
              </button>
            </div>
            <div style={s.divider} />
            <div style={s.listTitle}>Categorias ({categories.length})</div>
            {categories.map((cat) => {
              const count = products.filter(
                (p) => p.categoryId === cat.id,
              ).length;
              return (
                <div key={cat.id} style={s.item}>
                  <span
                    style={{
                      fontFamily: "'Noto Serif JP', serif",
                      fontSize: 20,
                      color: "rgba(232,96,154,0.4)",
                      minWidth: 28,
                    }}
                  >
                    桜
                  </span>
                  <div style={s.itemInfo}>
                    <span style={s.itemName}>{cat.name}</span>
                    <div style={s.itemMeta}>
                      <span
                        style={{
                          fontFamily: "'Noto Serif JP', serif",
                          fontSize: 11,
                          color: "rgba(232,96,154,0.3)",
                        }}
                      >
                        {cat.jp}
                      </span>
                      <span style={s.itemCat}>
                        {count} producto{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <button
                    style={s.deleteBtn}
                    onClick={() => handleDeleteCategory(cat.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#e8609a";
                      e.currentTarget.style.color = "#e8609a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#2a1020";
                      e.currentTarget.style.color = "#555";
                    }}
                  >
                    Borrar
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {toast && <div style={s.toast(toast.type)}>{toast.msg}</div>}
    </div>
  );
}
