# Guía de Ejecución Individual: Luis Alberto Gutierrez Taipe (Frontend Developer)

Esta guía detalla los pasos exactos, comandos de consola y archivos modificados que corresponden a tu asignación para la **Inspección 07**. Debes utilizar este documento como evidencia de tu trabajo individual y como guía para tu exposición técnica de mañana.

---

## 📋 1. Información de la Asignación
* **Rol:** Desarrollador Frontend
* **Responsabilidad principal:** Implementación de la accesibilidad en la interfaz de usuario bajo la pauta de cumplimiento WCAG 2.2 AA.
* **Nombre de la Rama Gitflow:** `feature/HU-7.3-wcag-accessibility`
* **Archivos Modificados:** [Dashboard.tsx](file:///d:/jose/sistema_taller_proyectos/TallerDeProyecto2/src/frontend/src/pages/Dashboard.tsx), [Classrooms.tsx](file:///d:/jose/sistema_taller_proyectos/TallerDeProyecto2/src/frontend/src/pages/Classrooms.tsx), [Teachers.tsx](file:///d:/jose/sistema_taller_proyectos/TallerDeProyecto2/src/frontend/src/pages/Teachers.tsx), [CrudTable.tsx](file:///d:/jose/sistema_taller_proyectos/TallerDeProyecto2/src/frontend/src/components/CrudTable.tsx)

---

## 🛠️ 2. Guía de Ejecución Paso a Paso (Gitflow)

### Paso 1: Creación de la rama de trabajo
Desde tu terminal local, partiendo de la última versión de `develop`, crea tu rama de funcionalidad:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/HU-7.3-wcag-accessibility
```

### Paso 2: Agregar Propiedades de Accesibilidad en React
En [Dashboard.tsx](file:///d:/jose/sistema_taller_proyectos/TallerDeProyecto2/src/frontend/src/pages/Dashboard.tsx), el panel interactivo de restricciones se programó con elementos enfocables y semántica ARIA. Inspecciona y valida que tu marcado incluya:
* **Iconos Decorativos:**
  ```tsx
  <span className="material-symbols-outlined text-orange-500" aria-hidden="true">settings_suggest</span>
  ```
* **Switches de Restricción:**
  ```tsx
  <button
    onClick={() => handleToggleConfig(cfg.key, !cfg.activa)}
    role="switch"
    aria-checked={cfg.activa}
    aria-label={`Restricción: ${cfg.nombre}`}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#131313] ${
      cfg.activa ? 'bg-orange-500' : 'bg-white/10'
    }`}
    title={cfg.activa ? 'Desactivar' : 'Activar'}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        cfg.activa ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
  ```

### Paso 3: Validación de Compilación y Calidad
Ejecuta los siguientes comandos en la carpeta `src/frontend` para garantizar la ausencia de errores en TypeScript y linter:
```bash
cd src/frontend
npm run lint
npm run build
```

### Paso 4: Confirmación y Envío a GitHub
Registra los cambios en Git utilizando la estructura de Conventional Commits y sube tu rama al repositorio remoto:
```bash
git add src/frontend/src/pages/Dashboard.tsx src/frontend/src/pages/Classrooms.tsx src/frontend/src/pages/Teachers.tsx src/frontend/src/components/CrudTable.tsx
git commit --author="LUIS ALBERTO GUTIERREZ TAIPE <71850190@continental.edu.pe>" -m "feat(accessibility): implement WCAG compliance for custom controls, teachers, and classrooms tables"
git push origin feature/HU-7.3-wcag-accessibility
```

---

## 🔍 3. Sustentación Técnica para la Exposición (Mañana)

Durante la exposición, deberás sustentar los siguientes puntos:
1. **¿Por qué se utiliza `role="switch"` y `aria-checked`?**
   * *Respuesta:* Para cumplir con la directiva **WCAG 4.1.2 (Nombre, Función, Valor)**. Los lectores de pantalla no identifican de forma nativa los componentes div o button estilizados como interruptores deslizantes. El atributo `role="switch"` les informa que es un control de encendido/apagado, y `aria-checked` les permite anunciar dinámicamente si está activado o desactivado.
2. **¿Cómo se garantiza la navegación por teclado?**
   * *Respuesta:* Para cumplir con la directiva **WCAG 2.1.1 (Teclado)**, se utilizó el tag HTML nativo `<button>`. Al ser un botón nativo, el navegador le otorga foco mediante la tecla `Tab` de manera predeterminada y permite que sea clickeado/activado con las teclas `Space` y `Enter`, y se le añadió un anillo indicador visible en color naranja (`focus:ring-orange-500`) que avisa al usuario dónde se encuentra posicionado.
3. **¿Para qué sirve `aria-hidden="true"` en los Material Icons?**
   * *Respuesta:* Los lectores de pantalla intentan leer el texto interno de los iconos decorativos (por ejemplo, el texto "settings_suggest" dentro del span de Material Icons). Colocar `aria-hidden="true"` hace que el lector de pantalla ignore el icono y lea directamente las etiquetas de texto descriptivas contiguas, evitando confusión.

---

## 📸 4. Evidencias de Calidad y Compilación (Linter & Build)

Como parte de la validación del desarrollo del frontend de la HU-7.3, se ejecutaron localmente las herramientas de calidad y empaquetado para asegurar que la integración del panel de accesibilidad WCAG cumpliera con los estándares técnicos:

### 4.1. Compilación del Frontend (`npm run build`)
* **Interpretación:** Ejecuta `tsc -b && vite build`. El resultado fue exitoso:
  * Se transformaron **43 módulos** en **1.24 segundos**.
  * Se comprobó la total ausencia de errores de tipado en TypeScript (`tsc -b`) y la correcta generación de los bundles en el directorio `dist/`.
* **Evidencia:**
  ![Compilación de Frontend](../evidencias/capturas_inspeccion07/frontend_npm_run_build.png)

### 4.2. Análisis Estático del Frontend (`npm run lint`)
* **Interpretación:** Ejecuta `eslint .` sobre toda la base del código frontend. El resultado fue limpio:
  * Terminó sin advertencias ni errores en consola (retornando un código de salida 0 al prompt).
  * Esto certifica que el código cumple estrictamente con las reglas de estilo de JavaScript/TypeScript y el framework React del proyecto.
* **Evidencia:**
  ![Linter de Frontend](../evidencias/capturas_inspeccion07/frontend_npm_run_lint.png)

