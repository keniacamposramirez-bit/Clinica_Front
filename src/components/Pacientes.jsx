import { useState, useEffect } from 'react'
import { Avatar, Pill, StatCard, Modal, FormField, SearchBar } from './UI'
import api from '../api/axios'

const statusMap = { 'Activo': 'green', 'En observación': 'amber', 'Alta': 'blue' }

const empty = { nombre:'', apellido:'', dui:'', id_genero:1, id_grupo_sanguineo:1, fecha_nacimiento:'', alergias:'' }

export default function Pacientes() {
  const [data, setData]     = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(empty)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPacientes() }, [])

  async function fetchPacientes() {
    try {
      const res = await api.get('/pacientes')
      setData(res.data.data)
    } catch (e) {
      console.error('Error cargando pacientes', e)
    } finally {
      setLoading(false)
    }
  }

  const filtered = data.filter(p =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(search.toLowerCase())
  )

  function openNew() { setForm(empty); setEditId(null); setModal(true) }
  function openEdit(p) { setForm({...p}); setEditId(p.id); setModal(true) }

  async function save() {
    if (!form.nombre.trim()) return
    try {
      if (editId) {
        await api.put(`/pacientes/${editId}`, form)
      } else {
        await api.post('/pacientes', form)
      }
      fetchPacientes()
      setModal(false)
    } catch (e) {
      console.error('Error guardando paciente', e)
    }
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este paciente?')) return
    try {
      await api.delete(`/pacientes/${id}`)
      fetchPacientes()
    } catch (e) {
      console.error('Error eliminando paciente', e)
    }
  }

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  if (loading) return <div className="module"><p>Cargando pacientes...</p></div>

  return (
    <div className="module">
      <div className="stats-row">
        <StatCard icon="" label="Total pacientes" value={data.length} sub="registrados" />
        <StatCard icon="" label="Activos" value={data.filter(p=>p.estado).length} sub="en tratamiento" />
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre..." />
          <button className="btn-primary" onClick={openNew}>+ Nuevo paciente</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paciente</th><th>DUI</th><th>Fecha nacimiento</th>
                <th>Alergias</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="empty-row">No se encontraron pacientes</td></tr>
              )}
              {filtered.map((p, i) => (
                <tr key={p.id}>
                  <td><div className="name-cell"><Avatar name={`${p.nombre} ${p.apellido}`} index={i} /><span>{p.nombre} {p.apellido}</span></div></td>
                  <td>{p.dui}</td>
                  <td>{p.fecha_nacimiento}</td>
                  <td>{p.alergias}</td>
                  <td><Pill label={p.estado ? 'Activo' : 'Inactivo'} type={p.estado ? 'green' : 'red'} /></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => openEdit(p)}>✏️</button>
                      <button className="btn-icon btn-danger" onClick={() => remove(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Editar paciente' : 'Nuevo paciente'}>
        <div className="form-grid">
          <FormField label="Nombre"><input value={form.nombre} onChange={e=>f('nombre',e.target.value)} placeholder="Juan" /></FormField>
          <FormField label="Apellido"><input value={form.apellido} onChange={e=>f('apellido',e.target.value)} placeholder="Pérez" /></FormField>
          <FormField label="DUI"><input value={form.dui} onChange={e=>f('dui',e.target.value)} placeholder="12345678-9" /></FormField>
          <FormField label="Fecha nacimiento"><input type="date" value={form.fecha_nacimiento} onChange={e=>f('fecha_nacimiento',e.target.value)} /></FormField>
          <FormField label="Alergias"><input value={form.alergias} onChange={e=>f('alergias',e.target.value)} placeholder="Ninguna" /></FormField>
          <FormField label="Género">
            <select value={form.id_genero} onChange={e=>f('id_genero', parseInt(e.target.value))}>
              <option value={1}>Masculino</option>
              <option value={2}>Femenino</option>
            </select>
          </FormField>
          <FormField label="Grupo sanguíneo">
            <select value={form.id_grupo_sanguineo} onChange={e=>f('id_grupo_sanguineo', parseInt(e.target.value))}>
              <option value={1}>A+</option>
              <option value={2}>A-</option>
              <option value={3}>B+</option>
              <option value={4}>O+</option>
              <option value={5}>O-</option>
            </select>
          </FormField>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => setModal(false)}>Cancelar</button>
          <button className="btn-save" onClick={save}>{editId ? 'Actualizar' : 'Guardar'}</button>
        </div>
      </Modal>
    </div>
  )
}