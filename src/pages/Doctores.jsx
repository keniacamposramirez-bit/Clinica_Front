import React, { useState, useCallback } from 'react';
import { useApi, useAsyncAction } from '../hooks/useApi';
import { doctorService, catalogoService } from '../services/api';
import {
  SectionHeader, Button, Table, Badge, Modal,
  FormField, Input, Select, Alert, SearchInput,
} from '../components/ui/UI';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import styles from './Page.module.css';

const EMPTY = { nombre:'', apellido:'', id_especialidad:'', num_registro:'', foto:'', estado: true };

export default function DoctoresPage() {
  const { data: raw, loading, refetch } = useApi(doctorService.getAll);
  const { data: especialidades }        = useApi(catalogoService.especialidades);

  const doctores    = Array.isArray(raw) ? raw : (raw?.data ?? []);
  const listEsp     = Array.isArray(especialidades) ? especialidades : [];

  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(EMPTY);

  const { loading: saving, error: saveError, execute } = useAsyncAction();
  const { execute: execDelete } = useAsyncAction();

  const filtered = doctores.filter((d) =>
    `${d.nombre} ${d.apellido} ${d.num_registro}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (d)  => { setSelected(d); setForm({ ...EMPTY, ...d }); setModal('edit'); };
  const openView   = (d)  => { setSelected(d); setModal('view'); };
  const openDelete = (d)  => { setSelected(d); setModal('delete'); };
  const close      = ()   => { setModal(null); setSelected(null); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    await execute(async () => {
      if (modal === 'create') await doctorService.create(form);
      else await doctorService.update(selected.id, form);
    });
    refetch(); close();
  }, [modal, form, selected, execute, refetch]);

  const handleDelete = useCallback(async () => {
    await execDelete(() => doctorService.delete(selected.id));
    refetch(); close();
  }, [selected, execDelete, refetch]);

  const columns = [
    { key: 'avatar',    label: '', width: 50, render: (r) => (
      <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#14b8a6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, color:'#fff' }}>
        {r.nombre?.[0]}{r.apellido?.[0]}
      </div>
    )},
    { key: 'nombre',       label: 'Nombre',       render: (r) => `Dr. ${r.nombre} ${r.apellido}` },
    { key: 'especialidad', label: 'Especialidad',  render: (r) => r.especialidad?.nombre || '—' },
    { key: 'num_registro', label: 'Nº Registro' },
    { key: 'estado',       label: 'Estado', render: (r) => <Badge color={r.estado ? 'success' : 'danger'} dot>{r.estado ? 'Activo' : 'Inactivo'}</Badge> },
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
      <SectionHeader title="Doctores" subtitle={`${filtered.length} registro(s)`}
        actions={<><SearchInput value={search} onChange={setSearch} placeholder="Buscar doctor…"/><Button icon={<Plus size={15}/>} onClick={openCreate}>Nuevo</Button></>} />
      <Table columns={columns} data={filtered} loading={loading} emptyMessage="No hay doctores registrados" />

      <Modal open={modal==='create'||modal==='edit'} onClose={close} title={modal==='create'?'Nuevo Doctor':'Editar Doctor'} size="md">
        <form onSubmit={handleSave} className={styles.form}>
          <Alert type="error" message={saveError} />
          <div className={styles.grid2}>
            <FormField label="Nombre" required><Input value={form.nombre} onChange={set('nombre')} required /></FormField>
            <FormField label="Apellido" required><Input value={form.apellido} onChange={set('apellido')} required /></FormField>
            <FormField label="Especialidad">
              <Select value={form.id_especialidad} onChange={set('id_especialidad')}>
                <option value="">Seleccionar…</option>
                {listEsp.map((e)=><option key={e.id} value={e.id}>{e.nombre}</option>)}
              </Select>
            </FormField>
            <FormField label="Nº de registro"><Input value={form.num_registro} onChange={set('num_registro')} /></FormField>
          </div>
          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button type="submit" loading={saving}>{modal==='create'?'Guardar':'Actualizar'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal==='view'} onClose={close} title="Detalle del Doctor" size="sm">
        {selected && (
          <div className={styles.detailGrid}>
            {[
              ['Nombre',      `Dr. ${selected.nombre} ${selected.apellido}`],
              ['Especialidad', selected.especialidad?.nombre || '—'],
              ['Nº Registro',  selected.num_registro || '—'],
              ['Estado',       selected.estado ? 'Activo' : 'Inactivo'],
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
        <p className={styles.deleteText}>¿Deseas eliminar al doctor <strong>Dr. {selected?.nombre} {selected?.apellido}</strong>?</p>
        <div className={styles.modalFooter}>
          <Button variant="secondary" onClick={close}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}
