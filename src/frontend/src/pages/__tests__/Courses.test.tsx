import { describe, test, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Courses from '../Courses'
import { server } from '../../mocks/server'
import { rest } from 'msw'

describe('Componente de Cursos', () => {
  test('Renderiza el componente y muestra la cabecera', () => {
    render(<Courses />)
    expect(screen.getByText('Gestión de Cursos')).toBeInTheDocument()
    expect(screen.getByText('Listado maestro de asignaturas disponibles para el periodo académico.')).toBeInTheDocument()
  })

  test('Renderiza los cursos cargados asincrónicamente', async () => {
    render(<Courses />)
    
    // Esperamos a que el curso mockeado sea recuperado del servidor simulado MSW
    await waitFor(() => {
      expect(screen.getByText('TALLER DE PROYECTOS 2')).toBeInTheDocument()
      expect(screen.getByText('ASUC01585')).toBeInTheDocument()
    })
  })

  test('Muestra estado vacío si la API no devuelve cursos', async () => {
    // Sobrescribir el manejador para simular base de datos vacía
    server.use(
      rest.get('http://localhost:8000/api/cursos/', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]))
      })
    )

    render(<Courses />)

    await waitFor(() => {
      expect(screen.getByText(/No se encontraron resultados para/i)).toBeInTheDocument()
    })
  })
})
