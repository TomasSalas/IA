import { RutaBase } from './Rutas'

export const Historial = async (id) => {
  const url = RutaBase + 'api/Chat/Listarconversaciones?usuarioId=' + id
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    }
  })

  const { isExitoso, mensajeError, resultado } = await response.json()
  if (isExitoso) {
    return {
      error: false,
      message: '',
      result: resultado
    }
  } else {
    return {
      error: true,
      message: mensajeError,
      result: []
    }
  }
}
