# Pago Constitution
<!-- Personal Finance App Constitution -->

## Core Principles

### I. Security & Data Privacy (NON-NEGOTIABLE)
Los datos financieros son sensibles. Toda API, endpoint o almacenamiento debe implementar: cifrado en reposo y tránsito (TLS + AES-256), autenticación segura (JWT con refresh tokens), y jamás loguear datos financieros en texto plano. Validación estricta de inputs (Pydantic).

### II. Simplicity First (MVP)
Arrancar simple, ir rápido. Usar YAGNI — no agregar funcionalidades "por si acaso". Base de datos local (SQLite) para desarrollo, PostgreSQL para producción. API REST limpia con FastAPI. UI web sencilla (HTML+JS vanilla o Jinja2) sin frameworks complejos al inicio.

### III. Test-Driven Development
TDD obligatorio para toda la lógica financiera: cálculos, balances, validaciones. Red-Green-Refactor. Tests unitarios con pytest (mínimo 80% cobertura en lógica core). Tests de integración para endpoints de transacciones y reportes.

### IV. Observability & Accountability
Toda transacción financiera debe quedar registrada en un log inmutable (tabla `audit_log`). Cada operación de escritura (crear/editar/eliminar transacción) debe tener: timestamp, usuario, acción, datos anteriores/nuevos. Structured logging con structlog.

### V. Multi-Currency Ready
La arquitectura debe soportar multi-moneda desde el día 1: tipo de cambio histórico por transacción, moneda base configurable, y conversión en reportes. Usar ISO 4217 para códigos de moneda.

## Technology Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.11+ / FastAPI |
| Base de datos | SQLite (dev) / PostgreSQL (prod) |
| ORM | SQLAlchemy 2.0 + Alembic (migrations) |
| Validación | Pydantic v2 |
| Auth | JWT (python-jose) + bcrypt |
| Testing | pytest + pytest-cov |
| Logging | structlog |
| Frontend | Jinja2 + HTMX + Bootstrap (simple) |
| Contenedor | Docker + docker-compose |

## Development Workflow (Solo)

1. **Specify** → definir especificación de la feature en `specs/`
2. **Plan** → desglose en tareas pequeñas
3. **TDD** → test → fail → implement → refactor
4. **Commit** → conventional commits (`feat:`, `fix:`, `test:`, etc.)
5. **Iterar** → ciclo rápido sin PRs (solo main branch al inicio)

## Governance

- La constitución prevalece sobre cualquier práctica ad-hoc
- Enmiendas requieren actualizar este documento con fecha
- No comprometer seguridad por velocidad — toda deuda técnica de seguridad debe documentarse en un issue
- Usar `constitution.md` como guía para decisiones de arquitectura

**Version**: 1.0.0 | **Ratified**: 2026-06-30 | **Last Amended**: 2026-06-30
