import { useState, useEffect } from 'react'
import api from '../../api/axios'
 
//  OBJETO BASE DEL FORMULARIO
const empty = {
  nombre: '',
  descripcion: '',
  estado: true
}
// COMPONENTE PRINCIPAL
export default function Tratamientos() {
 
  const [data, setData] = useState([]) // Lista completa de tratamientos
  const [search, setSearch] = useState('')  // Texto del buscador
  const [modal, setModal] = useState(false)  // Controla apertura/cierre del modal
  const [form, setForm] = useState(empty) // Datos del formulario
  const [editId, setEditId] = useState(null) // ID del registro en edición
  const [loading, setLoading] = useState(true) // Estado de carga

  // Cargar tratamientos al iniciar el componente
  useEffect(() => {
    fetchTratamientos()
  }, [])

// FUNCIÓN PARA OBTENER DATOS
  async function fetchTratamientos() {
    try {
      const res = await api.get('/catalogos/tipos-tratamiento')
      setData(res.data.data)
    } catch (e) {
      console.error('Error cargando tratamientos', e)
    } finally {
      setLoading(false)
    }
  }

//  FUNCIÓN PARA GUARDAR EN BACKEND
  async function save() {
    try {
      // EDITAR tratamiento
      if (editId) {          
        await api.put(/catalogos/tipos-tratamiento/${editId}, form)
      } else {
        // CREAR tratamiento
        await api.post('/catalogos/tipos-tratamiento', form)
      }

      fetchTratamientos()
      closeModal()

    } catch (e) {
      console.error('Error guardando tratamiento', e)
    }
  }

// FUNCIÓN PARA DESACTIVAR TRATAMIENTO
async function remove(item) {

  if (!confirm('¿Deseas desactivar este tratamiento?')) return

  try {

    await api.put(/catalogos/tipos-tratamiento/${item.id}, {
      nombre: item.nombre,
      descripcion: item.descripcion,
      estado: false
    })

    fetchTratamientos()

  } catch (e) {
    console.error('Error desactivando tratamiento', e)
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

// CIERRE MODAL
  function closeModal() {
    setModal(false)
    setForm(empty)
    setEditId(null)
  }

  const filtered = data.filter(t =>
  (t.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
  (t.descripcion || '').toLowerCase().includes(search.toLowerCase())
)

  // Cantidad de activos
    const activos = data.filter(t => t.estado).length
  // Cantidad de inactivos
  const inactivos = data.filter(t => !t.estado).length

  if (loading) {
  return <div className="module">Cargando tratamientos...</div>
}
    return (
  <div className="module">

    {/* Estadísticas */}
    <div className="stats-row">

      <div className="stat-card">
        <div className="stat-value">{data.length}</div>
        <div className="stat-label">Total tratamientos</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">
          {activos}
        </div>
        <div className="stat-label">Activos</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">
          {inactivos}
        </div>
        <div className="stat-label">Inactivos</div>
      </div>

    </div>

    {/* Tabla */}
    <div className="table-section">

      <div className="table-toolbar">

        <div className="search-wrap">
          <span className="search-icon">🔍</span>

          <input
            type="text"
            placeholder="Buscar tratamiento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <button
          onClick={openCreate}
          className="btn-primary"
        >
          + Nuevo tratamiento
        </button>

      </div>

      <div className="table-wrap">

        <table>

          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map(item => (
              <tr key={item.id}>

                <td>{item.nombre}</td>

                <td>{item.descripcion}</td>

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
                      onClick={() => remove(item)}
                      className="btn-icon btn-danger"
                    >
                      🚫
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
                {editId ? 'Editar tratamiento' : 'Nuevo tratamiento'}
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
                  Nombre
                </label>

                <input
                  value={form.nombre || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nombre: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label className="form-label">
                  Descripción
                </label>

                <input
                  value={form.descripcion || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descripcion: e.target.value
                    })
                  }
                />

              </div>

              <div className="form-field">

                <label className="form-label">
                  Estado
                </label>

                <select
                  value={String(form.estado)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      estado: e.target.value === 'true'
                    })
                  }
                >

                  <option value={true}>
                    Activo
                  </option>

                  <option value={false}>
                    Inactivo
                  </option>

                </select>

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
      nombre: 'Ortodoncia',
      descripcion: 'Tratamiento dental',
      estado: true
    },
    {
      id: 2,
      nombre: 'Limpieza',
      descripcion: 'Limpieza profunda',
      estado: true
    },
    {
      id: 3,
      nombre: 'Extracción',
      descripcion: 'Extracción de muela',
      estado: false
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

  if (!confirm('¿Deseas eliminar este tratamiento?')) return

  setData(data.filter(item => item.id !== id))
}
*/

