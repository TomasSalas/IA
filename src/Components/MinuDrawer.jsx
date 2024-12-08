import React, { useState, useEffect } from 'react'
import { Menu, Sparkles, Pin, PinOff, X, MessageCirclePlus, Sun, Moon } from 'lucide-react'
import { ObtenerConversacion } from '../Functions/ObtenerConversacion'
import { CerrarSesion } from '../Functions/CerrarSesion'

export const MiniDrawer = ({ children, user, history, setMessage, setIdConver, nameUser, documentos }) => {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  const [rightDrawerPinned, setRightDrawerPinned] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(window.localStorage.getItem('theme') === 'dark')

  const getMensajes = async (id) => {
    const { error, result } = await ObtenerConversacion(user, id)
    setIdConver(id)
    if (!error) {
      const message = result.map((item) => ({
        message: item.contenido,
        isOwn: item.rol === 'user',
        isInitialLoad: true
      }))
      setMessage(message)
    }
  }

  const nuevaConversacion = () => {
    setMessage([])
    setIdConver(0)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const onLogout = async () => {
    const { error } = await CerrarSesion()
    if (!error) {
      window.localStorage.clear()
      window.location.href = '/'
    }
  }

  const handleRightDrawerPin = () => {
    const newPinnedState = !rightDrawerPinned
    setRightDrawerPinned(newPinnedState)
    setRightDrawerOpen(newPinnedState)
    window.localStorage.setItem('rightDrawerPinned', JSON.stringify(newPinnedState))
  }

  const handleRightDrawerClose = () => {
    setRightDrawerOpen(false)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const pinnedState = window.localStorage.getItem('rightDrawerPinned')
    if (pinnedState) {
      setRightDrawerPinned(JSON.parse(pinnedState))
      setRightDrawerOpen(JSON.parse(pinnedState))
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    window.localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className='flex h-screen  dark:bg-gray-900'>
      {/* Drawer izquierdo */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${leftDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='flex flex-col h-full'>
          <div className='h-16 flex items-center justify-between px-4 ml-2'>
            <h2 className='font-bold text-lg text-gray-800 dark:text-white'>Historial</h2>
            <MessageCirclePlus className='cursor-pointer text-indigo-500' onClick={nuevaConversacion} />
          </div>

          <div>
            {history.map((item) => (
              <div
                key={item.id}
                className='flex items-center justify-between rounded-md m-2 px-4 py-2 hover:bg-indigo-400 transition-colors duration-100 text-gray-500 dark:text-gray-300 hover:text-white hover:cursor-pointer'
                onClick={() => getMensajes(item.id)}
              >
                <h2 className='text-sm'>{String(item.titulo).replace(/"/g, '')}</h2>
              </div>
            ))}
          </div>

          <div className='text-black dark:text-white mt-auto flex items-center flex-col gap-y-10 justify-center gap-x-5 rounded-md px-4 py-2 hover:cursor-pointer relative'>
            <div className='rounded-md py-2 px-4 flex w-full justify-start gap-x-5 items-center mt-auto hover:bg-indigo-400 transition-colors duration-100' onClick={toggleUserMenu}>
              <div className='relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-indigo-500 rounded-full'>
                <span className='font-medium text-white'>{nameUser.charAt(0)}</span>
              </div>
              <h2 className='text-base mr-4'>{nameUser}</h2>
            </div>
            {userMenuOpen && (
              <div className='ml-4 absolute bottom-full left-0 w-10/12 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 mb-2 px-2'>
                <div className='flex items-center px-4 py-2 justify-between'>
                  <span className='text-gray-700 dark:text-gray-300'>Tema</span>
                  <button
                    className={`relative inline-flex items-center w-14 h-8 rounded-full p-1 ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {/* Círculo deslizante */}
                    <div className={`absolute w-6 h-6 rounded-full bg-white transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />

                    {/* Contenedor de los íconos */}
                    <div className='absolute inset-0 flex items-center justify-between px-2'>
                      <Moon className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-transparent'}`} />
                      <Sun className={`w-4 h-4 ${darkMode ? 'text-transparent' : 'text-black'}`} />
                    </div>
                  </button>
                </div>

                <hr className='my-2' />

                <div>
                  <button
                    onClick={onLogout}
                    className='rounded-md p-2 w-full text-left px-4 py-2 hover:bg-indigo-300 flex items-center gap-x-2 text-gray-700 dark:text-gray-300'
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className={`flex-grow transition-all duration-300 ${leftDrawerOpen ? 'ml-64' : ''} ${rightDrawerOpen ? 'mr-64' : ''}`}>
        <header className='h-16 bg-white dark:bg-gray-900 shadow-sm z-20 flex items-center justify-between px-4'>
          <button
            onClick={() => setLeftDrawerOpen(!leftDrawerOpen)}
            className='p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900'
          >
            <Menu className='w-6 h-6' />
          </button>

          <div className='flex items-center space-x-2'>
            <Sparkles className='w-6 h-6 text-indigo-500' />
            <h2 className='font-bold text-lg text-gray-800 dark:text-white'>Asistente IA</h2>
          </div>

          <div className='flex items-center space-x-4'>
            <button
              onClick={() => setRightDrawerOpen(!rightDrawerOpen)}
              className='p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900'
            >
              <Menu className='w-6 h-6' />
            </button>
          </div>
        </header>

        <main className='h-[calc(100svh-4rem)] dark:bg-gray-900 dark:text-white'>{children}</main>
      </div>

      {/* Drawer derecho */}
      <aside className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${rightDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex flex-col h-full'>
          <div className='h-16 flex items-center justify-between px-4'>
            <h2 className='text-sm text-center font-bold text-gray-800 dark:text-white'>Documentos Cargados</h2>
            <button
              onClick={isLargeScreen ? handleRightDrawerPin : handleRightDrawerClose}
              className='p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900'
            >
              {isLargeScreen ? (rightDrawerPinned ? <PinOff className='w-6 h-6' /> : <Pin className='w-6 h-6' />) : <X className='w-6 h-6' />}
            </button>
          </div>
          <div>
            {documentos.map((item) => (
              <div
                key={item.id}
                className='flex items-center justify-between rounded-md m-2 px-4 py-2 hover:bg-indigo-400 transition-colors duration-100 text-gray-500 dark:text-gray-300 hover:text-white hover:cursor-pointer'
                onClick={() => console.log(item)}
              >
                <h2 className='text-sm'>{String(item.nombre).replace(/"/g, '')}</h2>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
