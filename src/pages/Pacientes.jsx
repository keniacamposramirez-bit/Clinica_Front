import React, { useState, useCallback } from 'react';
import { useApi, useAsyncAction } from '../hooks/useApi';
import { pacienteService, catalogoService } from '../services/api';
import {
  SectionHeader, Button, Table, Badge, Modal,
  FormField, Input, Select, Alert, SearchInput,
} from '../components/ui/UI';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import styles from './Page.module.css';

const EMPTY = {
  nombre: '', apellido: '', dui: '', id_genero: '',
  id_grupo_sanguineo: '', fecha_nacimiento: '',
  alergias: '', medicamentos_permanentes: '',
};

export default function PacientesPage() {
  const { data: raw, loading, refetch } = useApi(pacienteService.getAll);
  const { data: generos }  = useApi(catalogoService.generos);
  const { data: grupos }   = useApi(catalogoService.gruposSanguineos);

  const pacientes = Array.isArray(raw) ? raw : (raw?.data ?? []);

  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(null); // null | 'create' | 'edit' | 'view' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(EMPTY);

  const { loading: saving, error: saveError, execute } = useAsyncAction();
  const { loading: deleting, execute: execDelete }     = useAsyncAction();

  const filtered = pacientes.filter((p) =>
    `${p.nombre} ${p.apellido} ${p.dui}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (p)  => { setSelected(p); setForm({ ...EMPTY, ...p }); setModal('edit'); };
  const openView   = (p)  => { setSelected(p); setModal('view'); };
  const openDelete = (p)  => { setSelected(p); setModal('delete'); };
  const close      = ()   => { setModal(null); setSelected(null); };

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    await execute(async () => {
      if (modal === 'create') await pacienteService.create(form);
      else await pacienteService.update(selected.id, form);
    });
    refetch();
    close();
  }, [modal, form, selected, execute, refetch]);

  const handleDelete = useCallback(async () => {
    await execDelete(() => pacienteService.delete(selected.id));
    refetch();
    close();
  }, [selected, execDelete, refetch]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const columns = [
    { key: 'nombre',   label: 'Nombre',   render: (r) => `${r.nombre} ${r.apellido}` },
    { key: 'dui',      label: 'DUI' },
    { key: 'genero',   label: 'Género',   render: (r) => r.genero?.nombre || '—' },
    { key: 'gs',       label: 'Grupo S.', render: (r) => r.grupo_sanguineo?.nombre || '—' },
    { key: 'estado',   label: 'Estado',   render: (r) => <Badge color={r.estado ? 'success' : 'danger'} dot>{r.estado ? 'Activo' : 'Inactivo'}</Badge> },
    { key: 'actions',  label: '',         width: 120, render: (r) => (
      <div className={styles.rowActions}>
        <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); openView(r); }} title="Ver"><Eye size={14}/></button>
        <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); openEdit(r); }} title="Editar"><Pencil size={14}/></button>
        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={(e) => { e.stopPropagation(); openDelete(r); }} title="Eliminar"><Trash2 size={14}/></button>
      </div>
    )},
  ];

  return (
    <div className={styles.root}>
      <SectionHeader
        title="Pacientes"
        subtitle={`${filtered.length} registro(s)`}
        actions={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar paciente…" />
            <Button icon={<Plus size={15}/>} onClick={openCreate}>Nuevo</Button>
          </>
        }
      />

      <Table columns={columns} data={filtered} loading={loading} emptyMessage="No se encontraron pacientes" />

      {/* Create / Edit modal */}
      <Modal open={modal === 'create' || modal === 'edit'} onClose={close}
        title={modal === 'create' ? 'Nuevo Paciente' : 'Editar Paciente'} size="lg">
        <form onSubmit={handleSave} className={styles.form}>
          <Alert type="error" message={saveError} />
          <div className={styles.grid2}>
            <FormField label="Nombre" required><Input value={form.nombre} onChange={set('nombre')} required /></FormField>
            <FormField label="Apellido" required><Input value={form.apellido} onChange={set('apellido')} required /></FormField>
            <FormField label="DUI"><Input value={form.dui} onChange={set('dui')} placeholder="########-#" /></FormField>
            <FormField label="Fecha de nacimiento"><Input type="date" value={form.fecha_nacimiento} onChange={set('fecha_nacimiento')} /></FormField>
            <FormField label="Género">
              <Select value={form.id_genero} onChange={set('id_genero')}>
                <option value="">Seleccionar…</option>
                {(Array.isArray(generos) ? generos : []).map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </Select>
            </FormField>
            <FormField label="Grupo Sanguíneo">
              <Select value={form.id_grupo_sanguineo} onChange={set('id_grupo_sanguineo')}>
                <option value="">Seleccionar…</option>
                {(Array.isArray(grupos) ? grupos : []).map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </Select>
            </FormField>
          </div>
          <FormField label="Alergias"><Input value={form.alergias} onChange={set('alergias')} placeholder="Ninguna conocida" /></FormField>
          <FormField label="Medicamentos permanentes"><Input value={form.medicamentos_permanentes} onChange={set('medicamentos_permanentes')} /></FormField>
          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button type="submit" loading={saving}>{modal === 'create' ? 'Guardar' : 'Actualizar'}</Button>
          </div>
        </form>
      </Modal>

      {/* View modal */}
      <Modal open={modal === 'view'} onClose={close} title="Detalle del Paciente" size="md">
        {selected && (
          <div className={styles.detailGrid}>
            {[
              ['Nombre completo', `${selected.nombre} ${selected.apellido}`],
              ['DUI', selected.dui || '—'],
              ['Género', selected.genero?.nombre || '—'],
              ['Grupo sanguíneo', selected.grupo_sanguineo?.nombre || '—'],
              ['Fecha nacimiento', selected.fecha_nacimiento || '—'],
              ['Alergias', selected.alergias || 'Ninguna'],
              ['Medicamentos permanentes', selected.medicamentos_permanentes || 'Ninguno'],
              ['Estado', selected.estado ? 'Activo' : 'Inactivo'],
            ].map(([label, value]) => (
              <div key={label} className={styles.detailField}>
                <span className={styles.detailLabel}>{label}</span>
                <span className={styles.detailValue}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal open={modal === 'delete'} onClose={close} title="Confirmar eliminación" size="sm">
        <p className={styles.deleteText}>
          ¿Deseas eliminar al paciente <strong>{selected?.nombre} {selected?.apellido}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className={styles.modalFooter}>
          <Button variant="secondary" onClick={close}>Cancelar</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}
