import React, { useState, useCallback } from 'react';
import { useApi, useAsyncAction } from '../hooks/useApi';
import { citaService, pacienteService, doctorService, catalogoService } from '../services/api';
import {
  SectionHeader, Button, Table, Badge, Modal,
  FormField, Input, Select, Textarea, Alert, SearchInput,
} from '../components/ui/UI';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import styles from './Page.module.css';

const ESTADO_COLOR = { 1: 'warning', 2: 'success', 3: 'danger', 4: 'default' };
const EMPTY = { id_paciente: '', id_doctor: '', id_estado_cita: '', fecha_hora: '', duracion_min: 30, motivo: '', notas: '' };

export default function CitasPage() {
  const { data: raw,       loading, refetch } = useApi(citaService.getAll);
  const { data: pacientes }  = useApi(pacienteService.getAll);
  const { data: doctores }   = useApi(doctorService.getAll);
  const { data: estados }    = useApi(catalogoService.estadosCita);

  const citas = Array.isArray(raw) ? raw : (raw?.data ?? []);
  const listPac = Array.isArray(pacientes) ? pacientes : (pacientes?.data ?? []);
  const listDoc = Array.isArray(doctores)  ? doctores  : (doctores?.data ?? []);
  const listEst = Array.isArray(estados)   ? estados   : [];

  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(EMPTY);

  const { loading: saving, error: saveError, execute } = useAsyncAction();
  const { execute: execDelete } = useAsyncAction();

  const filtered = citas.filter((c) => {
    const pac = c.paciente ? `${c.paciente.nombre} ${c.paciente.apellido}` : '';
    const doc = c.doctor   ? `${c.doctor.nombre} ${c.doctor.apellido}` : '';
    return `${pac} ${doc}`.toLowerCase().includes(search.toLowerCase());
  });

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (c)  => { setSelected(c); setForm({ ...EMPTY, ...c }); setModal('edit'); };
  const openView   = (c)  => { setSelected(c); setModal('view'); };
  const openDelete = (c)  => { setSelected(c); setModal('delete'); };
  const close      = ()   => { setModal(null); setSelected(null); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    await execute(async () => {
      if (modal === 'create') await citaService.create(form);
      else await citaService.update(selected.id, form);
    });
    refetch(); close();
  }, [modal, form, selected, execute, refetch]);

  const handleDelete = useCallback(async () => {
    await execDelete(() => citaService.delete(selected.id));
    refetch(); close();
  }, [selected, execDelete, refetch]);

  const columns = [
    { key: 'fecha_hora', label: 'Fecha / Hora', render: (r) => r.fecha_hora ? format(new Date(r.fecha_hora), 'dd/MM/yyyy HH:mm') : '—' },
    { key: 'paciente',   label: 'Paciente',   render: (r) => r.paciente ? `${r.paciente.nombre} ${r.paciente.apellido}` : `#${r.id_paciente}` },
    { key: 'doctor',     label: 'Doctor',     render: (r) => r.doctor   ? `Dr. ${r.doctor.nombre} ${r.doctor.apellido}` : `#${r.id_doctor}` },
    { key: 'duracion',   label: 'Duración',   render: (r) => `${r.duracion_min ?? 30} min` },
    { key: 'estado',     label: 'Estado',     render: (r) => <Badge color={ESTADO_COLOR[r.id_estado_cita] || 'default'} dot>{r.estado_cita?.nombre || 'Pendiente'}</Badge> },
    { key: 'actions',    label: '', width: 120, render: (r) => (
      <div className={styles.rowActions}>
        <button className={styles.actionBtn} onClick={(e)=>{ e.stopPropagation(); openView(r); }}><Eye size={14}/></button>
        <button className={styles.actionBtn} onClick={(e)=>{ e.stopPropagation(); openEdit(r); }}><Pencil size={14}/></button>
        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={(e)=>{ e.stopPropagation(); openDelete(r); }}><Trash2 size={14}/></button>
      </div>
    )},
  ];

  return (
    <div className={styles.root}>
      <SectionHeader title="Citas" subtitle={`${filtered.length} registro(s)`}
        actions={<><SearchInput value={search} onChange={setSearch} placeholder="Buscar cita…"/><Button icon={<Plus size={15}/>} onClick={openCreate}>Nueva</Button></>} />
      <Table columns={columns} data={filtered} loading={loading} emptyMessage="No hay citas registradas" />

      <Modal open={modal==='create'||modal==='edit'} onClose={close} title={modal==='create'?'Nueva Cita':'Editar Cita'} size="lg">
        <form onSubmit={handleSave} className={styles.form}>
          <Alert type="error" message={saveError} />
          <div className={styles.grid2}>
            <FormField label="Paciente" required>
              <Select value={form.id_paciente} onChange={set('id_paciente')} required>
                <option value="">Seleccionar…</option>
                {listPac.map((p)=><option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
              </Select>
            </FormField>
            <FormField label="Doctor" required>
              <Select value={form.id_doctor} onChange={set('id_doctor')} required>
                <option value="">Seleccionar…</option>
                {listDoc.map((d)=><option key={d.id} value={d.id}>Dr. {d.nombre} {d.apellido}</option>)}
              </Select>
            </FormField>
            <FormField label="Fecha y hora" required><Input type="datetime-local" value={form.fecha_hora} onChange={set('fecha_hora')} required /></FormField>
            <FormField label="Duración (min)"><Input type="number" min="10" value={form.duracion_min} onChange={set('duracion_min')} /></FormField>
            <FormField label="Estado">
              <Select value={form.id_estado_cita} onChange={set('id_estado_cita')}>
                <option value="">Seleccionar…</option>
                {listEst.map((e)=><option key={e.id} value={e.id}>{e.nombre}</option>)}
              </Select>
            </FormField>
            <FormField label="Motivo"><Input value={form.motivo} onChange={set('motivo')} /></FormField>
          </div>
          <FormField label="Notas"><Textarea value={form.notas} onChange={set('notas')} /></FormField>
          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button type="submit" loading={saving}>{modal==='create'?'Guardar':'Actualizar'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal==='view'} onClose={close} title="Detalle de Cita" size="md">
        {selected && (
          <div className={styles.detailGrid}>
            {[
              ['Paciente', selected.paciente ? `${selected.paciente.nombre} ${selected.paciente.apellido}` : `#${selected.id_paciente}`],
              ['Doctor',   selected.doctor   ? `Dr. ${selected.doctor.nombre} ${selected.doctor.apellido}` : `#${selected.id_doctor}`],
              ['Fecha / Hora', selected.fecha_hora ? format(new Date(selected.fecha_hora), 'dd/MM/yyyy HH:mm') : '—'],
              ['Duración', `${selected.duracion_min ?? 30} min`],
              ['Estado',   selected.estado_cita?.nombre || '—'],
              ['Motivo',   selected.motivo || '—'],
              ['Notas',    selected.notas  || '—'],
            ].map(([l,v])=>(
              <div key={l} className={styles.detailField}>
                <span className={styles.detailLabel}>{l}</span>
                <span className={styles.detailValue}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal open={modal==='delete'} onClose={close} title="Confirmar eliminación" size="sm">
        <p className={styles.deleteText}>¿Deseas eliminar esta cita? Esta acción no se puede deshacer.</p>
        <div className={styles.modalFooter}>
          <Button variant="secondary" onClick={close}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}
