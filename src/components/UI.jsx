/// Componente Avatar
export function Avatar({ name, index }) {

  // Colores disponibles para los avatares
  const colors = [
    'av-teal',
    'av-blue',
    'av-coral',
    'av-purple',
    'av-amber'
  ]

  const parts = name.trim().split(' ')

  const initials =
    (parts[0][0] + (parts[1] ? parts[1][0] : ''))
      .toUpperCase()

  // Retorna el avatar con color dinámico
  return (
    <div className={`avatar ${colors[index % 5]}`}>
      {initials}
    </div>
  )
}


// Muestra etiquetas de estado con color.
export function Pill({ label, type }) {
  return (
    <span className={`pill pill-${type}`}>
      {label}
    </span>
  )
}


// Tarjeta utilizada para mostrar estadísticas en el dashboard.
export function StatCard({ icon, label, value, sub }) {

  return (

    <div className="stat-card">

      {/* Ícono de la tarjeta */}
      <div className="stat-icon">
        {icon}
      </div>

      {/* Valor principal */}
      <div className="stat-value">
        {value}
      </div>

      {/* Título */}
      <div className="stat-label">
        {label}
      </div>

      {/* Texto secundario opcional */}
      {sub && (
        <div className="stat-sub">
          {sub}
        </div>
      )}

    </div>
  )
}


// Ventana emergente reutilizable para
// formularios de crear o editar registros.

export function Modal({
  open,
  onClose,
  title,
  children
}) {

 
  if (!open) return null

  return (

    <div
      className="modal-overlay"
      onClick={e =>
        e.target === e.currentTarget && onClose()
      }
    >

      <div className="modal">

        <div className="modal-header">

          {/* Título del modal */}
          <h2 className="modal-title">
            {title}
          </h2>

          {/* Botón para cerrar */}
          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {/* Contenido dinámico */}
        {children}

      </div>

    </div>
  )
}



// Estructura para campos de formularios

export function FormField({
  label,
  children
}) {

  return (

    <div className="form-field">

      {/* Etiqueta del campo */}
      <label className="form-label">
        {label}
      </label>

      {/* Input, select o textarea */}
      {children}

    </div>
  )
}


// Barra de búsqueda reutilizable.
export function SearchBar({
  value,
  onChange,
  placeholder
}) {

  return (

    <div className="search-wrap">

      {/* Ícono de búsqueda */}
      <span className="search-icon">
      </span>

      <input
        className="search-input"
        type="text"
        value={value}

        // Actualiza el valor de búsqueda
        onChange={e =>
          onChange(e.target.value)
        }

        // Texto por defecto
        placeholder={
          placeholder || 'Buscar...'
        }
      />

    </div>
  )
}