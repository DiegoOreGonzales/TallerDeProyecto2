import { rest } from 'msw'

export const handlers = [
  // Intercept GET `/api/cursos/`
  rest.get('http://localhost:8000/api/cursos/', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, codigo: 'ASUC01585', nombre: 'TALLER DE PROYECTOS 2', creditos: 4, tipo: 'Laboratorio', periodo: 10 }
      ])
    )
  }),

  // Intercept POST `/api/cursos/`
  rest.post('http://localhost:8000/api/cursos/', async (req, res, ctx) => {
    const body = await req.json()
    return res(
      ctx.status(200),
      ctx.json({ id: 2, ...body })
    )
  }),

  // Intercept DELETE `/api/cursos/:id`
  rest.delete('http://localhost:8000/api/cursos/:id', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ status: 'success' })
    )
  }),

  // Intercept POST `/api/auth/login`
  rest.post('http://localhost:8000/api/auth/login', async (req, res, ctx) => {
    const body = await req.json()
    const { username, password } = body
    if (username === 'admin' && password === 'admin') {
      return res(
        ctx.status(200),
        ctx.json({
          access_token: 'mock-token-admin',
          user_role: 'admin',
          user_name: 'Administrador UC',
          user_cycle: null,
          user_shift: 'COMPLETO',
          user_career: 'ALL'
        })
      )
    }
    return res(
      ctx.status(401),
      ctx.json({ detail: 'Credenciales incorrectas' })
    )
  })
]
