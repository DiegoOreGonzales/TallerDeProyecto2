import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Configurar servidor MSW con los manejadores definidos
export const server = setupServer(...handlers)
