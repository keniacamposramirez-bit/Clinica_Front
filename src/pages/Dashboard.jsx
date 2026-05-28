import React from 'react';
import { useApi } from '../hooks/useApi';
import { pacienteService, citaService, doctorService } from '../services/api';
import { StatCard, Card, Badge, Spinner } from '../components/ui/UI';
import { Users, CalendarDays, UserCog, Activity, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './Dashboard.module.css';

const ESTADO_COLOR = { 1: 'warning', 2: 'success', 3: 'danger', 4: 'default' };

export default function Dashboard() {
  const { data: pacientes, loading: lp } = useApi(pacienteService.getAll);
  const { data: citas,     loading: lc } = useApi(citaService.getAll, { per_page: 8 });
  const { data: doctores,  loading: ld } = useApi(doctorService.getAll);

  const listPacientes = Array.isArray(pacientes) ? pacientes : (pacientes?.data ?? []);
  const listCitas     = Array.isArray(citas)     ? citas     : (citas?.data ?? []);
  const listDoctores  = Array.isArray(doctores)  ? doctores  : (doctores?.data ?? []);

  const today = format(new Date(), "EEEE d 'de' MMMM yyyy", { locale: es });

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.date}>{today}</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <StatCard label="Pacientes"  value={lp ? '…' : listPacientes.length} icon={<Users size={20}/>}      color="primary" />
        <StatCard label="Citas hoy"  value={lc ? '…' : listCitas.length}     icon={<CalendarDays size={20}/>} color="teal"    />
        <StatCard label="Doctores"   value={ld ? '…' : listDoctores.length}  icon={<UserCog size={20}/>}    color="success" />
        <StatCard label="Sistema"    value="Activo"                           icon={<Activity size={20}/>}   color="warning" />
      </div>

      <div className={styles.grid}>
        {/* Recent citas */}
        <Card className={styles.citasCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}><CalendarDays size={16}/> Citas recientes</h2>
          </div>
          {lc ? (
            <div className={styles.loading}><Spinner /></div>
          ) : listCitas.length === 0 ? (
            <p className={styles.empty}>No hay citas registradas</p>
          ) : (
            <div className={styles.citasList}>
              {listCitas.map((c) => (
                <div key={c.id} className={styles.citaRow}>
                  <div className={styles.citaTime}>
                    <Clock size={13}/>
                    {c.fecha_hora ? format(new Date(c.fecha_hora), 'dd/MM HH:mm') : '—'}
                  </div>
                  <div className={styles.citaInfo}>
                    <span className={styles.citaPaciente}>
                      {c.paciente ? `${c.paciente.nombre} ${c.paciente.apellido}` : `Paciente #${c.id_paciente}`}
                    </span>
                    <span className={styles.citaDoctor}>
                      {c.doctor ? `Dr. ${c.doctor.nombre}` : `Dr. #${c.id_doctor}`}
                    </span>
                  </div>
                  <Badge color={ESTADO_COLOR[c.id_estado_cita] || 'default'} dot>
                    {c.estado_cita?.nombre || 'Pendiente'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Doctors */}
        <Card className={styles.doctoresCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}><UserCog size={16}/> Doctores activos</h2>
          </div>
          {ld ? (
            <div className={styles.loading}><Spinner /></div>
          ) : listDoctores.length === 0 ? (
            <p className={styles.empty}>No hay doctores registrados</p>
          ) : (
            <div className={styles.doctoresList}>
              {listDoctores.slice(0, 6).map((d) => (
                <div key={d.id} className={styles.doctorRow}>
                  <div className={styles.doctorAvatar}>
                    {d.nombre?.[0]?.toUpperCase()}{d.apellido?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className={styles.doctorName}>Dr. {d.nombre} {d.apellido}</p>
                    <p className={styles.doctorSpec}>{d.especialidad?.nombre || 'Especialidad'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
