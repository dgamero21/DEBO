# 🏦 Pago — Blueprint de Arquitectura

**App:** Personal Finance Manager
**Stack:** Python 3.11+ / FastAPI / SQLite → PostgreSQL / Jinja2 + HTMX
**Estado:** ⚙️ Speckit initialized (pre-desarrollo)
**Versión:** 1.0.0
**Fecha:** 2026-07-01

---

## 📐 1. Arquitectura General

```
┌─────────────────────────────────────────────┐
│                Browser (HTMX)               │
│        Jinja2 Templates + Bootstrap         │
└─────────────────┬───────────────────────────┘
                  │ HTTP
┌─────────────────▼───────────────────────────┐
│           FastAPI (Python 3.11+)            │
│   REST API  │  Auth JWT  │  Validación      │
└──────┬──────────────────────┬───────────────┘
       │                      │
┌──────▼──────────┐  ┌───────▼──────────────┐
│   SQLAlchemy    │  │   structlog          │
│   ORM + Alembic │  │   Audit Log          │
└──────┬──────────┘  └──────────────────────┘
       │
┌──────▼─────────────────────────────────────┐
│  SQLite (dev) / PostgreSQL (prod)          │
│  Multi-currency ready (ISO 4217)           │
└────────────────────────────────────────────┘
```

---

## 🗄️ 2. Modelo de Datos

### `users`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| email | VARCHAR(255) | Unique, not null |
| password_hash | VARCHAR(255) | bcrypt hash |
| base_currency | CHAR(3) | ISO 4217, default 'MXN' |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `accounts`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| name | VARCHAR(100) | ej. "Cuenta de débito" |
| type | ENUM | checking, savings, credit, cash, investment |
| balance | DECIMAL(15,2) | |
| currency | CHAR(3) | ISO 4217 |
| is_active | BOOLEAN | default true |
| created_at | TIMESTAMP | |

### `transactions`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| account_id | UUID | FK → accounts |
| user_id | UUID | FK → users |
| type | ENUM | income, expense, transfer |
| amount | DECIMAL(15,2) | |
| currency | CHAR(3) | ISO 4217 |
| amount_in_base | DECIMAL(15,2) | convertido a moneda base |
| category_id | UUID | FK → categories |
| description | TEXT | |
| transaction_date | DATE | |
| is_recurring | BOOLEAN | default false |
| created_at | TIMESTAMP | |

### `categories`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users (nullable = default) |
| name | VARCHAR(100) | ej. "Comida", "Renta" |
| icon | VARCHAR(50) | emoji o icon name |
| type | ENUM | income, expense |
| parent_id | UUID | FK → categories (self) |

### `audit_log` (Inmutable)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| action | VARCHAR(50) | CREATE, UPDATE, DELETE |
| entity_type | VARCHAR(50) | transaction, account, etc. |
| entity_id | UUID | |
| old_values | JSONB | snapshot anterior |
| new_values | JSONB | snapshot nuevo |
| timestamp | TIMESTAMP | |
| ip_address | VARCHAR(45) | |

### `budgets`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| category_id | UUID | FK → categories |
| amount | DECIMAL(15,2) | límite mensual |
| month | DATE | primer día del mes |
| created_at | TIMESTAMP | |

### `exchange_rates`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| from_currency | CHAR(3) | |
| to_currency | CHAR(3) | |
| rate | DECIMAL(15,6) | |
| date | DATE | |
| source | VARCHAR(50) | API externa |

---

## 📡 3. API REST (FastAPI)

### Auth

```
POST   /api/auth/register     → Crear cuenta
POST   /api/auth/login        → JWT access + refresh
POST   /api/auth/refresh      → Renovar token
```

### Accounts

```
GET    /api/accounts          → Listar cuentas
POST   /api/accounts          → Crear cuenta
GET    /api/accounts/{id}     → Detalle cuenta
PATCH  /api/accounts/{id}     → Editar cuenta
DELETE /api/accounts/{id}     → Eliminar cuenta
```

### Transactions

```
GET    /api/transactions      → Listar (filtros: fecha, categoría, cuenta)
POST   /api/transactions      → Crear transacción
GET    /api/transactions/{id} → Detalle
PATCH  /api/transactions/{id} → Editar (con audit log)
DELETE /api/transactions/{id} → Eliminar
```

### Categories

```
GET    /api/categories        → Listar categorías
POST   /api/categories        → Crear
PATCH  /api/categories/{id}   → Editar
DELETE /api/categories/{id}   → Eliminar
```

### Reports

```
GET    /api/reports/balance   → Balance general
GET    /api/reports/monthly   → Gastos/ingresos del mes
GET    /api/reports/budgets   → Progreso de presupuestos
GET    /api/reports/trends    → Tendencias (multi-moneda)
```

### Budgets

```
GET    /api/budgets           → Listar presupuestos activos
POST   /api/budgets           → Crear presupuesto
PATCH  /api/budgets/{id}      → Ajustar
```

---

## 🎨 4. UI / Flujo de Usuario

