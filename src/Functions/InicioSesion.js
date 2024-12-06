import { RutaBase } from './Rutas'

export const InicioSesion = async (data) => {
  const item = {
    nombreusuario: data.nombreUsuario,
    contrasena: data.passwordUsuario
  }

  const url = RutaBase + 'api/auth/login'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
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
