import { RutaBase } from './Rutas'

export const ObtenerConversacion = async (idUsuario, idConversacion) => {
  const url = RutaBase + 'api/Chat/Listarconversacion_completa?usuarioId=' + idUsuario + '&conversacionId=' + idConversacion
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
      result: resultado.mensajes
    }
  } else {
    return {
      error: true,
      message: mensajeError,
      result: []
    }
  }
}
