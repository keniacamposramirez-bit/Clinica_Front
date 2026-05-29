// IMPORTACIONES
import { useState } from 'react'

// COMPONENTE DE LOGIN
import Login from './components/Login'

// MÓDULOS DE MANTENIMIENTO
import Pacientes from './components/mantenimiento/Pacientes'
import Doctores from './components/mantenimiento/Doctores'
import Medicamentos from './components//Medicamentos'
import Citas from './components/mantenimiento/Citas'
import Expedientes from './components/mantenimiento/Expedientes'
import Diagnosticos from './components/mantenimiento/Diagnosticos'
import Recetas from './components/mantenimiento/Recetas'

// MÓDULOS DE CATÁLOGOS
import Tratamientos from './components/catalogos/Tratamientos'

// DATOS LOCALES (UTILIZADOS PARA PRUEBAS)
import {
  initialPacientes,
  initialDoctores,
  initialMedicamentos,
  initialCitas
} from './data/store'

// ESTILOS GENERALES
import './App.css'

// CONFIGURACIÓN DE MENÚS Y PERMISOS
const ALL_TABS = [
  { id: 'pacientes', label: 'Pacientes', icon: '👤', roles: ['admin', 'doctor', 'recep'] },
  { id: 'doctores', label: 'Doctores', icon: '🩺', roles: ['admin'] },
  { id: 'medicamentos', label: 'Medicamentos', icon: '💊', roles: ['admin'] },
  { id: 'citas', label: 'Citas', icon: '📅', roles: ['admin', 'doctor', 'recep'] },
  { id: 'tratamientos', label: 'Tratamientos', icon: '🧾', roles: ['admin'] },
  { id: 'expedientes', label: 'Expedientes', icon: '📁', roles: ['admin', 'doctor'] },
  { id: 'diagnosticos', label: 'Diagnósticos', icon: '🩻', roles: ['admin', 'doctor'] },
  { id: 'recetas', label: 'Recetas', icon: '📄', roles: ['admin', 'doctor'] },
]

// COMPONENTE PRINCIPAL DE LA APLICACIÓN
export default function App() {

  // SESIÓN DEL USUARIO AUTENTICADO
  const [session, setSession] = useState(null)

  // PESTAÑA ACTIVA DEL MENÚ
  const [activeTab, setActiveTab] = useState('pacientes')

  // DATOS LOCALES PARA PRUEBAS
  const [pacientes, setPacientes] = useState(initialPacientes)
  const [doctores, setDoctores] = useState(initialDoctores)
  const [medicamentos, setMedicamentos] = useState(initialMedicamentos)
  const [citas, setCitas] = useState(initialCitas)

  // INICIAR SESIÓN
  function handleLogin(user) {

    setSession(user)

    const tabs =
      ALL_TABS.filter(tab =>
        tab.roles.includes(user.role)
      )

    setActiveTab(tabs[0].id)
  }

  // CERRAR SESIÓN
  function handleLogout() {

    setSession(null)
    setActiveTab('pacientes')
  }

  // SI NO EXISTE SESIÓN SE MUESTRA LOGIN
  if (!session) {
    return <Login onLogin={handleLogin} />
  }

  // MENÚS DISPONIBLES SEGÚN EL ROL
  const tabs =
    ALL_TABS.filter(tab =>
      tab.roles.includes(session.role)
    )

  // ALERTAS DE INVENTARIO DE MEDICAMENTOS
  const alertas =
    medicamentos.filter(m =>
      m.stock === 0 || m.stock < m.min
    ).length

  return (

    <div className="app">

      {/*BARRA LATERAL DE NAVEGACIÓN*/}
      <aside className="sidebar">

        {/* LOGO DEL SISTEMA */}
        <div className="sidebar-brand">

          <div className="brand-icon">✚</div>

          <div>
            <div className="brand-name">
              MediCare
            </div>

            <div className="brand-sub">
              Sistema de Salud
            </div>
          </div>

        </div>

        {/* MENÚ PRINCIPAL */}
        <nav className="sidebar-nav">

          {tabs.map(tab => (

            <button
              key={tab.id}
              className={`nav-item ${
                activeTab === tab.id
                  ? 'active'
                  : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >

              <span className="nav-icon">
                {tab.icon}
              </span>

              <span className="nav-label">
                {tab.label}
              </span>

              {/* ALERTA DE MEDICAMENTOS */}
              {tab.id === 'medicamentos' &&
                alertas > 0 && (
                  <span className="nav-badge">
                    {alertas}
                  </span>
              )}

            </button>

          ))}

        </nav>

        {/* INFORMACIÓN DEL USUARIO */}
        <div className="sidebar-footer">

          <div className="user-card">

            <div className="user-avatar">
              {session.icon}
            </div>

            <div>

              <div className="user-name">
                {session.label}
              </div>

              <div className="user-role">

                {session.role === 'admin'
                  ? 'Administrador'
                  : session.role === 'doctor'
                  ? 'Médico'
                  : 'Recepcionista'}

              </div>

            </div>

          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>

        </div>

      </aside>

      {/*CONTENIDO PRINCIPAL*/}
      <main className="main">

        {/* CABECERA */}
        <header className="topbar">

          <div className="topbar-left">

            <h1 className="page-title">

              {tabs.find(
                t => t.id === activeTab
              )?.icon}

              {' '}

              {tabs.find(
                t => t.id === activeTab
              )?.label}

            </h1>

            <span className="page-date">

              {new Date().toLocaleDateString(
                'es-SV',
                {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }
              )}

            </span>

          </div>

        </header>

        {/* ÁREA DE CONTENIDO DINÁMICO */}
        <div className="content">

          {activeTab === 'pacientes' &&
            <Pacientes
              data={pacientes}
              setData={setPacientes}
            />
          }

          {activeTab === 'doctores' &&
            <Doctores
              data={doctores}
              setData={setDoctores}
            />
          }

          {activeTab === 'medicamentos' &&
            <Medicamentos
              data={medicamentos}
              setData={setMedicamentos}
            />
          }

          {activeTab === 'citas' &&
            <Citas
              data={citas}
              setData={setCitas}
              pacientes={pacientes}
              doctores={doctores}
            />
          }

          {activeTab === 'tratamientos' &&
            <Tratamientos />
          }

          {activeTab === 'expedientes' &&
            <Expedientes />
          }

          {activeTab === 'diagnosticos' &&
            <Diagnosticos />
          }

          {activeTab === 'recetas' &&
            <Recetas />
          }

        </div>

      </main>

    </div>
  )
}