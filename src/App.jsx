import { useState } from 'react'
import Login from './components/Login'
import Pacientes from './components/Pacientes'
import Doctores from './components/Doctores'
import Medicamentos from './components/Medicamentos'
import Citas from './components/Citas'
import { initialPacientes, initialDoctores, initialMedicamentos, initialCitas } from './data/store'
import './App.css'

const ALL_TABS = [
  { id: 'pacientes',    label: 'Pacientes',    icon: '👤', roles: ['admin', 'doctor', 'recep'] },
  { id: 'doctores',     label: 'Doctores',     icon: '🩺', roles: ['admin'] },
  { id: 'medicamentos', label: 'Medicamentos', icon: '💊', roles: ['admin'] },
  { id: 'citas',        label: 'Citas',        icon: '📅', roles: ['admin', 'doctor', 'recep'] },
]

export default function App() {
  const [session, setSession] = useState(null)
  const [activeTab, setActiveTab] = useState('pacientes')
  const [pacientes, setPacientes] = useState(initialPacientes)
  const [doctores, setDoctores] = useState(initialDoctores)
  const [medicamentos, setMedicamentos] = useState(initialMedicamentos)
  const [citas, setCitas] = useState(initialCitas)

  function handleLogin(user) {
    setSession(user)
    const tabs = ALL_TABS.filter(t => t.roles.includes(user.role))
    setActiveTab(tabs[0].id)
  }

  function handleLogout() {
    setSession(null)
    setActiveTab('pacientes')
  }

  if (!session) return <Login onLogin={handleLogin} />

  const tabs = ALL_TABS.filter(t => t.roles.includes(session.role))
  const alertas = medicamentos.filter(m => m.stock === 0 || m.stock < m.min).length

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">✚</div>
          <div>
            <div className="brand-name">MediCare</div>
            <div className="brand-sub">Sistema de Salud</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
              {tab.id === 'medicamentos' && alertas > 0 && (
                <span className="nav-badge">{alertas}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{session.icon}</div>
            <div>
              <div className="user-name">{session.label}</div>
              <div className="user-role">{session.role === 'admin' ? 'Administrador' : session.role === 'doctor' ? 'Médico' : 'Recepcionista'}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">
              {tabs.find(t => t.id === activeTab)?.icon}{' '}
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <span className="page-date">
              {new Date().toLocaleDateString('es-SV', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>
        <div className="content">
          {activeTab === 'pacientes'    && <Pacientes    data={pacientes}    setData={setPacientes} />}
          {activeTab === 'doctores'     && <Doctores     data={doctores}     setData={setDoctores} />}
          {activeTab === 'medicamentos' && <Medicamentos data={medicamentos} setData={setMedicamentos} />}
          {activeTab === 'citas'        && <Citas        data={citas}        setData={setCitas} pacientes={pacientes} doctores={doctores} />}
        </div>
      </main>
    </div>
  )
}
