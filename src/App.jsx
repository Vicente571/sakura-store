import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import CatalogPage from './pages/CatalogPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'

const GalaxyViewPage = lazy(() => import('./pages/GalaxyViewPage'))
const GalaxyEditorPage = lazy(() => import('./pages/GalaxyEditorPage'))

function AdminRoute() {
  const { authed } = useAuth()
  return authed ? <AdminPage /> : <LoginPage />
}

function GalaxyEditorRoute() {
  const { authed } = useAuth()
  return authed ? <GalaxyEditorPage /> : <LoginPage />
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AuthProvider>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/admin" element={<AdminRoute />} />
              <Route path="/mi-universo" element={<GalaxyViewPage />} />
              <Route path="/mi-universo/editar" element={<GalaxyEditorRoute />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
