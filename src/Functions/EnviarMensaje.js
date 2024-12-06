import { RutaBase } from './Rutas'

export const EnviarMensaje = async (data, idUser, idConversacion) => {
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const item = {
    usuarioId: idUser,
    conversacionId: idConversacion,
    mensajeUsuario: data.message
  }

  const url = RutaBase + 'api/chat/preguntar'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    },
    body: JSON.stringify(item)
  })

  const { isExitoso, mensajeError, mensajeExito, resultado } = await response.json()

  if (isExitoso) {
    return {
      error: false,
      message: mensajeExito,
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
