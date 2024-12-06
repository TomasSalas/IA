import React, { useState, useEffect } from 'react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

export const ChatMessage = ({ message, isOwn, isInitialLoad }) => {
  const [typedMessage, setTypedMessage] = useState('')

  useEffect(() => {
    if (!isOwn) {
      if (!isInitialLoad) {
        typeWriterEffect(message, setTypedMessage, 20)
      } else {
        setTypedMessage(message)
      }
    } else {
      setTypedMessage(message)
    }
  }, [message, isOwn])

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
        <div className={`rounded-2xl px-4 py-2 shadow-sm ${isOwn ? 'bg-indigo-500 text-white border-gray-200' : 'bg-white border border-gray-200'}`}>
          <p className='text-base leading-relaxed whitespace-pre-line'>
            <MathJaxContext>
              <MathJax dynamic>{typedMessage}</MathJax>
            </MathJaxContext>
          </p>
        </div>
      </div>
    </div>
  )
}

function typeWriterEffect (fullText, setTypedMessage, speed) {
  let index = 0

  function type () {
    if (index <= fullText.length) {
      setTypedMessage(fullText.slice(0, index))
      index++
      setTimeout(type, speed)
    }
  }

  setTypedMessage('')
  type()
}
