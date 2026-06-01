# Presupuesto del Proyecto SGOHA

> Análisis económico integral del Sistema de Generación Óptima de Horarios Académicos, incluyendo costos por recursos humanos, infraestructura tecnológica, costos indirectos, evolución temporal y análisis de sostenibilidad (Green Software).

---

## 1. Fuentes de Costos

### 1.1 Recursos Humanos (RRHH)

El equipo está compuesto por 4 integrantes trabajando bajo el marco Scrum en sprints de 2 semanas. La valoración se realiza con tarifa referencial de mercado peruano para perfiles junior/mid en tecnología.

| Rol | Integrante | Horas/Sprint | Tarifa Hora (S/.) | Costo/Sprint (S/.) |
|:---|:---|:---:|:---:|:---:|
| Product Owner | Jose Bacilio de la Cruz | 12 | 25.00 | 300.00 |
| Scrum Master | Diego Oré Gonzales | 14 | 25.00 | 350.00 |
| Desarrollador Backend / CSP | Aldo Requena Lavi | 20 | 30.00 | 600.00 |
| Desarrollador Frontend | Luis Gutierrez Taipe | 20 | 30.00 | 600.00 |
| **Subtotal RRHH/Sprint** | | **66 h** | | **S/. 1,850.00** |

### 1.2 Infraestructura Tecnológica

| Concepto | Costo Unitario (S/.) | Frecuencia | Costo Total (S/.) |
|:---|:---:|:---|:---:|
| Equipos de desarrollo (4 laptops, amortización 3 años) | 125.00/mes × 4 | 4 meses | 2,000.00 |
| Servidor VPS para staging (DigitalOcean/Render) | 50.00/mes | 4 meses | 200.00 |
| Dominio + SSL (opcional) | 60.00/año | 1 vez | 60.00 |
| Internet (promedio equipo) | 80.00/mes × 4 | 4 meses | 1,280.00 |
| **Subtotal Infraestructura** | | | **S/. 3,540.00** |

### 1.3 Software y Licencias

| Herramienta | Costo | Justificación |
|:---|:---:|:---|
| Python 3.11 + FastAPI | S/. 0.00 | Open source |
| React 18 + Vite + TypeScript | S/. 0.00 | Open source |
| Google OR-Tools (CP-SAT) | S/. 0.00 | Open source (Apache 2.0) |
| PostgreSQL 15 | S/. 0.00 | Open source |
| Docker + Docker Compose | S/. 0.00 | Free tier suficiente |
| GitHub (repositorio privado) | S/. 0.00 | Free para equipos ≤ 5 |
| Jira (plan gratuito) | S/. 0.00 | Free tier (≤ 10 usuarios) |
| **Subtotal Licencias** | **S/. 0.00** | Stack 100% open source |

### 1.4 Costos Indirectos

| Concepto | Costo (S/.) | Notas |
|:---|:---:|:---|
| Electricidad (desarrollo) | 160.00 | 4 equipos × 4 meses × S/.10/mes estimado |
| Material de oficina/papelería | 50.00 | Documentación impresa |
| Comunicaciones (WhatsApp, Meet) | 0.00 | Incluido en planes personales |
| Capacitación (OR-Tools, FastAPI) | 0.00 | Documentación oficial gratuita + Google Antigravity |
| Contingencia (10% del total) | 555.00 | Cobertura de riesgos imprevistos |
| **Subtotal Indirectos** | **S/. 765.00** |

---

## 2. Evolución de Costos

### 2.1 Costos por Sprint

El proyecto se ejecuta en **6 Sprints** de 2 semanas cada uno, distribuidos secuencialmente a lo largo del semestre académico (Marzo – Junio 2026). Las semanas entre sprints se destinan a ceremonias Scrum e inspecciones.

| Sprint | Duración | Objetivo Principal | RRHH (S/.) | Infra (S/.) | Total Sprint (S/.) |
|:---:|:---|:---|:---:|:---:|:---:|
| Sprint 0 | 09–22 Mar | Setup: Docker, DB, Auth, Exploración OR-Tools | 1,850.00 | 585.00 | 2,435.00 |
| Sprint 1 | 23 Mar–05 Abr | CRUD: Cursos, Aulas, Secciones | 1,850.00 | 585.00 | 2,435.00 |
| Sprint 2 | 13–26 Abr | Motor CP-SAT v1 (restricciones duras) | 1,850.00 | 585.00 | 2,435.00 |
| Sprint 3 | 27 Abr–10 May | Dashboard, Filtros, UX | 1,850.00 | 585.00 | 2,435.00 |
| Sprint 4 | 18–31 May | Soft constraints, benchmark, TDD | 1,850.00 | 585.00 | 2,435.00 |
| Sprint 5 | 01–14 Jun | Optimización, documentación, entrega | 1,850.00 | 590.00 | 2,440.00 |
| **TOTAL** | | | **S/. 11,100.00** | **S/. 3,515.00** | **S/. 14,615.00** |

