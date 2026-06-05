import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '../Login'

describe('Componente de Login', () => {
  test('Renderiza el formulario de login correctamente', () => {
    const handleLogin = vi.fn()
    render(<Login onLogin={handleLogin} />)

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ingresar al Sistema/i })).toBeInTheDocument()
  })

  test('Permite ingresar texto en usuario y contraseña', () => {
    const handleLogin = vi.fn()
    render(<Login onLogin={handleLogin} />)

    const userInput = screen.getByPlaceholderText('admin / estudiante / docente') as HTMLInputElement
    const passInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement

    fireEvent.change(userInput, { target: { value: 'admin' } })
    fireEvent.change(passInput, { target: { value: 'admin' } })

    expect(userInput.value).toBe('admin')
    expect(passInput.value).toBe('admin')
  })

  test('Llama a onLogin al iniciar sesión exitosamente con credenciales válidas', async () => {
    const handleLogin = vi.fn()
    render(<Login onLogin={handleLogin} />)

    const userInput = screen.getByPlaceholderText('admin / estudiante / docente')
    const passInput = screen.getByPlaceholderText('••••••••')
    const submitBtn = screen.getByRole('button', { name: /Ingresar al Sistema/i })

    fireEvent.change(userInput, { target: { value: 'admin' } })
    fireEvent.change(passInput, { target: { value: 'admin' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith('admin', 'Administrador UC', null, 'COMPLETO')
    })
  })

  test('Muestra un mensaje de error si las credenciales son inválidas', async () => {
    const handleLogin = vi.fn()
    render(<Login onLogin={handleLogin} />)

    const userInput = screen.getByPlaceholderText('admin / estudiante / docente')
    const passInput = screen.getByPlaceholderText('••••••••')
    const submitBtn = screen.getByRole('button', { name: /Ingresar al Sistema/i })

    fireEvent.change(userInput, { target: { value: 'invalid' } })
    fireEvent.change(passInput, { target: { value: 'wrong' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument()
      expect(handleLogin).not.toHaveBeenCalled()
    })
  })
})
