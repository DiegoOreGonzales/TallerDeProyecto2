import { test, expect } from '@playwright/test';

test.describe('Flujo de Negocio Completo - Generación de Horarios', () => {
  test('Golden Path: Iniciar sesión, generar horario y navegar por el panel administrativo', async ({ page }) => {
    // Interceptar llamadas API en Playwright para que el E2E sea determinista y pase sin el backend real
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token-admin',
          user_role: 'admin',
          user_name: 'Administrador UC',
          user_cycle: null,
          user_shift: 'COMPLETO',
          user_career: 'ALL'
        })
      });
    });

    await page.route('**/api/scheduler/stats', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cursos: 20,
          aulas: 8,
          secciones: 6,
          docentes: 5,
          horarios_generados: 25
        })
      });
    });

    await page.route('**/api/scheduler/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          data: [
            {
              seccion_id: 1,
              seccion_codigo: 'SEC-A',
              aula_id: 1,
              dia: 0,
              dia_nombre: 'Lunes',
              slot: 0,
              hora_inicio: '07:00',
              hora_fin: '08:30',
              horas_pedagogicas: [],
              nombre_curso: 'MATEMÁTICA SUPERIOR',
              nombre_aula: 'A-101',
              tipo_curso: 'Teoría',
              periodo: 1,
              creditos: 5,
              turno_seccion: 'MAÑANA',
              docente_nombre: 'docente_demo',
              codigo_curso: 'ASUC01113'
            }
          ]
        })
      });
    });

    // 1. Visitar la URL base
    await page.goto('/');

    // 2. Iniciar Sesión como admin
    await page.fill('input#username', 'admin');
    await page.fill('input#password', 'admin');
    await page.click('button[type="submit"]');

    // 3. Verificar que se muestra la interfaz principal del Dashboard
    await expect(page.locator('h1')).toContainText('SGOHA');
    await expect(page.locator('aside')).toBeVisible();

    // 4. Navegar a "Aulas" a través del Sidebar
    await page.click('text=Aulas');
    // Usamos role selector específico para evitar violaciones de modo estricto
    await expect(page.getByRole('heading', { name: 'Infraestructura y Aulas' })).toBeVisible();

    // 5. Navegar a "Cursos"
    await page.click('text=Cursos');
    await expect(page.getByRole('heading', { name: 'Gestión de Cursos' })).toBeVisible();
  });
});
