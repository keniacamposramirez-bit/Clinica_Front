// IMPORTACIONES
import { useState, useEffect } from 'react'
import api from "../../api/axios";

// OBJETO BASE DEL FORMULARIO
const empty = {
  id_cita: '',
  id_doctor: '',
  id_medicamento: '',
  paciente: '',
  doctor: '',
  medicamento: '',
  dosis: '',
  frecuencia: '',
  duracion: '',
  indicaciones: ''
}

// COMPONENTE PRINCIPAL
export default function Recetas() {

  // ESTADOS
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)

  // CARGAR RECETAS AL INICIAR
  useEffect(() => {
    fetchRecetas()
  }, [])

  // OBTENER RECETAS DESDE EL BACKEND
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

  // GUARDAR RECETA
  async function save() {

    try {

      if (editId) {

        await api.put(`/recetas/${editId}`, form)

      } else {

        await api.post('/recetas', form)

      }

      fetchRecetas()
      closeModal()

    } catch (e) {

      console.error('Error guardando receta', e)

    }
  }

  // ELIMINAR RECETA
  async function remove(id) {

    if (!confirm('¿Deseas eliminar esta receta?')) return

    try {

      await api.delete(`/recetas/${id}`)

      fetchRecetas()

    } catch (e) {

      console.error('Error eliminando receta', e)

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
    (item.medicamento || '')
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (item.paciente || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="module">Cargando recetas...</div>
  }

  return (
    <div className="module">

      {/* ESTADÍSTICAS */}
      <div className="stats-row">

        <div className="stat-card">
          <div className="stat-value">{data.length}</div>
          <div className="stat-label">Recetas</div>
        </div>

      </div>

      {/* TABLA */}
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

          <button
            className="btn-primary"
            onClick={openCreate}
          >
            + Nueva receta
          </button>

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

                  <td>{item.paciente}</td>
                  <td>{item.doctor}</td>
                  <td>{item.medicamento}</td>
                  <td>{item.dosis}</td>
                  <td>{item.frecuencia}</td>
                  <td>{item.duracion}</td>

                  <td>

                    <div className="action-btns">

                      <button
                        className="btn-icon"
                        onClick={() => openEdit(item)}
                      >
                        ✏️
                      </button>

                      <button
                        className="btn-icon btn-danger"
                        onClick={() => remove(item.id)}
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
                {editId ? 'Editar receta' : 'Nueva receta'}
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
                  Doctor
                </label>

                <input
                  value={form.doctor || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      doctor: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label className="form-label">
                  Medicamento
                </label>

                <input
                  value={form.medicamento || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      medicamento: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label className="form-label">
                  Dosis
                </label>

                <input
                  value={form.dosis || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      dosis: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label className="form-label">
                  Frecuencia
                </label>

                <input
                  value={form.frecuencia || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      frecuencia: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label className="form-label">
                  Duración
                </label>

                <input
                  value={form.duracion || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      duracion: e.target.value
                    })
                  }
                />

              </div>

              <div
                className="form-field"
                style={{ gridColumn: '1 / span 2' }}
              >

                <label className="form-label">
                  Indicaciones
                </label>

                <input
                  value={form.indicaciones || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      indicaciones: e.target.value
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
      medicamento: 'Ibuprofeno',
      dosis: '500mg',
      frecuencia: 'Cada 8 horas',
      duracion: '5 días',
      doctor: 'Dr. Carlos',
      paciente: 'Ana Martínez',
      indicaciones: 'Tomar después de comer'
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

  if (!confirm('¿Deseas eliminar esta receta?')) return

  setData(data.filter(item => item.id !== id))
}

*/