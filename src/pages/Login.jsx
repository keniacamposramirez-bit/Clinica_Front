import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff } from 'lucide-react';
import styles from './Login.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      {/* Background grid */}
      <div className={styles.grid} />
      <div className={styles.glow} />

      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}><Activity size={22} /></div>
          <span className={styles.logoText}>ClinicApp</span>
        </div>

        <h1 className={styles.title}>Bienvenido de vuelta</h1>
        <p className={styles.subtitle}>Ingresa tus credenciales para continuar</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="usuario@clinica.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label>Contraseña</label>
            <div className={styles.pwdWrap}>
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd((p) => !p)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Iniciar sesión'}
          </button>
        </form>

        <p className={styles.hint}>
          Asegúrate de que el backend esté corriendo en{' '}
          <code>{process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}</code>
        </p>
      </div>
    </div>
  );
}