### 2.2 Costo Acumulado del Proyecto

```
Sprint │ Costo Sprint │ Costo Acumulado
───────┼──────────────┼────────────────
  S0   │  S/. 2,435   │   S/. 2,435
  S1   │  S/. 2,435   │   S/. 4,870
  S2   │  S/. 2,435   │   S/. 7,305
  S3   │  S/. 2,435   │   S/. 9,740
  S4   │  S/. 2,435   │   S/. 12,175
  S5   │  S/. 2,440   │   S/. 14,615
───────┴──────────────┴────────────────
  + Indirectos:         S/.    765
  ═════════════════════════════════════
  COSTO TOTAL PROYECTO: S/. 15,380.00
```

### 2.3 Distribución Porcentual

| Categoría | Monto (S/.) | % del Total |
|:---|:---:|:---:|
| Recursos Humanos | 11,100.00 | 72.2% |
| Infraestructura | 3,540.00 | 23.0% |
| Indirectos | 765.00 | 4.8% |
| **TOTAL** | **15,380.00** | **100%** |

---

## 3. Análisis de Costos vs Complejidad del CSP

### 3.1 Relación Complejidad → Costo

El problema de timetabling es **NP-Hard**. Esto impacta directamente en los costos del proyecto:

| Factor de Complejidad CSP | Impacto en Costo | Driver |
|:---|:---|:---|
| **Espacio de búsqueda exponencial** | +40% tiempo de desarrollo del motor | RRHH del Dev Backend (Sprint 2–4) |
| **9 restricciones duras interdependientes** | Requiere expertise en OR-Tools | Curva de aprendizaje en Sprint 0 |
| **Pre-filtrado de variables** | Reduce cómputo pero aumenta código | +20h desarrollo = S/. 600 |
| **Función objetivo multi-componente** | Testing complejo (40 tests) | +15h QA = S/. 450 |
| **Validación de infactibilidad** | Manejo de errores robusto | +8h desarrollo = S/. 240 |

### 3.2 Factores de Incremento de Costos Identificados

| Factor | Incremento Estimado | Estado |
|:---|:---:|:---|
| Complejidad algorítmica NP-Hard | +25% RRHH | **Materializado** — sprint 2 requirió 30% más horas |
| Integración frontend-backend | +10% testing | **Mitigado** — contrato OpenAPI/Swagger |
| Curva de aprendizaje OR-Tools | +15% Sprint 0 | **Absorbido** — documentación y Google Antigravity |
| Cambios en requisitos del docente | +5% re-trabajo | **Parcial** — iteraciones de documentación |

### 3.3 Evaluación de Sostenibilidad (Green Software)

El proyecto incorpora principios de **Green Software Engineering** para minimizar el impacto ambiental y optimizar recursos:

| Principio Green Software | Implementación SGOHA | Ahorro Estimado |
|:---|:---|:---|
| **Eficiencia energética** | Pre-filtrado reduce espacio de búsqueda ~70% → menor consumo CPU | -40% energía del solver |
| **Imágenes Docker ligeras** | `python:3.11-slim-bookworm` (< 150MB vs 900MB imagen completa) | -83% almacenamiento |
| **Cache de consultas** | `docentes_cache` pre-computado evita N queries repetidas | -60% I/O a BD |
| **Workers adaptativos** | `num_workers = min(8, cpu_count)` usa solo cores disponibles | Evita desperdicio de recursos |
| **Build multi-stage** | Frontend compilado → Nginx estático (< 50MB producción) | -94% tamaño imagen |
| **Stack open source** | Cero licencias propietarias → cero consumo de infraestructura de licenciamiento | S/. 0 en licencias |

#### Huella de Carbono Estimada (PoC)

| Actividad | Energía Estimada | CO₂ Equiv. |
|:---|:---:|:---:|
| Desarrollo (4 laptops × 3 meses) | 360 kWh | 54 kg CO₂e |
| Servidor staging (VPS compartido) | 36 kWh | 5.4 kg CO₂e |
| Ejecución solver (promedio) | 0.005 kWh/ejecución | ~0.001 kg CO₂e |
| **Total proyecto** | **~396 kWh** | **~59.4 kg CO₂e** |

> **Comparación:** Un proceso manual de 4 semanas consume ~80 kWh en coordinación presencial + papel impreso. El SGOHA automatiza este proceso reduciendo el consumo energético operativo en un **95%** post-implementación.

---

## 4. Retorno de Inversión (ROI) Estimado

| Concepto | Valor |
|:---|:---|
| Costo total del proyecto | S/. 15,380 |
| Costo actual del proceso manual/semestre | S/. 8,000 (2-4 semanas × coordinadores) |
| Ahorro por semestre con SGOHA | S/. 7,500 (reducción a minutos) |
| **Punto de equilibrio** | **2° semestre de uso** |
| ROI a 2 años (4 semestres) | **94.7%** |
