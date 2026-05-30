import { useState, useEffect } from 'react'
import api from "../../api/axios";

const empty = {
  id_paciente: '',
  antecedentes: '',
  observaciones: '',
  estado: true
}

export default function Expedientes() {
  const [data, setData] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpedientes()
    fetchPacientes()
  }, [])

  async function fetchExpedientes() {
    try {
      const res = await api.get('/expedientes')
      setData(res.data.data)
    } catch (e) {
      console.error('Error cargando expedientes', e)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPacientes() {
    try {
      const res = await api.get('/pacientes')
      setPacientes(res.data.data)
    } catch (e) {
      console.error('Error cargando pacientes', e)
    }
  }

  async function save() {
    try {
      if (editId) {
        await api.put(/expedientes/${editId}, form)
      } else {
        await api.post('/expedientes', form)
      }
      fetchExpedientes()
      closeModal()
    } catch (e) {
      console.error('Error guardando expediente', e)
    }
  }

  async function remove(id) {
    if (!confirm('¿Deseas eliminar este expediente?')) return
    try {
      await api.delete(/expedientes/${id})
      fetchExpedientes()
    } catch (e) {
      console.error('Error eliminando expediente', e)
    }
  }

  function openCreate() { setForm(empty); setEditId(null); setModal(true) }
  function openEdit(item) {
    setForm({
      id_paciente: parseInt(item.id_paciente),
      antecedentes: item.antecedentes || '',
      observaciones: item.observaciones || '',
      estado: item.estado
    })
    setEditId(item.id)
    setModal(true)
  }
  function closeModal() { setModal(false); setForm(empty); setEditId(null) }

  const filtered = data.filter(item =>
    (item.numero_expediente || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.paciente ? ${item.paciente.nombre} ${item.paciente.apellido} : '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="module">Cargando expedientes...</div>

  return (
    <div className="module">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{data.length}</div>
          <div className="stat-label">Expedientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.filter(e => e.estado).length}</div>
          <div className="stat-label">Activos</div>
        </div>
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar expediente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={openCreate} className="btn-primary">+ Nuevo expediente</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Expediente</th>
                <th>Paciente</th>
                <th>Fecha apertura</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>{item.numero_expediente}</td>
                  <td>{item.paciente ? ${item.paciente.nombre} ${item.paciente.apellido} : '-'}</td>
                  <td>{item.fecha_apertura}</td>
                  <td>
                    <span className={pill ${item.estado ? 'pill-green' : 'pill-red'}}>
                      {item.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button onClick={() => openEdit(item)} className="btn-icon">✏️</button>
                      <button onClick={() => remove(item.id)} className="btn-icon btn-danger">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Editar expediente' : 'Nuevo expediente'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Paciente</label>
                <select
                  value={form.id_paciente}
                  onChange={e => setForm({ ...form, id_paciente: parseInt(e.target.value) })}
                >
                  <option value="">Seleccionar paciente</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Antecedentes</label>
                <input
                  value={form.antecedentes}
                  onChange={e => setForm({ ...form, antecedentes: e.target.value })}
                />
              </div>
              <div className="form-field" style={{ gridColumn: '1 / span 2' }}>
                <label className="form-label">Observaciones</label>
                <input
                  value={form.observaciones}
                  onChange={e => setForm({ ...form, observaciones: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
              <button className="btn-save" onClick={save}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}