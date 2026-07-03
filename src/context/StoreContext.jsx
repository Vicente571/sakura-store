import React, { createContext, useContext, useState, useEffect } from "react";
import { apiGet, apiPost } from "../data/api";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          apiGet("getCategories"),
          apiGet("getProducts"),
        ]);
        if (Array.isArray(cats)) setCategories(cats);
        if (Array.isArray(prods)) setProducts(prods);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function addCategory(name, jp) {
    const id = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    if (categories.find((c) => c.id === id))
      return { error: "Ya existe esa categoria" };
    const cat = { id, name, jp: jp || name };
    await apiPost("addCategory", cat);
    setCategories((prev) => [...prev, cat]);
    return { ok: true };
  }

  async function deleteCategory(id) {
    await apiGet("deleteCategory", `&id=${id}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setProducts((prev) => prev.filter((p) => p.categoryId !== id));
  }

  async function addProduct(data) {
    const product = { ...data, id: Date.now().toString() };
    await apiPost("addProduct", product);
    setProducts((prev) => [...prev, product]);
    return product;
  }

  async function updateProduct(id, data) {
    const payload = { id, ...data };
    await apiPost("updateProduct", payload);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
    );
  }

  async function deleteProduct(id) {
    await apiGet("deleteProduct", `&id=${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <StoreContext.Provider
      value={{
        categories,
        addCategory,
        deleteCategory,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        loading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
