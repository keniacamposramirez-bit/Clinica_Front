import { Avatar, Pill, StatCard, Modal, FormField, SearchBar } from '../UI'
import api from "../../api/axios";

const empty = { nombre:'', apellido:'', id_especialidad:1, num_registro:'', estado:true }

export default function Doctores() {
  const [data, setData]           = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [search, setSearch]       = useState('')
  const [modal, setModal]         = useState(false)
  const [form, setForm]           = useState(empty)
  const [editId, setEditId]       = useState(null)
  const [loading, setLoading]     = useState(true)

  // CARGAR DATOS AL INICIAR
  useEffect(() => {
    fetchDoctores()
    fetchEspecialidades()
  }, [])

  // OBTENER DOCTORES
  async function fetchDoctores() {
    try {
      const res = await api.get('/doctores')
      setData(res.data.data)
    } catch (e) {
      console.error('Error cargando doctores', e)
    } finally {
      setLoading(false)
    }
  }

    // OBTENER ESPECIALIDADES DESDE EL BACKEND
  async function fetchEspecialidades() {
    try {
      const res = await api.get('/catalogos/especialidades')
      setEspecialidades(res.data.data)
    } catch (e) {
      console.error('Error cargando especialidades', e)
    }
  }

  const filtered = data.filter(d =>
    ${d.nombre} ${d.apellido}.toLowerCase().includes(search.toLowerCase()) ||
    d.especialidad?.nombre?.toLowerCase().includes(search.toLowerCase())
  )

  function openNew() { setForm(empty); setEditId(null); setModal(true) }
  function openEdit(d) {   // ABRIR MODAL PARA EDITAR
    setForm({
      nombre:          d.nombre,
      apellido:        d.apellido,
      id_especialidad: parseInt(d.id_especialidad),
      estado:          d.estado,
    })
    setEditId(d.id)
    setModal(true)
  }

    // GUARDAR MÉDICO
  async function save() {
    if (!form.nombre.trim()) return
    try {
      if (editId) {
        await api.put(/doctores/${editId}, form)
      } else {
        await api.post('/doctores', form)
      }
      fetchDoctores()
      setModal(false)
    } catch (e) {
      console.error('Error guardando doctor', e)
    }
  }

    // ELIMINAR O DESACTIVAR MÉDICO
  async function remove(id) {
    if (!confirm('¿Eliminar este médico?')) return
    try {
      await api.delete(/doctores/${id})
      fetchDoctores()
    } catch (e) {
      console.error('Error eliminando doctor', e)
    }
  }

    // ACTUALIZAR CAMPOS DEL FORMULARIO
  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  if (loading) return <div className="module"><p>Cargando doctores...</p></div>

  return (
    <div className="module">
      <div className="stats-row">
        <StatCard icon="" label="Total médicos" value={data.length} sub="en plantilla" />
        <StatCard icon="" label="Especialidades" value={[...new Set(data.map(d=>d.id_especialidad))].length} sub="áreas cubiertas" />
        <StatCard icon="" label="Activos" value={data.filter(d=>d.estado).length} sub="en servicio" />
        <StatCard icon="" label="Inactivos" value={data.filter(d=>!d.estado).length} sub="fuera de servicio" />
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre o especialidad..." />
          <button className="btn-primary" onClick={openNew}>+ Nuevo médico</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Médico</th><th>Especialidad</th><th>Nº Registro</th>
                <th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="empty-row">No se encontraron médicos</td></tr>
              )}
              {filtered.map((d, i) => (
                <tr key={d.id}>
                  <td><div className="name-cell"><Avatar name={${d.nombre} ${d.apellido}} index={i} /><span>Dr. {d.nombre} {d.apellido}</span></div></td>
                  <td><Pill label={d.especialidad?.nombre || '-'} type="teal" /></td>
                  <td>{d.num_registro}</td>
                  <td><Pill label={d.estado ? 'Activo' : 'Inactivo'} type={d.estado ? 'green' : 'red'} /></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => openEdit(d)}>✏️</button>
                      <button className="btn-icon btn-danger" onClick={() => remove(d.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Editar médico' : 'Nuevo médico'}>
        <div className="form-grid">
          <FormField label="Nombre"><input value={form.nombre} onChange={e=>f('nombre',e.target.value)} placeholder="Carlos" /></FormField>
          <FormField label="Apellido"><input value={form.apellido} onChange={e=>f('apellido',e.target.value)} placeholder="Martínez" /></FormField>
          <FormField label="Especialidad">
            <select value={form.id_especialidad} onChange={e=>f('id_especialidad', parseInt(e.target.value))}>
              {especialidades.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </FormField>
          <FormField label="Nº Registro"><input value={form.num_registro} onChange={e=>f('num_registro',e.target.value)} placeholder="MED-001" /></FormField>
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