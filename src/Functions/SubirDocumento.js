import { RutaBase } from './Rutas'

export const SubirDocumento = async (formData) => {
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`
  const url = RutaBase + 'api/Documento/SubirDocumento'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: auth
    },
    body: formData
  })

  if (!response.ok) {
    throw new Error('Error al subir el archivo')
  }

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
