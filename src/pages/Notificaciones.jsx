import React from 'react';
import { useApi, useAsyncAction } from '../hooks/useApi';
import { notificacionService } from '../services/api';
import { SectionHeader, Button, Card, Badge, Spinner } from '../components/ui/UI';
import { BellRing, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import styles from './Notificaciones.module.css';

const TIPO_COLOR = { info: 'primary', success: 'success', warning: 'warning', error: 'danger' };

export default function NotificacionesPage() {
  const { data: raw, loading, refetch } = useApi(notificacionService.getAll);
  const { execute } = useAsyncAction();

  const notifs = Array.isArray(raw) ? raw : (raw?.data ?? []);
  const noLeidas = notifs.filter((n) => !n.leida).length;

  const marcarTodas = async () => {
    await execute(notificacionService.marcarTodasLeidas);
    refetch();
  };

  const marcarLeida = async (id) => {
    await execute(() => notificacionService.marcarLeida(id));
    refetch();
  };

  return (
    <div>
      <SectionHeader
        title="Notificaciones"
        subtitle={noLeidas > 0 ? `${noLeidas} sin leer` : 'Todo al día'}
        actions={noLeidas > 0 && (
          <Button variant="secondary" icon={<CheckCheck size={15}/>} onClick={marcarTodas}>
            Marcar todas como leídas
          </Button>
        )}
      />

      {loading ? (
        <div className={styles.loading}><Spinner /></div>
      ) : notifs.length === 0 ? (
        <Card className={styles.empty}>
          <BellRing size={32} style={{ opacity:0.3, marginBottom:12 }}/>
          <p>No tienes notificaciones</p>
        </Card>
      ) : (
        <div className={styles.list}>
          {notifs.map((n) => (
            <Card key={n.id} className={`${styles.notif} ${!n.leida ? styles.unread : ''}`} hover>
              <div className={styles.notifContent}>
                <div className={styles.notifHeader}>
                  <Badge color={TIPO_COLOR[n.tipo] || 'default'}>{n.tipo || 'info'}</Badge>
                  {!n.leida && <span className={styles.dot}/>}
                  <span className={styles.time}>
                    {n.created_at ? format(new Date(n.created_at), 'dd/MM/yyyy HH:mm') : ''}
                  </span>
                </div>
                <p className={styles.titulo}>{n.titulo}</p>
                <p className={styles.mensaje}>{n.mensaje}</p>
              </div>
              {!n.leida && (
                <button className={styles.readBtn} onClick={() => marcarLeida(n.id)}>
                  Marcar leída
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
