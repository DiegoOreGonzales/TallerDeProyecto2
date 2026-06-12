describe('Flujo de Aceptación - Login y Vista de Dashboard', () => {
  beforeEach(() => {
    // Interceptar la API real para que las pruebas pasen incluso si el backend FastAPI no está corriendo
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        access_token: 'mock-token-admin',
        user_role: 'admin',
        user_name: 'Administrador UC',
        user_cycle: null,
        user_shift: 'COMPLETO',
        user_career: 'ALL'
      }
    }).as('loginReq');

    cy.intercept('GET', '**/api/scheduler/stats', {
      statusCode: 200,
      body: {
        cursos: 20,
        aulas: 8,
        secciones: 6,
        docentes: 5,
        horarios_generados: 25
      }
    }).as('statsReq');
  });

  it('Debe iniciar sesión como admin exitosamente y ver las estadísticas', () => {
    cy.visit('/');
    
    // Rellenar formulario de login
    cy.get('input#username').type('admin');
    cy.get('input#password').type('admin');
    cy.get('button[type="submit"]').click();
    
    // Verificar que se renderiza la interfaz administrativa
    cy.get('h1').should('contain', 'SGOHA');
    cy.get('aside').should('be.visible');
    cy.get('main').should('be.visible');
  });

  it('Debe denegar acceso si el password es incorrecto', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { detail: 'Credenciales incorrectas' }
    }).as('loginFail');

    cy.visit('/');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('wrong');
    cy.get('button[type="submit"]').click();
    
    // Verificar que se muestre el error de credenciales
    cy.get('p').should('contain', 'Credenciales incorrectas');
  });
});
