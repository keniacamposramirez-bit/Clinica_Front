import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import { Spinner } from './components/ui/UI';

// Pages (lazy-loaded for better perf)
import LoginPage          from './pages/Login';
import Dashboard          from './pages/Dashboard';
import PacientesPage      from './pages/Pacientes';
import CitasPage          from './pages/Citas';
import DoctoresPage       from './pages/Doctores';
import ExpedientesPage    from './pages/Expedientes';
import RecetasPage        from './pages/Recetas';
import NotificacionesPage from './pages/Notificaciones';
import UsuariosPage       from './pages/Usuarios';
import ConfiguracionPage  from './pages/Configuracion';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-base)' }}>
      <Spinner size="lg" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={
        <PrivateRoute>
          <Layout>
            <Routes>
              <Route path="/"               element={<Dashboard />} />
              <Route path="/pacientes"      element={<PacientesPage />} />
              <Route path="/citas"          element={<CitasPage />} />
              <Route path="/doctores"       element={<DoctoresPage />} />
              <Route path="/expedientes"    element={<ExpedientesPage />} />
              <Route path="/recetas"        element={<RecetasPage />} />
              <Route path="/notificaciones" element={<NotificacionesPage />} />
              <Route path="/usuarios"       element={<UsuariosPage />} />
              <Route path="/configuracion"  element={<ConfiguracionPage />} />
              <Route path="*"               element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
