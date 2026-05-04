# EcoRun Sevilla

Plataforma gamificada de eco-running social que incentiva el transporte sostenible en Sevilla. Los usuarios acumulan **EcoPuntos** por cada kilómetro recorrido, contribuyendo a reducir emisiones de CO₂ y reforestar el planeta.

---

## Stack tecnologico

### Frontend
| Tecnologia | Version |
|---|---|
| React | 19.2.5 |
| Vite | 8.0.10 |
| React Router DOM | 7.14.2 |
| Tailwind CSS | 3.4.19 |
| Framer Motion | 12.38.0 |
| Axios | 1.16.0 |
| Lucide React | 1.14.0 |

### Backend
| Tecnologia | Version |
|---|---|
| Node.js + Express | 5.2.1 |
| MySQL 2 | 3.16.3 |
| JWT | 9.0.3 |
| bcryptjs | 3.0.3 |
| Express Validator | 7.3.1 |
| Helmet | 8.1.0 |
| Jest + Supertest | 29.7.0 |

---

## Funcionalidades

- **Autenticacion** — Registro e inicio de sesion con JWT y contraseñas cifradas con bcrypt
- **Seguimiento de carreras** — Registra distancia, duracion, tiempo de inicio/fin y puntos ganados
- **Sistema de desafios** — Retos por zonas de Sevilla (Norte, Sur, Centro, Triana, Este) con categorias, dificultad y recompensas
- **Gamificacion** — EcoPuntos, niveles de usuario (1-7+), logros y tabla de clasificacion
- **Impacto ambiental** — Visualizacion de arboles salvados, CO₂ evitado y kilometros totales
- **Mapa de desafios** — Vista geografica de los retos activos en Sevilla

---

## Estructura del proyecto

```
ecorun/
├── ecorunfrontend/          # Aplicacion React
│   ├── src/
│   │   ├── pages/           # Vistas: Home, Login, Register, Dashboard, Challenges, Map
│   │   ├── components/
│   │   │   ├── ui/          # Button, Input, Badge, ProgressBar, LoadingSpinner
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   └── shared/      # Componentes reutilizables
│   │   ├── layouts/         # PublicLayout, AuthLayout, AppLayout
│   │   ├── context/         # AuthContext (estado global de autenticacion)
│   │   ├── services/        # api.js, authService.js, challengeService.js
│   │   ├── hooks/           # Custom hooks
│   │   ├── data/            # Mock data para desarrollo
│   │   └── utils/           # Funciones utilitarias
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── ecorunbackend/           # API REST Node.js
    ├── src/
    │   ├── config/db.js     # Conexion MySQL (pool de 10 conexiones)
    │   └── middleware/      # authMiddleware, errorHandler, validation
    ├── models/              # UserModel, RunModel, ChallengeModel
    ├── controllers/         # AuthController, RunController, ChallengeController
    ├── services/            # AuthService, RunService, ChallengeService
    ├── routes/              # auth.js, runs.js, challenges.js
    ├── tests/               # Jest + Supertest
    ├── postman_collection.json
    └── server.js
```

---

## Instalacion y puesta en marcha

### Requisitos previos
- Node.js >= 18
- MySQL >= 8.0

### 1. Backend

```bash
cd ecorunbackend
npm install
```

Crea el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

```env
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=ecorun_sevilla
DB_PORT=3306

JWT_SECRET=cambia_esto_por_un_secreto_seguro
```

Crea la base de datos en MySQL:

```sql
CREATE DATABASE ecorun_sevilla;
```

Inicia el servidor:

```bash
npm run dev       # desarrollo (nodemon)
npm start         # produccion
```

El servidor arranca en `http://localhost:8080`.

### 2. Frontend

```bash
cd ecorunfrontend
npm install
```

Crea el archivo `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

Inicia la aplicacion:

```bash
npm run dev
```

La app estara disponible en `http://localhost:5173`.

---

## Scripts disponibles

### Frontend
| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run preview` | Previsualizar build |
| `npm run lint` | Linting con ESLint |

### Backend
| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor con hot-reload (nodemon) |
| `npm start` | Servidor de produccion |
| `npm test` | Ejecutar tests |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Informe de cobertura |

---

## API Endpoints

### Autenticacion — `/api/auth`
| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| POST | `/register` | Crear cuenta nueva | No |
| POST | `/login` | Iniciar sesion | No |

### Carreras — `/api/runs`
| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| POST | `/` | Crear carrera | Si |
| GET | `/user/:userId` | Carreras de un usuario | Si |
| GET | `/:id` | Detalle de carrera | Si |
| PUT | `/:id` | Actualizar carrera | Si |
| DELETE | `/:id` | Eliminar carrera | Si |

### Desafios — `/api/challenges`
| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| GET | `/` | Listar desafios activos | No |
| GET | `/:id` | Detalle de desafio | No |
| GET | `/user/:userId` | Desafios de un usuario | Si |
| POST | `/:id/join` | Unirse a un desafio | Si |
| PUT | `/user/:userChallengeId/progress` | Actualizar progreso | Si |

> La documentacion completa de la API esta disponible en `ecorunbackend/postman_collection.json`.

---

## Base de datos

```
users
  id, username, email, password_hash, eco_points, role, created_at

runs
  id, user_id, run_name, description, distance_km, duration_minutes
  start_time, end_time, run_date, points_earned, created_at

challenges
  id, name, description, goal_type, goal_value, reward_points
  difficulty, category, start_date, end_date, active

user_challenges
  id, user_id, challenge_id, status, progress, joined_at
```

---

## Variables de entorno

### Frontend (`.env`)
| Variable | Descripcion | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:3000/api` |

### Backend (`.env`)
| Variable | Descripcion |
|---|---|
| `PORT` | Puerto del servidor |
| `NODE_ENV` | Entorno (`development` / `production`) |
| `FRONTEND_URL` | URL del frontend (CORS) |
| `DB_HOST` | Host de MySQL |
| `DB_USER` | Usuario de MySQL |
| `DB_PASSWORD` | Contrasena de MySQL |
| `DB_NAME` | Nombre de la base de datos |
| `DB_PORT` | Puerto de MySQL |
| `JWT_SECRET` | Secreto para firmar tokens JWT |

---

## Rutas de la aplicacion

| Ruta | Vista | Acceso |
|---|---|---|
| `/` | Home | Publico |
| `/login` | Inicio de sesion | Solo no autenticado |
| `/register` | Registro | Solo no autenticado |
| `/dashboard` | Panel de usuario | Requiere auth |
| `/challenges` | Lista de desafios | Requiere auth |
| `/map` | Mapa de desafios | Requiere auth |

---

## Seguridad

- Contrasenas cifradas con **bcryptjs**
- Tokens de sesion con **JWT** (expiracion configurable)
- Cabeceras HTTP securizadas con **Helmet**
- Proteccion CORS restringida al frontend
- Validacion de entrada con **express-validator**
- Variables sensibles gestionadas por `.env` (nunca en el repositorio)

---

## Licencia

Proyecto educativo — 2º DAW
