import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth token ──────────────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: ()           => api.post('/auth/logout'),
  me:     ()           => api.get('/auth/me'),
};

// ── Pacientes ─────────────────────────────────────────────────────────────────
export const pacienteService = {
  getAll:  (params)      => api.get('/pacientes', { params }),
  getById: (id)          => api.get(`/pacientes/${id}`),
  create:  (data)        => api.post('/pacientes', data),
  update:  (id, data)    => api.put(`/pacientes/${id}`, data),
  delete:  (id)          => api.delete(`/pacientes/${id}`),
  // sub-recursos
  getExpedientes: (id)   => api.get(`/pacientes/${id}/expedientes`),
  getCitas:       (id)   => api.get(`/pacientes/${id}/citas`),
  getContactos:   (id)   => api.get(`/pacientes/${id}/contactos`),
  getDirecciones: (id)   => api.get(`/pacientes/${id}/direcciones`),
};

// ── Citas ─────────────────────────────────────────────────────────────────────
export const citaService = {
  getAll:  (params)   => api.get('/citas', { params }),
  getById: (id)       => api.get(`/citas/${id}`),
  create:  (data)     => api.post('/citas', data),
  update:  (id, data) => api.put(`/citas/${id}`, data),
  delete:  (id)       => api.delete(`/citas/${id}`),
  updateEstado: (id, estado) => api.patch(`/citas/${id}/estado`, { id_estado_cita: estado }),
};

// ── Doctores ──────────────────────────────────────────────────────────────────
export const doctorService = {
  getAll:  (params)   => api.get('/doctores', { params }),
  getById: (id)       => api.get(`/doctores/${id}`),
  create:  (data)     => api.post('/doctores', data),
  update:  (id, data) => api.put(`/doctores/${id}`, data),
  delete:  (id)       => api.delete(`/doctores/${id}`),
  getCitas: (id)      => api.get(`/doctores/${id}/citas`),
};

// ── Expedientes ───────────────────────────────────────────────────────────────
export const expedienteService = {
  getAll:  (params)   => api.get('/expedientes', { params }),
  getById: (id)       => api.get(`/expedientes/${id}`),
  create:  (data)     => api.post('/expedientes', data),
  update:  (id, data) => api.put(`/expedientes/${id}`, data),
  getDiagnosticos: (id) => api.get(`/expedientes/${id}/diagnosticos`),
};

// ── Diagnósticos ──────────────────────────────────────────────────────────────
export const diagnosticoService = {
  getAll:  (params)   => api.get('/diagnosticos', { params }),
  getById: (id)       => api.get(`/diagnosticos/${id}`),
  create:  (data)     => api.post('/diagnosticos', data),
  update:  (id, data) => api.put(`/diagnosticos/${id}`, data),
  delete:  (id)       => api.delete(`/diagnosticos/${id}`),
};

// ── Recetas ───────────────────────────────────────────────────────────────────
export const recetaService = {
  getAll:  (params)   => api.get('/recetas', { params }),
  getById: (id)       => api.get(`/recetas/${id}`),
  create:  (data)     => api.post('/recetas', data),
  update:  (id, data) => api.put(`/recetas/${id}`, data),
  delete:  (id)       => api.delete(`/recetas/${id}`),
};

// ── Notificaciones ────────────────────────────────────────────────────────────
export const notificacionService = {
  getAll:    (params)   => api.get('/notificaciones', { params }),
  marcarLeida: (id)     => api.patch(`/notificaciones/${id}/leida`),
  marcarTodasLeidas: () => api.patch('/notificaciones/todas-leidas'),
};

// ── Catálogos ─────────────────────────────────────────────────────────────────
export const catalogoService = {
  generos:         () => api.get('/catalogos/generos'),
  gruposSanguineos:() => api.get('/catalogos/grupos-sanguineos'),
  tiposContacto:   () => api.get('/catalogos/tipos-contacto'),
  estadosCita:     () => api.get('/catalogos/estados-cita'),
  especialidades:  () => api.get('/catalogos/especialidades'),
  medicamentos:    () => api.get('/catalogos/medicamentos'),
  tiposTratamiento:() => api.get('/catalogos/tipos-tratamiento'),
};

// ── Usuarios / Roles ──────────────────────────────────────────────────────────
export const userService = {
  getAll:  (params)   => api.get('/users', { params }),
  getById: (id)       => api.get(`/users/${id}`),
  create:  (data)     => api.post('/users', data),
  update:  (id, data) => api.put(`/users/${id}`, data),
  delete:  (id)       => api.delete(`/users/${id}`),
};

export const roleService = {
  getAll:  ()         => api.get('/roles'),
  getById: (id)       => api.get(`/roles/${id}`),
  create:  (data)     => api.post('/roles', data),
  update:  (id, data) => api.put(`/roles/${id}`, data),
};

export default api;
