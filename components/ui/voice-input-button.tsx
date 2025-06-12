"use client"

import React from 'react'
import { Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VoiceInputButtonProps {
  isListening: boolean
  isSupported: boolean
  onToggle: () => void
  className?: string
  disabled?: boolean
}

export function VoiceInputButton({ 
  isListening, 
  isSupported, 
  onToggle, 
  className,
  disabled = false
}: VoiceInputButtonProps) {
  if (!isSupported) {
    return null
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0 rounded-full transition-all duration-200",
        "hover:bg-slate-100 focus:bg-slate-100",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
        isListening && "voice-listening text-emerald-600",
        className
      )}
      title={isListening ? "停止语音输入" : "开始语音输入"}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  )
} 