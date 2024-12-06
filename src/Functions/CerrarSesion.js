import { RutaBase } from './Rutas'

export const CerrarSesion = async () => {
  const url = RutaBase + 'api/auth/logout'
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const item = {
    token: window.localStorage.getItem('token')
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    },
    body: JSON.stringify(item)
  })

  const { isExitoso, mensajeError, mensajeExitoso } = await response.json()

  if (isExitoso) {
    return {
      error: false,
      message: mensajeExitoso
    }
  } else {
    return {
      error: true,
      message: mensajeError
    }
  }
}
