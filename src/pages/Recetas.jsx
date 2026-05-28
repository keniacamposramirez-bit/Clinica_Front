import React, { useState, useCallback } from 'react';
import { useApi, useAsyncAction } from '../hooks/useApi';
import { recetaService, citaService, doctorService, catalogoService } from '../services/api';
import {
  SectionHeader, Button, Table, Modal,
  FormField, Input, Select, Alert, SearchInput,
} from '../components/ui/UI';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import styles from './Page.module.css';

const EMPTY = { id_cita:'', id_doctor:'', id_medicamento:'', dosis:'', frecuencia:'', duracion:'', indicaciones:'' };

export default function RecetasPage() {
  const { data: raw, loading, refetch } = useApi(recetaService.getAll);
  const { data: citas }        = useApi(citaService.getAll);
  const { data: doctores }     = useApi(doctorService.getAll);
  const { data: medicamentos } = useApi(catalogoService.medicamentos);

  const recetas   = Array.isArray(raw) ? raw : (raw?.data ?? []);
  const listCitas = Array.isArray(citas) ? citas : (citas?.data ?? []);
  const listDoc   = Array.isArray(doctores)     ? doctores     : (doctores?.data ?? []);
  const listMed   = Array.isArray(medicamentos) ? medicamentos : [];

  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(EMPTY);

  const { loading: saving, error: saveError, execute } = useAsyncAction();
  const { execute: execDelete } = useAsyncAction();

  const filtered = recetas.filter((r) =>
    `${r.medicamento?.nombre || ''} ${r.doctor?.nombre || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (r)  => { setSelected(r); setForm({ ...EMPTY, ...r }); setModal('edit'); };
  const openView   = (r)  => { setSelected(r); setModal('view'); };
  const openDelete = (r)  => { setSelected(r); setModal('delete'); };
  const close      = ()   => { setModal(null); setSelected(null); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    await execute(async () => {
      if (modal === 'create') await recetaService.create(form);
      else await recetaService.update(selected.id, form);
    });
    refetch(); close();
  }, [modal, form, selected, execute, refetch]);

  const columns = [
    { key: 'medicamento', label: 'Medicamento', render: (r) => r.medicamento?.nombre || `#${r.id_medicamento}` },
    { key: 'dosis',       label: 'Dosis' },
    { key: 'frecuencia',  label: 'Frecuencia' },
    { key: 'duracion',    label: 'Duración' },
    { key: 'doctor',      label: 'Doctor', render: (r) => r.doctor ? `Dr. ${r.doctor.nombre} ${r.doctor.apellido}` : `#${r.id_doctor}` },
    { key: 'actions', label: '', width: 120, render: (r) => (
      <div className={styles.rowActions}>
        <button className={styles.actionBtn} onClick={(e)=>{ e.stopPropagation(); openView(r); }}><Eye size={14}/></button>
        <button className={styles.actionBtn} onClick={(e)=>{ e.stopPropagation(); openEdit(r); }}><Pencil size={14}/></button>
        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={(e)=>{ e.stopPropagation(); openDelete(r); }}><Trash2 size={14}/></button>
      </div>
    )},
  ];

  return (
    <div className={styles.root}>
      <SectionHeader title="Recetas" subtitle={`${filtered.length} registro(s)`}
        actions={<><SearchInput value={search} onChange={setSearch} placeholder="Buscar receta…"/><Button icon={<Plus size={15}/>} onClick={openCreate}>Nueva</Button></>} />
      <Table columns={columns} data={filtered} loading={loading} emptyMessage="No hay recetas registradas" />

      <Modal open={modal==='create'||modal==='edit'} onClose={close} title={modal==='create'?'Nueva Receta':'Editar Receta'} size="lg">
        <form onSubmit={handleSave} className={styles.form}>
          <Alert type="error" message={saveError} />
          <div className={styles.grid2}>
            <FormField label="Cita">
              <Select value={form.id_cita} onChange={set('id_cita')}>
                <option value="">Seleccionar…</option>
                {listCitas.map((c)=><option key={c.id} value={c.id}>Cita #{c.id}</option>)}
              </Select>
            </FormField>
            <FormField label="Doctor" required>
              <Select value={form.id_doctor} onChange={set('id_doctor')} required>
                <option value="">Seleccionar…</option>
                {listDoc.map((d)=><option key={d.id} value={d.id}>Dr. {d.nombre} {d.apellido}</option>)}
              </Select>
            </FormField>
            <FormField label="Medicamento" required>
              <Select value={form.id_medicamento} onChange={set('id_medicamento')} required>
                <option value="">Seleccionar…</option>
                {listMed.map((m)=><option key={m.id} value={m.id}>{m.nombre}</option>)}
              </Select>
            </FormField>
            <FormField label="Dosis"><Input value={form.dosis} onChange={set('dosis')} placeholder="ej: 500mg" /></FormField>
            <FormField label="Frecuencia"><Input value={form.frecuencia} onChange={set('frecuencia')} placeholder="ej: Cada 8 horas" /></FormField>
            <FormField label="Duración"><Input value={form.duracion} onChange={set('duracion')} placeholder="ej: 7 días" /></FormField>
          </div>
          <FormField label="Indicaciones"><Input value={form.indicaciones} onChange={set('indicaciones')} /></FormField>
          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button type="submit" loading={saving}>{modal==='create'?'Guardar':'Actualizar'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal==='view'} onClose={close} title="Detalle de Receta" size="md">
        {selected && (
          <div className={styles.detailGrid}>
            {[
              ['Medicamento', selected.medicamento?.nombre || `#${selected.id_medicamento}`],
              ['Doctor', selected.doctor ? `Dr. ${selected.doctor.nombre} ${selected.doctor.apellido}` : `#${selected.id_doctor}`],
              ['Dosis', selected.dosis || '—'],
              ['Frecuencia', selected.frecuencia || '—'],
              ['Duración', selected.duracion || '—'],
              ['Indicaciones', selected.indicaciones || '—'],
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
        <p className={styles.deleteText}>¿Deseas eliminar esta receta?</p>
        <div className={styles.modalFooter}>
          <Button variant="secondary" onClick={close}>Cancelar</Button>
          <Button variant="danger" onClick={async()=>{ await execDelete(()=>recetaService.delete(selected.id)); refetch(); close(); }}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}
