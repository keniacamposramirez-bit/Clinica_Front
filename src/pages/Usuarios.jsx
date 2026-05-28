import React, { useState, useCallback } from 'react';
import { useApi, useAsyncAction } from '../hooks/useApi';
import { userService, roleService } from '../services/api';
import {
  SectionHeader, Button, Table, Badge, Modal,
  FormField, Input, Select, Alert, SearchInput,
} from '../components/ui/UI';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import styles from './Page.module.css';

const EMPTY = { nickname:'', email:'', password:'', id_rol:'' };

export default function UsuariosPage() {
  const { data: raw, loading, refetch } = useApi(userService.getAll);
  const { data: roles }                 = useApi(roleService.getAll);

  const users    = Array.isArray(raw)   ? raw   : (raw?.data ?? []);
  const listRoles = Array.isArray(roles) ? roles : (roles?.data ?? []);

  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(EMPTY);

  const { loading: saving, error: saveError, execute } = useAsyncAction();
  const { execute: execDelete } = useAsyncAction();

  const filtered = users.filter((u) =>
    `${u.nickname} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY); setModal('create'); };
  const openEdit   = (u)  => { setSelected(u); setForm({ ...EMPTY, ...u, password:'' }); setModal('edit'); };
  const openView   = (u)  => { setSelected(u); setModal('view'); };
  const openDelete = (u)  => { setSelected(u); setModal('delete'); };
  const close      = ()   => { setModal(null); setSelected(null); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    await execute(async () => {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (modal === 'create') await userService.create(payload);
      else await userService.update(selected.id, payload);
    });
    refetch(); close();
  }, [modal, form, selected, execute, refetch]);

  const columns = [
    { key: 'avatar',   label: '', width:50, render: (r) => (
      <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#14b8a6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, color:'#fff' }}>
        {r.nickname?.[0]?.toUpperCase()}
      </div>
    )},
    { key: 'nickname', label: 'Usuario' },
    { key: 'email',    label: 'Email' },
    { key: 'role',     label: 'Rol', render: (r) => r.role?.name || r.rol?.nombre || `#${r.id_rol}` },
    { key: 'verified', label: 'Verificado', render: (r) => <Badge color={r.email_verified_at ? 'success' : 'warning'} dot>{r.email_verified_at ? 'Sí' : 'No'}</Badge> },
    { key: 'actions',  label: '', width:120, render: (r) => (
      <div className={styles.rowActions}>
        <button className={styles.actionBtn} onClick={(e)=>{ e.stopPropagation(); openView(r); }}><Eye size={14}/></button>
        <button className={styles.actionBtn} onClick={(e)=>{ e.stopPropagation(); openEdit(r); }}><Pencil size={14}/></button>
        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={(e)=>{ e.stopPropagation(); openDelete(r); }}><Trash2 size={14}/></button>
      </div>
    )},
  ];

  return (
    <div className={styles.root}>
      <SectionHeader title="Usuarios" subtitle={`${filtered.length} registro(s)`}
        actions={<><SearchInput value={search} onChange={setSearch} placeholder="Buscar usuario…"/><Button icon={<Plus size={15}/>} onClick={openCreate}>Nuevo</Button></>} />
      <Table columns={columns} data={filtered} loading={loading} emptyMessage="No hay usuarios registrados" />

      <Modal open={modal==='create'||modal==='edit'} onClose={close} title={modal==='create'?'Nuevo Usuario':'Editar Usuario'} size="md">
        <form onSubmit={handleSave} className={styles.form}>
          <Alert type="error" message={saveError} />
          <div className={styles.grid2}>
            <FormField label="Nombre de usuario" required><Input value={form.nickname} onChange={set('nickname')} required /></FormField>
            <FormField label="Email" required><Input type="email" value={form.email} onChange={set('email')} required /></FormField>
            <FormField label={modal==='create'?'Contraseña':'Nueva contraseña (opcional)'}>
              <Input type="password" value={form.password} onChange={set('password')} placeholder={modal==='edit'?'Dejar en blanco para no cambiar':''} />
            </FormField>
            <FormField label="Rol">
              <Select value={form.id_rol} onChange={set('id_rol')}>
                <option value="">Seleccionar…</option>
                {listRoles.map((r)=><option key={r.id} value={r.id}>{r.name || r.nombre}</option>)}
              </Select>
            </FormField>
          </div>
          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button type="submit" loading={saving}>{modal==='create'?'Guardar':'Actualizar'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal==='view'} onClose={close} title="Detalle del Usuario" size="sm">
        {selected && (
          <div className={styles.detailGrid}>
            {[
              ['Usuario', selected.nickname],
              ['Email',   selected.email],
              ['Rol',     selected.role?.name || selected.rol?.nombre || `#${selected.id_rol}`],
              ['Verificado', selected.email_verified_at ? 'Sí' : 'No'],
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
        <p className={styles.deleteText}>¿Deseas eliminar al usuario <strong>{selected?.nickname}</strong>?</p>
        <div className={styles.modalFooter}>
          <Button variant="secondary" onClick={close}>Cancelar</Button>
          <Button variant="danger" onClick={async()=>{ await execDelete(()=>userService.delete(selected.id)); refetch(); close(); }}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}
