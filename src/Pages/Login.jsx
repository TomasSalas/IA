import { useForm } from 'react-hook-form'
import { InicioSesion } from '../Functions/InicioSesion'
import { toast, Toaster } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Loading } from '../Helpers/Loading'

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { error, message, result } = await InicioSesion(data)
      if (!error) {
        window.localStorage.setItem('token', result.token)
        navigate('/inicio')
      } else {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      navigate('/inicio')
    }
  }, [])

  return (
    <div className='h-screen w-full md:bg-slate-100 flex justify-center items-center'>
      <div className='bg-white flex flex-col w-full max-w-md p-10 rounded-lg shadow-2xl justify-center items-center'>
        <div>
          <h2 className='text-4xl font-bold mb-4'> Inicio de sesión </h2>
        </div>

        <form className='w-full flex flex-col gap-y-5' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <div className='w-full flex flex-col'>
            <input
              type='text'
              className='w-full px-4 py-2 text-black border rounded-md
              hover:border-indigo-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
              focus:outline-none transition-colors duration-200'
              placeholder='Nombre Usuario'
              {...register('nombreUsuario', { required: 'Nombre de usuario es obligatorio' })}
            />
            <p className='text-red-500 text-xs font-semibold ml-1 h-2 w-full mt-1'>
              {errors.nombreUsuario ? errors.nombreUsuario.message : ''}
            </p>
          </div>
          <div className='w-full flex flex-col'>
            <input
              type='password'
              className='w-full px-4 py-2 text-black border rounded-md
              hover:border-indigo-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
              focus:outline-none transition-colors duration-200'
              placeholder='Contraseña'
              {...register('passwordUsuario', { required: 'La contraseña es obligatoria' })}
            />
            <p className='text-red-500 text-xs font-semibold ml-1 h-2 w-full mt-1'>
              {errors.passwordUsuario ? errors.passwordUsuario.message : ''}
            </p>
          </div>
          <div className='w-full'>
            <button className='w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition-colors duration-200' type='submit'>
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
      <Toaster richColors />
      {loading && <Loading />}
    </div>
  )
}
