// IMPORTACIONES
import { useState, useEffect } from 'react'
import api from "../../api/axios";

// OBJETO BASE DEL FORMULARIO
const empty = {
  id_paciente: '',
  numero_expediente: '',
  fecha_apertura: '',
  antecedentes: '',
  observaciones: '',
  estado: true
}

// COMPONENTE PRINCIPAL
export default function Expedientes() {

  // ESTADOS
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)

  // CARGAR EXPEDIENTES AL INICIAR
  useEffect(() => {
    fetchExpedientes()
  }, [])

  // OBTENER EXPEDIENTES DESDE EL BACKEND
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

  // GUARDAR EXPEDIENTE
  async function save() {

    try {

      if (editId) {

        await api.put(`/expedientes/${editId}`, form)

      } else {

        await api.post('/expedientes', form)

      }

      fetchExpedientes()
      closeModal()

    } catch (e) {

      console.error('Error guardando expediente', e)

    }
  }

  // ELIMINAR EXPEDIENTE
  async function remove(id) {

    if (!confirm('¿Deseas eliminar este expediente?')) return

    try {

      await api.delete(`/expedientes/${id}`)

      fetchExpedientes()

    } catch (e) {

      console.error('Error eliminando expediente', e)

    }
  }

  // ABRIR MODAL PARA CREAR
  function openCreate() {
    setForm(empty)
    setEditId(null)
    setModal(true)
  }

  // ABRIR MODAL PARA EDITAR
  function openEdit(item) {
    setForm(item)
    setEditId(item.id)
    setModal(true)
  }

  // CERRAR MODAL
  function closeModal() {
    setModal(false)
    setForm(empty)
    setEditId(null)
  }

  // FILTRO DE BÚSQUEDA
  const filtered = data.filter(item =>
    (item.numero_expediente || '')
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (item.paciente || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="module">Cargando expedientes...</div>
  }

  return (
    <div className="module">

      {/* ESTADÍSTICAS */}
      <div className="stats-row">

        <div className="stat-card">
          <div className="stat-value">{data.length}</div>
          <div className="stat-label">Expedientes</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">
            {data.filter(e => e.estado).length}
          </div>
          <div className="stat-label">Activos</div>
        </div>

      </div>

      {/* TABLA */}
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

          <button
            onClick={openCreate}
            className="btn-primary"
          >
            + Nuevo expediente
          </button>

        </div>

        <div className="table-wrap">

          <table>

            <thead>
              <tr>
                <th>Expediente</th>
                <th>Paciente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {filtered.map(item => (

                <tr key={item.id}>

                  <td>{item.numero_expediente}</td>
                  <td>{item.paciente}</td>
                  <td>{item.fecha_apertura}</td>

                  <td>
                    <span className={`pill ${
                      item.estado
                        ? 'pill-green'
                        : 'pill-red'
                    }`}>
                      {item.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td>

                    <div className="action-btns">

                      <button
                        onClick={() => openEdit(item)}
                        className="btn-icon"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => remove(item.id)}
                        className="btn-icon btn-danger"
                      >
                        🗑️
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}
      {modal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h3 className="modal-title">
                {editId ? 'Editar expediente' : 'Nuevo expediente'}
              </h3>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                ✕
              </button>

            </div>

            <div className="form-grid">

              <div className="form-field">

                <label className="form-label">
                  Paciente
                </label>

                <input
                  value={form.paciente || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      paciente: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label className="form-label">
                  Número expediente
                </label>

                <input
                  value={form.numero_expediente || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      numero_expediente: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label className="form-label">
                  Fecha apertura
                </label>

                <input
                  type="date"
                  value={form.fecha_apertura || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      fecha_apertura: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label className="form-label">
                  Antecedentes
                </label>

                <input
                  value={form.antecedentes || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      antecedentes: e.target.value
                    })
                  }
                />

              </div>

              <div
                className="form-field"
                style={{ gridColumn: '1 / span 2' }}
              >

                <label className="form-label">
                  Observaciones
                </label>

                <input
                  value={form.observaciones || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      observaciones: e.target.value
                    })
                  }
                />

              </div>

            </div>

            <div className="modal-actions">

              <button
                className="btn-cancel"
                onClick={closeModal}
              >
                Cancelar
              </button>

              <button
                className="btn-save"
                onClick={save}
              >
                Guardar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

// ==========================================
// CÓDIGO UTILIZADO PARA PRUEBAS SIN BACKEND
// ESTE BLOQUE DEBE PERMANECER COMENTADO
// ==========================================

/*

useEffect(() => {

  const mockData = [
    {
      id: 1,
      paciente: 'Juan Pérez',
      numero_expediente: 'EXP-001',
      fecha_apertura: '2026-05-27',
      antecedentes: 'Hipertensión',
      observaciones: 'Paciente estable',
      estado: true
    }
  ]

  setData(mockData)
  setLoading(false)

}, [])

function save() {

  if (editId) {

    setData(data.map(item =>
      item.id === editId
        ? { ...form, id: editId }
        : item
    ))

  } else {

    setData([
      ...data,
      {
        ...form,
        id: Date.now()
      }
    ])
  }

  closeModal()
}

function remove(id) {

  if (!confirm('¿Deseas eliminar este expediente?')) return

  setData(data.filter(item => item.id !== id))
}

*/