import { useState } from 'react'
import api from '../api/axios'

const ROLES = [
  { id: 'admin',  icon: '', label: 'Admin',         desc: 'Acceso total al sistema' },
  { id: 'doctor', icon: '', label: 'Doctor',         desc: 'Pacientes y citas' },
  { id: 'recep',  icon: '', label: 'Recepcionista', desc: 'Agenda y registro' },
]

export default function Login({ onLogin }) {
  const [role, setRole]       = useState('admin')
  const [user, setUser]       = useState('')
  const [pass, setPass]       = useState('')
  const [error, setError]     = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError(false)
    try {
      const response = await api.post('/auth/login', {
        email: user,
        password: pass,
      })

      const { token, user: userData } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))

      const rolLabel = ROLES.find(r => r.id === userData.rol) || { label: userData.rol, icon: '👤' }
      onLogin({ role: userData.rol, label: rolLabel.label, icon: rolLabel.icon, user: userData })

    } catch (e) {
      setError(true)
      setPass('')
    } finally {
      setLoading(false)
    }
  }

  function changeRole(r) {
    setRole(r)
    setError(false)
  }

  return (
    <div className="login-wrap">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">✚</div>
          <div>
            <div className="login-brand-name">MediCare</div>
            <div className="login-brand-sub">Sistema de Salud</div>
          </div>
        </div>
        <div className="login-left-body">
          <h1 className="login-left-title">Gestión clínica integral</h1>
          <p className="login-left-desc">Atendiendo las 24hrs.</p>
        </div>
        <div className="login-roles-list">
          {ROLES.map(r => (
            <div
              key={r.id}
              className={`login-role-chip ${role === r.id ? 'active' : ''}`}
              onClick={() => changeRole(r.id)}
            >
              <div className="login-role-chip-icon">{r.icon}</div>
              <div>
                <div className="login-role-chip-name">{r.label}</div>
                <div className="login-role-chip-desc">{r.desc}</div>
              </div>
              <div className="login-role-chip-check">✓</div>
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <h2 className="login-form-title">Iniciar sesión</h2>
        <p className="login-form-sub">Selecciona tu rol e ingresa tus credenciales</p>

        <div className="login-role-btns">
          {ROLES.map(r => (
            <button
              key={r.id}
              className={`login-role-btn ${role === r.id ? 'active' : ''}`}
              onClick={() => changeRole(r.id)}
            >
              <div className="login-role-btn-icon">{r.icon}</div>
              <div className="login-role-btn-label">{r.label}</div>
            </button>
          ))}
        </div>

        <div className="login-field">
          <label className="login-label">Correo</label>
          <div className="login-input-wrap">
            <span className="login-input-icon">👤</span>
            <input
              className="login-input"
              type="email"
              placeholder="usuario@medicare.sv"
              value={user}
              onChange={e => { setUser(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        <div className="login-field">
          <label className="login-label">Contraseña</label>
          <div className="login-input-wrap">
            <span className="login-input-icon"></span>
            <input
              className="login-input"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={pass}
              onChange={e => { setPass(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button className="login-eye" onClick={() => setShowPass(!showPass)}>
              {showPass ? '' : ''}
            </button>
          </div>
        </div>

        {error && (
          <div className="login-error">Correo o contraseña incorrectos. Intenta de nuevo.</div>
        )}

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar al sistema'}
        </button>

        <div className="login-divider">credenciales de prueba</div>
        <div className="login-creds">
          <div className="login-creds-title">Usuarios de demostración</div>
          <div className="login-cred-row">
            <span className="login-cred-role"> Admin</span>
            <span><code>boqcel@gmail.com</code> / <code>password123</code></span>
          </div>
          <div className="login-cred-row">
            <span className="login-cred-role"> Doctor</span>
            <span><code>doctor@clinica.com</code> / <code>password123</code></span>
          </div>
        </div>
      </div>
    </div>
  )
}