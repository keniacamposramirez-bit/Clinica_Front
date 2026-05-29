import { useState, useEffect } from 'react'
import { Pill, StatCard, Modal, FormField, SearchBar } from '../UI'
import api from "../../api/axios";

// MAPEO DE COLORES PARA EL COMPONENTE Pill SEGÚN EL ESTADO
const statusMap = { 'Pendiente':'amber', 'Completada':'green', 'Cancelada':'red' }
const empty = { id_paciente:'', id_doctor:'', fecha_hora:'', duracion_min:30, motivo:'', id_estado_cita:1 }

export default function Citas() {
  const [data, setData]           = useState([])  // LISTA DE CITAS
  const [pacientes, setPacientes] = useState([])  // LISTA DE PACIENTES PARA EL SELECT DEL FORMULARIO
  const [doctores, setDoctores]   = useState([])  // LISTA DE DOCTORES PARA EL SELECT DEL FORMULARIO
  const [search, setSearch]       = useState('')  // TEXTO DEL BUSCADOR
  const [modal, setModal]         = useState(false) // CONTROL DEL MODAL
  const [form, setForm]           = useState(empty)  // DATOS DEL FORMULARIO
  const [editId, setEditId]       = useState(null)   // ID DE LA CITA EN EDICIÓN
  const [filter, setFilter]       = useState('Todas')  // FILTRO DE ESTADO DE CITA  
  const [loading, setLoading]     = useState(true)    // ESTADO DE CARGA

  useEffect(() => {
    fetchCitas()
    fetchPacientes()
    fetchDoctores()
  }, [])

// OBTENER CITAS DESDE EL BACKEND  
  async function fetchCitas() {
    try {
      const res = await api.get('/citas')
      setData(res.data.data)
    } catch (e) {
      console.error('Error cargando citas', e)
    } finally {
      setLoading(false)
    }
  }

// OBTENER PACIENTES DESDE EL BACKEND
  async function fetchPacientes() {
    try {
      const res = await api.get('/pacientes')
      setPacientes(res.data.data)
    } catch (e) {
      console.error('Error cargando pacientes', e)
    }
  }

  // OBTENER DOCTORES DESDE EL BACKEND  
  async function fetchDoctores() {
    try {
      const res = await api.get('/doctores')
      setDoctores(res.data.data)
    } catch (e) {
      console.error('Error cargando doctores', e)
    }
  }

  // FILTRO POR BUSCADOR Y ESTADO
  const filtered = data.filter(c => {
    const pacNombre = c.paciente ? `${c.paciente.nombre} ${c.paciente.apellido}` : ''
    const docNombre = c.doctor ? `${c.doctor.nombre} ${c.doctor.apellido}` : ''
    const matchSearch = pacNombre.toLowerCase().includes(search.toLowerCase()) ||
                        docNombre.toLowerCase().includes(search.toLowerCase())
    const estadoNombre = c.estado_cita?.nombre || '' 
    const matchStatus = filter === 'Todas' || estadoNombre === filter // VALIDACION DEL FILTRO ESTADO
    return matchSearch && matchStatus
  })

  function openNew() { setForm(empty); setEditId(null); setModal(true) }

  // ABRIR MODAL PARA EDITAR
  function openEdit(c) {
    setForm({
      id_paciente:    parseInt(c.id_paciente),
      id_doctor:      parseInt(c.id_doctor),
      fecha_hora:     c.fecha_hora?.slice(0, 16),
      duracion_min:   c.duracion_min,
      motivo:         c.motivo,
      id_estado_cita: parseInt(c.id_estado_cita),
    })
    setEditId(c.id)
    setModal(true)
  }

  // GUARDAR O ACTUALIZAR CITA
  async function save() {
    if (!form.id_paciente || !form.id_doctor) return
    try {
      if (editId) {
        await api.put(`/citas/${editId}`, form)
      } else {
        await api.post('/citas', form)
      }
      fetchCitas() // Actualizar la lista de citas
      setModal(false)
    } catch (e) {
      console.error('Error guardando cita', e)
    }
  }

  // ELIMINAR CITA
  async function remove(id) {
    if (!confirm('¿Cancelar esta cita?')) return
    try {
      await api.delete(`/citas/${id}`)
      fetchCitas()
    } catch (e) {
      console.error('Error cancelando cita', e)
    }
  }

  // ACTUALIZAR VALORES DEL FORMULARIO
  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  if (loading) return <div className="module"><p>Cargando citas...</p></div>

  return (
    <div className="module">
      <div className="stats-row">
        <StatCard icon="" label="Total citas" value={data.length} sub="registradas" />
        <StatCard icon="" label="Pendientes" value={data.filter(c=>c.estado_cita?.nombre==='Pendiente').length} sub="por atender" />
        <StatCard icon="" label="Completadas" value={data.filter(c=>c.estado_cita?.nombre==='Completada').length} sub="finalizadas" />
        <StatCard icon="" label="Canceladas" value={data.filter(c=>c.estado_cita?.nombre==='Cancelada').length} sub="no realizadas" />
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por paciente o doctor..." />
          <div className="filter-tabs">
            {['Todas','Pendiente','Completada','Cancelada'].map(s => (
              <button key={s} className={`filter-tab ${filter===s?'active':''}`} onClick={()=>setFilter(s)}>{s}</button>
            ))}
          </div>
          <button className="btn-primary" onClick={openNew}>+ Nueva cita</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paciente</th><th>Doctor</th><th>Fecha y hora</th>
                <th>Duración</th><th>Motivo</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="empty-row">No se encontraron citas</td></tr>
              )}
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.paciente ? `${c.paciente.nombre} ${c.paciente.apellido}` : '-'}</strong></td>
                  <td>{c.doctor ? `Dr. ${c.doctor.nombre} ${c.doctor.apellido}` : '-'}</td>
                  <td>{c.fecha_hora?.slice(0, 16).replace('T', ' ')}</td>
                  <td>{c.duracion_min} min</td>
                  <td>{c.motivo}</td>
                  <td><Pill label={c.estado_cita?.nombre || 'Pendiente'} type={statusMap[c.estado_cita?.nombre] || 'amber'} /></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => openEdit(c)}>✏️</button>
                      <button className="btn-icon btn-danger" onClick={() => remove(c.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Editar cita' : 'Nueva cita'}>
        <div className="form-grid">
          <FormField label="Paciente">
            <select value={form.id_paciente} onChange={e=>f('id_paciente', parseInt(e.target.value))}>
              <option value="">Seleccionar paciente</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
            </select>
          </FormField>
          <FormField label="Doctor">
            <select value={form.id_doctor} onChange={e=>f('id_doctor', parseInt(e.target.value))}>
              <option value="">Seleccionar doctor</option>
              {doctores.map(d => <option key={d.id} value={d.id}>Dr. {d.nombre} {d.apellido}</option>)}
            </select>
          </FormField>
          <FormField label="Fecha y hora"><input type="datetime-local" value={form.fecha_hora} onChange={e=>f('fecha_hora',e.target.value)} /></FormField>
          <FormField label="Duración (min)"><input type="number" value={form.duracion_min} onChange={e=>f('duracion_min',parseInt(e.target.value))} /></FormField>
          <FormField label="Motivo"><input value={form.motivo} onChange={e=>f('motivo',e.target.value)} placeholder="Control mensual" /></FormField>
          <FormField label="Estado">
            <select value={form.id_estado_cita} onChange={e=>f('id_estado_cita', parseInt(e.target.value))}>
              <option value={1}>Pendiente</option>
              <option value={2}>Confirmada</option>
              <option value={3}>En curso</option>
              <option value={4}>Completada</option>
              <option value={5}>Cancelada</option>
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