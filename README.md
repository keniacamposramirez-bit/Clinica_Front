# ClinicApp — Frontend React

Sistema de gestión médica construido en React, diseñado para conectar con tu backend Laravel/Node.

## 🚀 Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar la URL del backend
cp .env.example .env
# Edita .env y cambia REACT_APP_API_URL a la URL de tu backend

# 3. Arrancar en desarrollo
npm start
```

El app corre en: http://localhost:3000

---

## ⚙️ Configuración del backend

Edita el archivo `.env`:

```
REACT_APP_API_URL=http://localhost:8000/api
```

### Endpoints esperados

| Módulo         | Endpoint base          |
|----------------|------------------------|
| Auth           | POST /auth/login        |
| Pacientes      | /pacientes              |
| Citas          | /citas                  |
| Doctores       | /doctores               |
| Expedientes    | /expedientes            |
| Recetas        | /recetas                |
| Notificaciones | /notificaciones         |
| Usuarios       | /users                  |
| Roles          | /roles                  |
| Catálogos      | /catalogos/generos, /catalogos/grupos-sanguineos, etc. |

### Autenticación

- El login debe devolver: `{ token: "..." }` o `{ access_token: "..." }`
- El endpoint `/auth/me` debe devolver el usuario autenticado
- Se usa Bearer Token en el header `Authorization`

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── layout/    # Sidebar + Layout principal
│   └── ui/        # Componentes reutilizables (Button, Modal, Table, etc.)
├── context/       # AuthContext
├── hooks/         # useApi, useAsyncAction
├── pages/         # Dashboard, Pacientes, Citas, Doctores, etc.
└── services/      # api.js — instancia Axios + todos los servicios
```

---

## 🔧 Personalización

- **URL del backend**: variable de entorno `REACT_APP_API_URL`
- **Respuestas de la API**: `src/hooks/useApi.js` — ajusta `res.data?.data ?? res.data` según la estructura de tu respuesta
- **Colores**: `src/index.css` — variables CSS en `:root`
