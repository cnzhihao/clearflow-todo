"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseSpeechRecognitionOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
}

interface UseSpeechRecognitionReturn {
  isSupported: boolean
  isListening: boolean
  transcript: string
  error: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    language = 'zh-CN',
    continuous = false,
    interimResults = false
  } = options

  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // 检查浏览器支持
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()
      } else {
        setIsSupported(false)
      }
    }
  }, [])

  // 配置语音识别
  useEffect(() => {
    if (!recognitionRef.current) return

    const recognition = recognitionRef.current

    // 配置参数
    recognition.lang = language
    recognition.continuous = continuous
    recognition.interimResults = interimResults

    // 开始识别事件
    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    // 识别结果事件
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        }
      }
      
      if (finalTranscript) {
        setTranscript(finalTranscript)
      }
    }

    // 识别结束事件
    recognition.onend = () => {
      setIsListening(false)
    }

    // 错误处理事件
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false)
      
      let errorMessage = ''
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone permission denied'
          break
        case 'no-speech':
          errorMessage = 'No speech detected'
          break
        case 'network':
          errorMessage = 'Network error occurred'
          break
        case 'audio-capture':
          errorMessage = 'Audio capture failed'
          break
        default:
          errorMessage = `Speech recognition error: ${event.error}`
      }
      
      setError(errorMessage)
    }

    return () => {
      if (recognition) {
        recognition.onstart = null
        recognition.onresult = null
        recognition.onend = null
        recognition.onerror = null
      }
    }
  }, [language, continuous, interimResults])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported || isListening) return
    
    try {
      setError(null)
      setTranscript('')
      recognitionRef.current.start()
    } catch (err) {
      setError('Failed to start speech recognition')
    }
  }, [isSupported, isListening])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return
    
    try {
      recognitionRef.current.stop()
    } catch (err) {
      setError('Failed to stop speech recognition')
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript
  }
} 