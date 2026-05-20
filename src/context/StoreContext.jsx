import React, { createContext, useContext, useState, useEffect } from 'react'

const StoreContext = createContext(null)

const DEFAULT_CATEGORIES = [
  { id: 'pulseras', name: 'Pulseras', jp: 'ブレスレット' },
  { id: 'collares', name: 'Collares', jp: 'ネックレス' },
  { id: 'llaveros', name: 'Llaveros', jp: 'キーホルダー' },
  { id: 'joyeria',  name: 'Joyeria',  jp: 'ジュエリー'  },
]

const DEFAULT_PRODUCTS = [
  { id: '1', name: 'Pulsera Minimalista', categoryId: 'pulseras', price: '120', desc: 'Cadena fina con dije de luna, acero inoxidable antiallergico.', image: '' },
  { id: '2', name: 'Collar Estrella',     categoryId: 'collares', price: '180', desc: 'Colgante en forma de estrella banado en oro rosa.',           image: '' },
  { id: '3', name: 'Llavero Mariposa',   categoryId: 'llaveros', price: '80',  desc: 'Mariposa artesanal con resina y flores secas prensadas.',      image: '' },
  { id: '4', name: 'Aretes Gota',        categoryId: 'joyeria',  price: '95',  desc: 'Aretes colgantes con piedra natural en rosa cuarzo.',          image: '' },
  { id: '5', name: 'Pulsera Perlas',     categoryId: 'pulseras', price: '140', desc: 'Perlas de agua dulce con cierre dorado ajustable.',            image: '' },
  { id: '6', name: 'Anillo Sakura',      categoryId: 'joyeria',  price: '110', desc: 'Diseno floral delicado, ajustable y antialergico.',            image: '' },
]

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function StoreProvider({ children }) {
  const [categories, setCategories] = useState(() => load('sk_categories', DEFAULT_CATEGORIES))
  const [products,   setProducts]   = useState(() => load('sk_products',   DEFAULT_PRODUCTS))

  useEffect(() => { save('sk_categories', categories) }, [categories])
  useEffect(() => { save('sk_products',   products)   }, [products])

  // --- CATEGORIES ---
  function addCategory(name, jp) {
    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (categories.find(c => c.id === id)) return { error: 'Ya existe una categoria con ese nombre' }
    const cat = { id, name, jp: jp || name }
    setCategories(prev => [...prev, cat])
    return { ok: true }
  }

  function deleteCategory(id) {
    setCategories(prev => prev.filter(c => c.id !== id))
    setProducts(prev => prev.filter(p => p.categoryId !== id))
  }

  // --- PRODUCTS ---
  function addProduct(data) {
    const product = { ...data, id: Date.now().toString() }
    setProducts(prev => [...prev, product])
    return product
  }

  function updateProduct(id, data) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  function deleteProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <StoreContext.Provider value={{
      categories, addCategory, deleteCategory,
      products, addProduct, updateProduct, deleteProduct,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
