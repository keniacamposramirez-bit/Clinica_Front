export function Avatar({ name, index }) {
  const colors = ['av-teal','av-blue','av-coral','av-purple','av-amber']
  const parts = name.trim().split(' ')
  const initials = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase()
  return <div className={`avatar ${colors[index % 5]}`}>{initials}</div>
}

export function Pill({ label, type }) {
  return <span className={`pill pill-${type}`}>{label}</span>
}

export function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function FormField({ label, children }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {children}
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-wrap">
      <span className="search-icon"></span>
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Buscar...'}
      />
    </div>
  )
}
