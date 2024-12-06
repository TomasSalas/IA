import React, { useEffect, useState } from 'react'
import { MiniDrawer } from '../Components/MinuDrawer'
import { Paperclip, Send } from 'lucide-react'
import { ChatMessage } from '../Components/ChatMessage'
import { Verificar } from '../Helpers/Verificar'
import { Loading } from '../Helpers/Loading'
import { useForm } from 'react-hook-form'
import { EnviarMensaje } from '../Functions/EnviarMensaje'
import { toast } from 'sonner'
import { Historial } from '../Functions/Historial'

export const Inicio = () => {
  const { isExpired, user, nameUser } = Verificar()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState([])
  const [history, setHistory] = useState([])
  const [idConver, setIdConver] = useState(0)
  const { register, handleSubmit, setValue } = useForm()

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log('File selected:', file.name)
    }
  }

  const onSubmit = async (data) => {
    setMessage((prevMessages) => [...prevMessages, { message: data.message, isOwn: true, isInitialLoad: false }])
    setValue('message', '')

    const { error, message: mensajeEnviar, result } = await EnviarMensaje(data, user, idConver)
    if (!error && result?.mensajeAsistente) {
      setIdConver(result.conversacionId)
      setMessage((prevMessages) => [
        ...prevMessages,
        { message: result.mensajeAsistente, isOwn: false, isInitialLoad: false }
      ])
    } else {
      toast.error(mensajeEnviar || 'Error al enviar el mensaje')
    }

    idConver === 0 && await getHistory()
  }

  const getHistory = async () => {
    const { error, message, result } = await Historial(user)
    if (!error) {
      setHistory(result)
    } else {
      toast.error(message)
    }
  }

  useEffect(() => {
    setLoading(false)
    if (isExpired) {
      window.localStorage.clear()
      window.location.href = '/'
    } else {
      getHistory()
    }
  }, [isExpired, user])

  return (
    <MiniDrawer user={user || ''} history={history} setMessage={setMessage} setIdConver={setIdConver} nameUser={nameUser}>
      <div className='h-[calc(100vh-4rem)] w-full flex flex-col'>
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {message.map((item, index) => (
            <ChatMessage
              key={index}
              isOwn={item.isOwn}
              message={item.message}
              isInitialLoad={item.isInitialLoad}
            />
          ))}
        </div>

        <div className='p-2 bg-white border-t border-gray-200'>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <div className='w-full flex items-center gap-x-2'>
              <input
                type='text'
                {...register('message')}
                placeholder='Envía un mensaje'
                className='w-full flex-1 px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700'
              />
              <button type='submit' className='p-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors'>
                <Send className='w-4 h-4 text-white' />
              </button>
              <label className='p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors cursor-pointer'>
                <input
                  type='file'
                  disabled
                  className='hidden'
                  onChange={handleFileUpload}
                />
                <Paperclip className='w-4 h-4 text-gray-600' />
              </label>
            </div>
          </form>
          <div className='flex justify-center w-full'>
            <h2 className='text-xs md:text-md text-gray-500 ml-1'> El asistente puede cometer errores. Considera verificar la información importante </h2>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </MiniDrawer>
  )
}