```
Login/Register
    │
    ▼
Dashboard (resumen del mes)
    ├── Balance total (en moneda base)
    ├── Ingresos vs Gastos (chart)
    ├── Últimas 5 transacciones
    └── Presupuestos (barra de progreso)
    │
    ├── Transacciones (CRUD con filtros)
    │   ├── Lista paginada + búsqueda
    │   └── Modal crear/editar (HTMX)
    │
    ├── Cuentas
    │   └── CRUD + balance por cuenta
    │
    ├── Reportes
    │   ├── Mensual (tabla + gráfica)
    │   ├── Por categoría (donut chart)
    │   └── Tendencias (line chart)
    │
    └── Configuración
        ├── Perfil (moneda base, email)
        ├── Categorías (CRUD)
        └── Exportar datos (CSV)
```

**Tecnología frontend:** Jinja2 + HTMX + Alpine.js + Bootstrap\
**Gráficos:** Chart.js (vía CDN)

---

## 🛡️ 5. Seguridad (NON-NEGOTIABLE)

| Aspecto | Implementación |
|---------|---------------|
| Auth | JWT access (15min) + refresh (7d) con httpOnly cookies |
| Passwords | bcrypt (work_factor=12) |
| Cifrado DB | AES-256 en reposo (SQLCipher opcional) |
| Transporte | TLS obligatorio (Let's Encrypt) |
| Input validation | Pydantic v2 estricto en todos los endpoints |
| Audit trail | Tabla `audit_log` — toda escritura queda registrada |
| No log sensible | structlog con filtro de campos PII/financieros |
| Rate limiting | slowapi (100 req/min por usuario) |

---

## 🗺️ 6. Roadmap (MVP → V1)

### Fase 0 — Setup (día 1-2)

- [x] Speckit init + Constitution
- [ ] FastAPI project scaffold
- [ ] SQLAlchemy models + Alembic migrations
- [ ] Docker + docker-compose
- [ ] pytest setup + primera batería de tests

### Fase 1 — Core (día 3-5)

- [ ] Auth (register/login/refresh JWT)
- [ ] CRUD Accounts
- [ ] CRUD Transactions + validación
- [ ] CRUD Categories (defaults + custom)
- [ ] Dashboard básico

### Fase 2 — Reportes (día 6-8)

- [ ] Reporte mensual (ingresos/gastos)
- [ ] Reporte por categoría
- [ ] Presupuestos + alertas
- [ ] Multi-moneda (conversión automática)

### Fase 3 — UX (día 9-10)

- [ ] HTMX interactions (sin reload)
- [ ] Chart.js visualizaciones
- [ ] Export CSV
- [ ] UX pulido

---

## 📁 7. Estructura de Archivos Propuesta

```
C:\Users\dgame\pago\
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app
│   ├── config.py             # Settings (Pydantic)
│   ├── database.py           # SQLAlchemy engine
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── account.py
│   │   ├── transaction.py
│   │   ├── category.py
│   │   ├── budget.py
│   │   └── audit_log.py
│   ├── schemas/              # Pydantic models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── account.py
│   │   └── transaction.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── accounts.py
│   │   ├── transactions.py
│   │   ├── categories.py
│   │   ├── budgets.py
│   │   └── reports.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── transaction_service.py
│   │   └── report_service.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── dashboard.html
│   │   ├── transactions/
│   │   ├── accounts/
│   │   ├── reports/
│   │   └── auth/
│   └── static/
│       ├── css/
│       └── js/
├── tests/
│   ├── conftest.py
│   ├── test_models/
│   ├── test_api/
│   └── test_services/
├── migrations/               # Alembic
├── alembic.ini
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── pyproject.toml
├── pytest.ini
└── README.md
```

---

## 📋 8. Convenciones

| Tipo | Formato |
|------|---------|
| Commits | `feat:`, `fix:`, `test:`, `docs:`, `refactor:` |
| Commits con breaking | `feat!: descripción` |
| Branching | `main` (solo, sin PRs en MVP) |
| Tests | pytest, nombrados `test_*.py` |
| TDD | Red → Green → Refactor siempre |

---

## 🏛️ 9. Principios Rectores (de la Constitution)

1. **Security & Data Privacy (NON-NEGOTIABLE)** — Cifrado en reposo y tránsito, JWT + refresh tokens, validación Pydantic, nunca loguear datos financieros en texto plano.
2. **Simplicity First (MVP)** — YAGNI, SQLite local → PostgreSQL prod, REST limpio, UI sin frameworks complejos.
3. **Test-Driven Development** — Red-Green-Refactor obligatorio para lógica financiera, ≥80% cobertura en core.
4. **Observability & Accountability** — Toda transacción en `audit_log` inmutable con timestamp, usuario, acción, snapshots.
5. **Multi-Currency Ready** — Tipo de cambio histórico por transacción, moneda base configurable, ISO 4217.

---

> **Version:** 1.0.0 | **Ratified:** 2026-06-30 | **Last Amended:** 2026-07-01
