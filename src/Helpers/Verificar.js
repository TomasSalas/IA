import { useState, useEffect } from 'react'
import { useJwt } from 'react-jwt'

export const Verificar = () => {
  const [user, setUser] = useState('')
  const [nameUser, setNameUser] = useState('')
  const token = window.localStorage.getItem('token')
  const { isExpired, decodedToken } = useJwt(token)

  useEffect(() => {
    if (decodedToken) {
      setUser(parseInt(decodedToken.nameid))
      setNameUser(decodedToken.unique_name)
    }
  }, [decodedToken])

  return { isExpired, user, nameUser }
}
