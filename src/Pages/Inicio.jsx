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
import { ListarDocumentos } from '../Functions/ListarDocumentos'
import { SubirDocumento } from '../Functions/SubirDocumento'

export const Inicio = () => {
  const { isExpired, user, nameUser } = Verificar()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState([])
  const [history, setHistory] = useState([])
  const [documentos, setDocumentos] = useState([])
  const [idConver, setIdConver] = useState(0)
  const { register, handleSubmit, setValue } = useForm()
  const [darkMode] = useState(window.localStorage.getItem('theme') === 'dark')

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]

    if (file) {
      const formData = new FormData()
      formData.append('archivo', file)

      const { error } = await SubirDocumento(formData)
      if (!error) {
        await getDocumentos()
      }
    } else {
      toast.error('Debes seleccionar un archivo')
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
    if (user !== '') {
      const { error, message, result } = await Historial(user)
      if (!error) {
        setHistory(result)
      } else {
        toast.error(message)
      }
    }
  }

  const getDocumentos = async () => {
    const result = await ListarDocumentos()
    setDocumentos(result)
  }

  const scrollToBottom = () => {
    const messageContainer = document.getElementById('message-container')
    if (messageContainer) {
      window.requestAnimationFrame(() => {
        messageContainer.scrollTop = messageContainer.scrollHeight
      })
    }
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    window.localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    setLoading(false)
    if (isExpired) {
      window.localStorage.clear()
      window.location.href = '/'
    } else {
      getHistory()
      getDocumentos()
    }
  }, [isExpired, user])

  useEffect(() => {
    scrollToBottom()
  }, [message])

  return (
    <>
      <MiniDrawer user={user || ''} history={history} setMessage={setMessage} setIdConver={setIdConver} nameUser={nameUser} documentos={documentos}>
        <div className='h-[calc(100svh-4rem)] md:h-[calc(100svh-4rem)] w-full flex flex-col dark:bg-gray-900'>
          {/* Mensajes */}
          <div id='message-container' className='flex-1 overflow-y-auto p-4 space-y-4'>
            {message.map((item, index) => (
              <ChatMessage
                key={index}
                isOwn={item.isOwn}
                message={item.message}
                isInitialLoad={item.isInitialLoad}
              />
            ))}
          </div>
          {/* Formulario */}
          <div className='p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700'>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
              <div className='w-full flex items-center gap-x-2'>
                <input
                  type='text'
                  {...register('message')}
                  placeholder='Envía un mensaje'
                  className='w-full flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-white'
                />
                <button type='submit' className='p-3 bg-indigo-500 hover:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg transition-colors'>
                  <Send className='w-4 h-4 text-white' />
                </button>

                <label className='p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer'>
                  <input
                    type='file'
                    accept='.pdf'
                    disabled
                    className='hidden'
                    onChange={handleFileUpload}
                  />
                  <Paperclip className='w-4 h-4 text-gray-600 dark:text-gray-300' />
                </label>
              </div>
            </form>

            {/* Advertencia */}
            <div className='flex justify-center w-full'>
              <h2 className='text-[9px] md:text-[14px]  text-gray-500 dark:text-gray-400 ml-1'>
                El asistente puede cometer errores. Considera verificar la información importante.
              </h2>
            </div>
          </div>
        </div>
      </MiniDrawer>
      {loading && <Loading />}
    </>
  )
}
