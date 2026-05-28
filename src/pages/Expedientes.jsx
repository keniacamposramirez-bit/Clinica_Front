import React, { useState, useCallback } from 'react';
import { useApi, useAsyncAction } from '../hooks/useApi';
import { expedienteService, pacienteService, catalogoService } from '../services/api';
import {
  SectionHeader, Button, Table, Badge, Modal,
  FormField, Input, Select, Textarea, Alert, SearchInput,
} from '../components/ui/UI';
import { Plus, Eye, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import styles from './Page.module.css';

const EMPTY = { id_paciente:'', numero_expediente:'', fecha_apertura:'', antecedentes:'', observaciones:'', estado: true };

export default function ExpedientesPage() {
  const { data: raw, loading, refetch } = useApi(expedienteService.getAll);
  const { data: pacientes } = useApi(pacienteService.getAll);

  const expedientes = Array.isArray(raw) ? raw : (raw?.data ?? []);
  const listPac     = Array.isArray(pacientes) ? pacientes : (pacientes?.data ?? []);

  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(EMPTY);

  const { loading: saving, error: saveError, execute } = useAsyncAction();

  const filtered = expedientes.filter((e) =>
    `${e.numero_expediente} ${e.paciente?.nombre} ${e.paciente?.apellido}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (e)  => { setSelected(e); setForm({ ...EMPTY, ...e }); setModal('edit'); };
  const openView   = (e)  => { setSelected(e); setModal('view'); };
  const close      = ()   => { setModal(null); setSelected(null); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = useCallback(async (ev) => {
    ev.preventDefault();
    await execute(async () => {
      if (modal === 'create') await expedienteService.create(form);
      else await expedienteService.update(selected.id, form);
    });
    refetch(); close();
  }, [modal, form, selected, execute, refetch]);

  const columns = [
    { key: 'numero_expediente', label: 'Nº Expediente' },
    { key: 'paciente', label: 'Paciente', render: (r) => r.paciente ? `${r.paciente.nombre} ${r.paciente.apellido}` : `#${r.id_paciente}` },
    { key: 'fecha_apertura', label: 'Fecha apertura', render: (r) => r.fecha_apertura ? format(new Date(r.fecha_apertura), 'dd/MM/yyyy') : '—' },
    { key: 'estado', label: 'Estado', render: (r) => <Badge color={r.estado ? 'success' : 'danger'} dot>{r.estado ? 'Activo' : 'Cerrado'}</Badge> },
    { key: 'actions', label: '', width: 90, render: (r) => (
      <div className={styles.rowActions}>
        <button className={styles.actionBtn} onClick={(e)=>{ e.stopPropagation(); openView(r); }}><Eye size={14}/></button>
        <button className={styles.actionBtn} onClick={(e)=>{ e.stopPropagation(); openEdit(r); }}><Pencil size={14}/></button>
      </div>
    )},
  ];

  return (
    <div className={styles.root}>
      <SectionHeader title="Expedientes" subtitle={`${filtered.length} registro(s)`}
        actions={<><SearchInput value={search} onChange={setSearch} placeholder="Buscar expediente…"/><Button icon={<Plus size={15}/>} onClick={openCreate}>Nuevo</Button></>} />
      <Table columns={columns} data={filtered} loading={loading} emptyMessage="No hay expedientes registrados" />

      <Modal open={modal==='create'||modal==='edit'} onClose={close} title={modal==='create'?'Nuevo Expediente':'Editar Expediente'} size="lg">
        <form onSubmit={handleSave} className={styles.form}>
          <Alert type="error" message={saveError} />
          <div className={styles.grid2}>
            <FormField label="Paciente" required>
              <Select value={form.id_paciente} onChange={set('id_paciente')} required>
                <option value="">Seleccionar…</option>
                {listPac.map((p)=><option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
              </Select>
            </FormField>
            <FormField label="Nº Expediente"><Input value={form.numero_expediente} onChange={set('numero_expediente')} /></FormField>
            <FormField label="Fecha apertura"><Input type="date" value={form.fecha_apertura} onChange={set('fecha_apertura')} /></FormField>
          </div>
          <FormField label="Antecedentes"><Textarea value={form.antecedentes} onChange={set('antecedentes')} /></FormField>
          <FormField label="Observaciones"><Textarea value={form.observaciones} onChange={set('observaciones')} /></FormField>
          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button type="submit" loading={saving}>{modal==='create'?'Guardar':'Actualizar'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal==='view'} onClose={close} title="Detalle del Expediente" size="md">
        {selected && (
          <div className={styles.detailGrid}>
            {[
              ['Nº Expediente', selected.numero_expediente || '—'],
              ['Paciente', selected.paciente ? `${selected.paciente.nombre} ${selected.paciente.apellido}` : `#${selected.id_paciente}`],
              ['Fecha apertura', selected.fecha_apertura ? format(new Date(selected.fecha_apertura), 'dd/MM/yyyy') : '—'],
              ['Antecedentes', selected.antecedentes || '—'],
              ['Observaciones', selected.observaciones || '—'],
              ['Estado', selected.estado ? 'Activo' : 'Cerrado'],
            ].map(([l,v])=>(
              <div key={l} className={styles.detailField} style={['Antecedentes','Observaciones'].includes(l)?{gridColumn:'1/-1'}:{}}>
                <span className={styles.detailLabel}>{l}</span>
                <span className={styles.detailValue}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
