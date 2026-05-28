import React, { useEffect, useRef } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import styles from './UI.module.css';

/* ─── Button ───────────────────────────────────────────────────────────────── */
export function Button({
  children, variant = 'primary', size = 'md',
  loading = false, icon, onClick, type = 'button',
  disabled, className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${styles.btn} ${styles[`btn-${variant}`]} ${styles[`btn-${size}`]} ${className}`}
    >
      {loading ? <Spinner size="sm" /> : icon && <span className={styles.btnIcon}>{icon}</span>}
      {children}
    </button>
  );
}

/* ─── Badge ────────────────────────────────────────────────────────────────── */
const BADGE_COLORS = {
  default: '#7a92b8',
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  teal: '#14b8a6',
};
export function Badge({ children, color = 'default', dot = false }) {
  const c = BADGE_COLORS[color] || color;
  return (
    <span className={styles.badge} style={{ '--badge-color': c }}>
      {dot && <span className={styles.badgeDot} />}
      {children}
    </span>
  );
}

/* ─── Spinner ──────────────────────────────────────────────────────────────── */
export function Spinner({ size = 'md' }) {
  return <span className={`${styles.spinner} ${styles[`spinner-${size}`]}`} />;
}

/* ─── Card ─────────────────────────────────────────────────────────────────── */
export function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div className={`${styles.card} ${padding ? styles.cardPad : ''} ${hover ? styles.cardHover : ''} ${className}`}>
      {children}
    </div>
  );
}

/* ─── Section header ───────────────────────────────────────────────────────── */
export function SectionHeader({ title, subtitle, actions }) {
  return (
    <div className={styles.sectionHeader}>
      <div>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.sectionActions}>{actions}</div>}
    </div>
  );
}

/* ─── Modal ────────────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, size = 'md' }) {
  const overlayRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={styles.modalOverlay} ref={overlayRef} onClick={(e) => e.target === overlayRef.current && onClose()}>
      <div className={`${styles.modal} ${styles[`modal-${size}`]}`}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.modalClose} onClick={onClose}><X size={18} /></button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

/* ─── Form inputs ──────────────────────────────────────────────────────────── */
export function FormField({ label, error, children, required }) {
  return (
    <div className={styles.formField}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}>*</span>}</label>}
      {children}
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}

export function Input({ ...props }) {
  return <input className={styles.input} {...props} />;
}

export function Textarea({ ...props }) {
  return <textarea className={styles.textarea} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={styles.select} {...props}>
      {children}
    </select>
  );
}

/* ─── Table ────────────────────────────────────────────────────────────────── */
export function Table({ columns, data, loading, emptyMessage = 'Sin registros', onRowClick }) {
  if (loading) return <div className={styles.tableLoading}><Spinner /> <span>Cargando...</span></div>;
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(!data || data.length === 0) ? (
            <tr><td colSpan={columns.length} className={styles.tableEmpty}>{emptyMessage}</td></tr>
          ) : data.map((row, i) => (
            <tr key={row.id ?? i} onClick={() => onRowClick?.(row)} className={onRowClick ? styles.rowClickable : ''}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Empty state ──────────────────────────────────────────────────────────── */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className={styles.emptyState}>
      {icon && <div className={styles.emptyIcon}>{icon}</div>}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

/* ─── Alert ────────────────────────────────────────────────────────────────── */
const ALERT_ICONS = { error: AlertCircle, success: CheckCircle, info: Info };
export function Alert({ type = 'info', message }) {
  if (!message) return null;
  const Icon = ALERT_ICONS[type];
  return (
    <div className={`${styles.alert} ${styles[`alert-${type}`]}`}>
      <Icon size={16} /> <span>{message}</span>
    </div>
  );
}

/* ─── Search input ─────────────────────────────────────────────────────────── */
export function SearchInput({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className={styles.searchWrap}>
      <svg className={styles.searchIcon} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        className={styles.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

/* ─── Stat card ────────────────────────────────────────────────────────────── */
export function StatCard({ label, value, icon, color = 'primary', trend }) {
  return (
    <Card className={styles.statCard}>
      <div className={styles.statIcon} style={{ '--stat-color': BADGE_COLORS[color] || color }}>{icon}</div>
      <div className={styles.statInfo}>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value ?? '—'}</p>
        {trend && <p className={styles.statTrend}>{trend}</p>}
      </div>
    </Card>
  );
}
