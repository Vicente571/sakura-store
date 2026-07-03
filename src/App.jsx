import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import CatalogPage from './pages/CatalogPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'

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
          </Routes>
        </AuthProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
