import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/server'

// Iniciar servidor Mock Service Worker (MSW) antes de todas las pruebas
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))

// Reiniciar los manejadores de solicitudes entre cada prueba
afterEach(() => server.resetHandlers())

// Limpiar y cerrar el servidor después de terminar las pruebas
afterAll(() => server.close())
