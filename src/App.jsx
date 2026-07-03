import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import CatalogPage from './pages/CatalogPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import BirthdayPage from './pages/BirthdayPage'

function AdminRoute() {
  const { authed } = useAuth()
  return authed ? <AdminPage /> : <LoginPage />
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/admin" element={<AdminRoute />} />
            {/* Pantalla privada de cumpleanos: no esta enlazada en ningun
                menu, solo se entra escribiendo la URL directamente.
                Cambia esta ruta por la que quieras en BirthdayPage.jsx
                comentario y aqui, para mayor discrecion. */}
            <Route path="/cumple2026" element={<BirthdayPage />} />
          </Routes>
        </AuthProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
