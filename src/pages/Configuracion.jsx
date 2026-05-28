import React from 'react';
import { Card, SectionHeader } from '../components/ui/UI';
import { Settings, Server, Key } from 'lucide-react';
import styles from './Configuracion.module.css';

export default function ConfiguracionPage() {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  return (
    <div>
      <SectionHeader title="Configuración" subtitle="Ajustes del sistema" />

      <div className={styles.grid}>
        <Card>
          <div className={styles.section}>
            <div className={styles.sectionIcon}><Server size={18}/></div>
            <div>
              <h3 className={styles.sectionTitle}>Conexión al Backend</h3>
              <p className={styles.sectionDesc}>URL de la API configurada</p>
            </div>
          </div>
          <div className={styles.urlBox}>
            <code>{apiUrl}</code>
          </div>
          <p className={styles.hint}>
            Para cambiar la URL, crea un archivo <code>.env</code> en la raíz del proyecto con:
          </p>
          <div className={styles.codeBlock}>
            <code>REACT_APP_API_URL=http://tu-backend.com/api</code>
          </div>
        </Card>

        <Card>
          <div className={styles.section}>
            <div className={styles.sectionIcon} style={{'--ic':'#14b8a6'}}><Key size={18}/></div>
            <div>
              <h3 className={styles.sectionTitle}>Autenticación</h3>
              <p className={styles.sectionDesc}>Token JWT almacenado en localStorage</p>
            </div>
          </div>
          <p className={styles.hint}>El sistema usa Bearer Token enviado en cada petición al header <code>Authorization</code>.</p>
          <button className={styles.clearBtn} onClick={()=>{ localStorage.removeItem('token'); window.location.href='/login'; }}>
            Cerrar sesión y limpiar token
          </button>
        </Card>

        <Card>
          <div className={styles.section}>
            <div className={styles.sectionIcon} style={{'--ic':'#f59e0b'}}><Settings size={18}/></div>
            <div>
              <h3 className={styles.sectionTitle}>Variables de entorno</h3>
              <p className={styles.sectionDesc}>Archivo <code>.env</code> en la raíz</p>
            </div>
          </div>
          <div className={styles.codeBlock}>
            <code>{`# URL base del backend\nREACT_APP_API_URL=http://localhost:8000/api`}</code>
          </div>
        </Card>
      </div>
    </div>
  );
}
