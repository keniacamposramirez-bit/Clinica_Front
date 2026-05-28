import { useState, useEffect } from 'react'
import { Avatar, Pill, StatCard, Modal, FormField, SearchBar } from './UI'
import api from '../api/axios'

const empty = { nombre:'', descripcion:'', presentacion:'', estado:true }

export default function Medicamentos() {
  const [data, setData]       = useState([])
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(empty)
  const [editId, setEditId]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMedicamentos() }, [])

  async function fetchMedicamentos() {
    try {
      const res = await api.get('/catalogos/medicamentos')
      setData(res.data.data)
    } catch (e) {
      console.error('Error cargando medicamentos', e)
    } finally {
      setLoading(false)
    }
  }

  const filtered = data.filter(m =>
    m.nombre.toLowerCase().includes(search.toLowerCase()) ||
    m.presentacion?.toLowerCase().includes(search.toLowerCase())
  )

  function openNew() { setForm(empty); setEditId(null); setModal(true) }
  function openEdit(m) {
    setForm({
      nombre:      m.nombre,
      descripcion: m.descripcion,
      presentacion: m.presentacion,
      estado:      m.estado,
    })
    setEditId(m.id)
    setModal(true)
  }

  async function save() {
    if (!form.nombre.trim()) return
    try {
      if (editId) {
        await api.put(`/catalogos/medicamentos/${editId}`, form)
      } else {
        await api.post('/catalogos/medicamentos', form)
      }
      fetchMedicamentos()
      setModal(false)
    } catch (e) {
      console.error('Error guardando medicamento', e)
    }
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este medicamento?')) return
    try {
      await api.delete(`/catalogos/medicamentos/${id}`)
      fetchMedicamentos()
    } catch (e) {
      console.error('Error eliminando medicamento', e)
    }
  }

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  if (loading) return <div className="module"><p>Cargando medicamentos...</p></div>

  return (
    <div className="module">
      <div className="stats-row">
        <StatCard icon="" label="Total fármacos" value={data.length} sub="en inventario" />
        <StatCard icon="" label="Activos" value={data.filter(m=>m.estado).length} sub="disponibles" />
        <StatCard icon="" label="Inactivos" value={data.filter(m=>!m.estado).length} sub="sin disponibilidad" />
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar medicamento o presentación..." />
          <button className="btn-primary" onClick={openNew}>+ Nuevo medicamento</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Medicamento</th><th>Descripción</th><th>Presentación</th>
                <th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="empty-row">No se encontraron medicamentos</td></tr>
              )}
              {filtered.map((m, i) => (
                <tr key={m.id}>
                  <td><div className="name-cell"><Avatar name={m.nombre} index={i} /><span>{m.nombre}</span></div></td>
                  <td>{m.descripcion}</td>
                  <td><Pill label={m.presentacion || '-'} type="purple" /></td>
                  <td><Pill label={m.estado ? 'Activo' : 'Inactivo'} type={m.estado ? 'green' : 'red'} /></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => openEdit(m)}></button>
                      <button className="btn-icon btn-danger" onClick={() => remove(m.id)}></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Editar medicamento' : 'Nuevo medicamento'}>
        <div className="form-grid">
          <FormField label="Nombre"><input value={form.nombre} onChange={e=>f('nombre',e.target.value)} placeholder="Amoxicilina 500mg" /></FormField>
          <FormField label="Descripción"><input value={form.descripcion} onChange={e=>f('descripcion',e.target.value)} placeholder="Antibiótico de amplio espectro" /></FormField>
          <FormField label="Presentación"><input value={form.presentacion} onChange={e=>f('presentacion',e.target.value)} placeholder="Comprimidos 500mg" /></FormField>
          <FormField label="Estado">
            <select value={form.estado} onChange={e=>f('estado', e.target.value === 'true')}>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
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