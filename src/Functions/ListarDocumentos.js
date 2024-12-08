import { RutaBase } from './Rutas'

export const ListarDocumentos = async () => {
  const url = RutaBase + 'api/documento/obtenerdocumentos'
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    }
  })

  const result = await response.json()
  return result
}
