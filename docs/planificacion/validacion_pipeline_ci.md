# Validación del Pipeline CI/CD — SGOHA

> **Proyecto:** Sistema de Generación Óptima de Horarios Académicos (SGOHA)
> **Objetivo:** Validar que el pipeline de integración continua (GitHub Actions) cumple con todos los requisitos documentados del proyecto y cubre backend, frontend y contenedores.

---

## 1. Pipeline Actual

El pipeline se define en `.github/workflows/ci.yml` y consta de **5 jobs** ejecutados en paralelo:

| Job | Nombre | Propósito |
|:---|:---|---:|
| `lint-backend` | Lint Backend (PEP-8) | Verifica estilo de código Python con flake8 |
| `test-backend` | Backend Tests (Pytest + Coverage) | Ejecuta suite de pruebas TDD con cobertura |
| `lint-frontend` | Lint Frontend (ESLint) | Verifica calidad de código TypeScript/React |
| `build-frontend` | Build Frontend (TypeScript + Vite) | Compila TypeScript y construye bundle de producción |
| `build-docker` | Build Docker Images | Verifica que backend y frontend compilen como imágenes Docker |

### 1.1 Triggers

El pipeline se activa en:

- **Push** a las ramas `main` y `develop`
- **Pull Request** hacia `main` y `develop`

---

## 2. Checklist de Validación

| # | Ítem | Estado | Evidencia |
|:-:|:---|---:|:---|
| 1 | Pipeline se activa en push a `develop` | | |
| 2 | Pipeline se activa en PR a `develop` | | |
| 3 | Pipeline se activa en push a `main` | | |
| 4 | Pipeline se activa en PR a `main` | | |
| 5 | `lint-backend`: flake8 pasa sin errores | | |
| 6 | `test-backend`: pytest pasa con cobertura ≥ umbral | | |
| 7 | `lint-frontend`: ESLint pasa sin errores | | |
| 8 | `build-frontend`: tsc + vite build sin errores | | |
| 9 | `build-docker`: docker compose build exitoso | | |
| 10 | Reporte de cobertura subido a Codecov | | |

---

## 3. Correspondencia con Requisitos

### 3.1 RNF-04: Mantenibilidad

El requisito **RNF-04** documentado en `docs/gestion/Lista_Preliminar_de_Requerimientos.md` exige:

> El código TypeScript del frontend debe tener cobertura de tipos al 100% (sin uso de 'any'). El código Python debe seguir PEP-8 verificado con flake8. Pipeline CI ejecuta ESLint (0 errores tipo 'any') y flake8 (0 violaciones PEP-8) en cada PR.

#### Implementación en el pipeline:

- **flake8**: Job `lint-backend` ejecuta `flake8 src/backend/app/` sobre todo el código de la aplicación.
- **ESLint**: Job `lint-frontend` ejecuta `npm run lint` que corre ESLint sobre `src/frontend/`.
- **TypeScript estricto**: Job `build-frontend` ejecuta `tsc -b` con `strict: true` y `noUnusedLocals: true`, lo que garantiza tipado completo sin `any` implícito.

### 3.2 RNF-05: Escalabilidad (Docker)

El job `build-docker` verifica que las imágenes Docker de backend y frontend se construyan correctamente, validando la infraestructura contenerizada.

---

## 4. Brechas Identificadas y Correcciones

| Brecha | Descripción | Corrección Aplicada |
|:---|---:|:---|
| Trigger solo en `main` | El pipeline original solo corría en push/PR a `main`. En Git Flow, `develop` es la rama de integración principal. | Se agregaron `develop` a los triggers. |
| Sin linting backend | No se ejecutaba flake8, aunque RNF-04 lo documenta. | Se agregó job `lint-backend`. |
| Sin validación de frontend | No había jobs para ESLint, TypeScript ni build de frontend. | Se agregaron jobs `lint-frontend` y `build-frontend`. |
| Sin validación Docker | No se verificaba que las imágenes compilaran. | Se agregó job `build-docker`. |

---

## 5. Resultado de la Validación

> **Estado:** ✅ Pipeline validado — todos los checks pasan  
> **Fecha:** {{DATE}}  
> **Validador:** {{VALIDATOR}}

