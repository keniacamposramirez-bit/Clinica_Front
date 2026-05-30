import { useState, useEffect } from 'react'
import api from "../../api/axios";

const empty = {
  id_cita: '',
  id_expediente: '',
  id_tipo_tratamiento: '',
  sintomas: '',
  descripcion: '',
  observaciones: ''
}

export default function Diagnosticos() {
  const [data, setData]           = useState([])
  const [citas, setCitas]         = useState([])
  const [expedientes, setExpedientes] = useState([])
  const [tratamientos, setTratamientos] = useState([])
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [form, setForm]           = useState(empty)
  const [editId, setEditId]       = useState(null)

  useEffect(() => {
    fetchDiagnosticos()
    fetchCitas()
    fetchExpedientes()
    fetchTratamientos()
  }, [])

  async function fetchDiagnosticos() {
    try {
      const res = await api.get('/diagnosticos')
      setData(res.data.data)
    } catch (e) {
      console.error('Error cargando diagnósticos', e)
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

  async function fetchExpedientes() {
    try {
      const res = await api.get('/expedientes')
      setExpedientes(res.data.data)
    } catch (e) {
      console.error('Error cargando expedientes', e)
    }
  }

  async function fetchTratamientos() {
    try {
      const res = await api.get('/catalogos/tipos-tratamiento')
      setTratamientos(res.data.data)
    } catch (e) {
      console.error('Error cargando tratamientos', e)
    }
  }

  async function save() {
    try {
      if (editId) {
        await api.put(/diagnosticos/${editId}, form)
      } else {
        await api.post('/diagnosticos', form)
      }
      fetchDiagnosticos()
      closeModal()
    } catch (e) {
      console.error('Error guardando diagnóstico', e)
    }
  }

  async function remove(item) {
    if (!confirm('¿Deseas eliminar este diagnóstico?')) return
    try {
      await api.delete(/diagnosticos/${item.id})
      fetchDiagnosticos()
    } catch (e) {
      console.error('Error eliminando diagnóstico', e)
    }
  }

  function openCreate() { setForm(empty); setEditId(null); setModal(true) }
  function openEdit(item) {
    setForm({
      id_cita: parseInt(item.id_cita),
      id_expediente: parseInt(item.id_expediente),
      id_tipo_tratamiento: item.id_tipo_tratamiento ? parseInt(item.id_tipo_tratamiento) : '',
      sintomas: item.sintomas || '',
      descripcion: item.descripcion || '',
      observaciones: item.observaciones || ''
    })
    setEditId(item.id)
    setModal(true)
  }
  function closeModal() { setModal(false); setForm(empty); setEditId(null) }

  const filtered = data.filter(item =>
    (item.cita?.paciente ? ${item.cita.paciente.nombre} ${item.cita.paciente.apellido} : '').toLowerCase().includes(search.toLowerCase()) ||
    (item.tipo_tratamiento?.nombre || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="module">Cargando diagnósticos...</div>

  return (
    <div className="module">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{data.length}</div>
          <div className="stat-label">Diagnósticos</div>
        </div>
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar diagnóstico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-primary" onClick={openCreate}>+ Nuevo diagnóstico</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Tratamiento</th>
                <th>Síntomas</th>
                <th>Descripción</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>{item.cita?.paciente ? ${item.cita.paciente.nombre} ${item.cita.paciente.apellido} : '-'}</td>
                  <td>{item.tipo_tratamiento?.nombre || '-'}</td>
                  <td>{item.sintomas}</td>
                  <td>{item.descripcion}</td>
                  <td>{item.observaciones}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => openEdit(item)}>✏️</button>
                      <button className="btn-icon btn-danger" onClick={() => remove(item)}>🗑️</button>
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
              <h3 className="modal-title">{editId ? 'Editar diagnóstico' : 'Nuevo diagnóstico'}</h3>
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
                <label className="form-label">Expediente</label>
                <select value={form.id_expediente} onChange={e => setForm({ ...form, id_expediente: parseInt(e.target.value) })}>
                  <option value="">Seleccionar expediente</option>
                  {expedientes.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.numero_expediente} - {e.paciente ? ${e.paciente.nombre} ${e.paciente.apellido} : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Tipo de tratamiento</label>
                <select value={form.id_tipo_tratamiento} onChange={e => setForm({ ...form, id_tipo_tratamiento: parseInt(e.target.value) })}>
                  <option value="">Sin tratamiento</option>
                  {tratamientos.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Síntomas</label>
                <input value={form.sintomas} onChange={e => setForm({ ...form, sintomas: e.target.value })} />
              </div>
              <div className="form-field">
                <label className="form-label">Descripción</label>
                <input value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
              </div>
              <div className="form-field" style={{ gridColumn: '1 / span 2' }}>
                <label className="form-label">Observaciones</label>
                <input value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} />
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