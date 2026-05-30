import { useState, useEffect } from 'react'
import api from "../../api/axios";

const empty = {
  id_cita: '',
  id_doctor: '',
  id_medicamento: '',
  dosis: '',
  frecuencia: '',
  duracion: '',
  indicaciones: ''
}

export default function Recetas() {
  const [data, setData]               = useState([])
  const [citas, setCitas]             = useState([])
  const [doctores, setDoctores]       = useState([])
  const [medicamentos, setMedicamentos] = useState([])
  const [search, setSearch]           = useState('')
  const [loading, setLoading]         = useState(true)
  const [modal, setModal]             = useState(false)
  const [form, setForm]               = useState(empty)
  const [editId, setEditId]           = useState(null)

  useEffect(() => {
    fetchRecetas()
    fetchCitas()
    fetchDoctores()
    fetchMedicamentos()
  }, [])

  async function fetchRecetas() {
    try {
      const res = await api.get('/recetas')
      setData(res.data.data)
    } catch (e) {
      console.error('Error cargando recetas', e)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCitas() {
    try {
      const res = await api.get('/citas')
      setCitas(res.data.data)
    } catch (e) {
      console.error('Error cargando citas', e)
    }
  }

  async function fetchDoctores() {
    try {
      const res = await api.get('/doctores')
      setDoctores(res.data.data)
    } catch (e) {
      console.error('Error cargando doctores', e)
    }
  }

  async function fetchMedicamentos() {
    try {
      const res = await api.get('/catalogos/medicamentos')
      setMedicamentos(res.data.data)
    } catch (e) {
      console.error('Error cargando medicamentos', e)
    }
  }

  async function save() {
    try {
      if (editId) {
        await api.put(/recetas/${editId}, form)
      } else {
        await api.post('/recetas', form)
      }
      fetchRecetas()
      closeModal()
    } catch (e) {
      console.error('Error guardando receta', e)
    }
  }

  async function remove(id) {
    if (!confirm('¿Deseas eliminar esta receta?')) return
    try {
      await api.delete(/recetas/${id})
      fetchRecetas()
    } catch (e) {
      console.error('Error eliminando receta', e)
    }
  }

  function openCreate() { setForm(empty); setEditId(null); setModal(true) }
  function openEdit(item) {
    setForm({
      id_cita:        parseInt(item.id_cita),
      id_doctor:      parseInt(item.id_doctor),
      id_medicamento: parseInt(item.id_medicamento),
      dosis:          item.dosis || '',
      frecuencia:     item.frecuencia || '',
      duracion:       item.duracion || '',
      indicaciones:   item.indicaciones || ''
    })
    setEditId(item.id)
    setModal(true)
  }
  function closeModal() { setModal(false); setForm(empty); setEditId(null) }

  const filtered = data.filter(item =>
    (item.medicamento?.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.cita?.paciente ? ${item.cita.paciente.nombre} ${item.cita.paciente.apellido} : '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="module">Cargando recetas...</div>

  return (
    <div className="module">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{data.length}</div>
          <div className="stat-label">Recetas</div>
        </div>
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar receta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={openCreate}>+ Nueva receta</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Doctor</th>
                <th>Medicamento</th>
                <th>Dosis</th>
                <th>Frecuencia</th>
                <th>Duración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>{item.cita?.paciente ? ${item.cita.paciente.nombre} ${item.cita.paciente.apellido} : '-'}</td>
                  <td>{item.doctor ? Dr. ${item.doctor.nombre} ${item.doctor.apellido} : '-'}</td>
                  <td>{item.medicamento?.nombre || '-'}</td>
                  <td>{item.dosis}</td>
                  <td>{item.frecuencia}</td>
                  <td>{item.duracion}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => openEdit(item)}>✏️</button>
                      <button className="btn-icon btn-danger" onClick={() => remove(item.id)}>🗑️</button>
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
              <h3 className="modal-title">{editId ? 'Editar receta' : 'Nueva receta'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Cita</label>
                <select value={form.id_cita} onChange={e => setForm({ ...form, id_cita: parseInt(e.target.value) })}>
                  <option value="">Seleccionar cita</option>
                  {citas.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.paciente ? ${c.paciente.nombre} ${c.paciente.apellido} : Cita #${c.id}} - {c.fecha_hora?.slice(0, 10)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Doctor</label>
                <select value={form.id_doctor} onChange={e => setForm({ ...form, id_doctor: parseInt(e.target.value) })}>
                  <option value="">Seleccionar doctor</option>
                  {doctores.map(d => (
                    <option key={d.id} value={d.id}>Dr. {d.nombre} {d.apellido}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Medicamento</label>
                <select value={form.id_medicamento} onChange={e => setForm({ ...form, id_medicamento: parseInt(e.target.value) })}>
                  <option value="">Seleccionar medicamento</option>
                  {medicamentos.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Dosis</label>
                <input value={form.dosis} onChange={e => setForm({ ...form, dosis: e.target.value })} placeholder="500mg" />
              </div>
              <div className="form-field">
                <label className="form-label">Frecuencia</label>
                <input value={form.frecuencia} onChange={e => setForm({ ...form, frecuencia: e.target.value })} placeholder="Cada 8 horas" />
              </div>
              <div className="form-field">
                <label className="form-label">Duración</label>
                <input value={form.duracion} onChange={e => setForm({ ...form, duracion: e.target.value })} placeholder="5 días" />
              </div>
              <div className="form-field" style={{ gridColumn: '1 / span 2' }}>
                <label className="form-label">Indicaciones</label>
                <input value={form.indicaciones} onChange={e => setForm({ ...form, indicaciones: e.target.value })} placeholder="Tomar después de comer" />
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
