// IMPORTACIONES
import { useState, useEffect } from 'react'
import api from "../../api/axios";

// OBJETO BASE DEL FORMULARIO
const empty = {
  id_cita: '',
  id_expediente: '',
  id_tipo_tratamiento: '',
  paciente: '',
  tratamiento: '',
  sintomas: '',
  descripcion: '',
  observaciones: ''
}

// COMPONENTE PRINCIPAL
export default function Diagnosticos() {

  // ESTADOS
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)

  // CARGAR DIAGNÓSTICOS AL INICIAR
  useEffect(() => {
    fetchDiagnosticos()
  }, [])

  // OBTENER DIAGNÓSTICOS DESDE EL BACKEND
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

  // GUARDAR DIAGNÓSTICO
  async function save() {

    try {

      if (editId) {

        await api.put(`/diagnosticos/${editId}`, form)

      } else {

        await api.post('/diagnosticos', form)

      }

      fetchDiagnosticos()
      closeModal()

    } catch (e) {

      console.error('Error guardando diagnóstico', e)

    }
  }

  // DESACTIVAR / ELIMINAR DIAGNÓSTICO
  async function remove(item) {

    if (!confirm('¿Deseas eliminar este diagnóstico?')) return

    try {

      await api.delete(`/diagnosticos/${item.id}`)

      fetchDiagnosticos()

    } catch (e) {

      console.error('Error eliminando diagnóstico', e)

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
    (item.paciente || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.tratamiento || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="module">Cargando diagnósticos...</div>
  }

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

          <button
            className="btn-primary"
            onClick={openCreate}
          >
            + Nuevo diagnóstico
          </button>

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

                  <td>{item.paciente}</td>
                  <td>{item.tratamiento}</td>
                  <td>{item.sintomas}</td>
                  <td>{item.descripcion}</td>
                  <td>{item.observaciones}</td>

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
                        onClick={() => remove(item)}
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

      {modal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h3 className="modal-title">
                {editId ? 'Editar diagnóstico' : 'Nuevo diagnóstico'}
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

                <label className="form-label">Paciente</label>

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

                <label className="form-label">Tratamiento</label>

                <input
                  value={form.tratamiento || ''}
                  onChange={e =>
                    setForm({
                      ...form,
                      tratamiento: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label className="form-label">Síntomas</label>

                <input
                  value={form.sintomas}
                  onChange={e =>
                    setForm({
                      ...form,
                      sintomas: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label className="form-label">Descripción</label>

                <input
                  value={form.descripcion}
                  onChange={e =>
                    setForm({
                      ...form,
                      descripcion: e.target.value
                    })
                  }
                />

              </div>

              <div
                className="form-field"
                style={{ gridColumn: '1 / span 2' }}
              >

                <label className="form-label">Observaciones</label>

                <input
                  value={form.observaciones}
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
      paciente: 'María López',
      tratamiento: 'Ortodoncia',
      sintomas: 'Dolor dental',
      descripcion: 'Malposición dental',
      observaciones: 'Requiere seguimiento'
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

  if (!confirm('¿Deseas eliminar este diagnóstico?')) return

  setData(data.filter(item => item.id !== id))
}

*/