"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "./button"

interface TouchFriendlyButtonProps extends ButtonProps {
  touchSize?: "normal" | "large"
}

export const TouchFriendlyButton = React.forwardRef<
  HTMLButtonElement,
  TouchFriendlyButtonProps
>(({ className, touchSize = "normal", ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        // 基础触摸优化
        "touch-manipulation select-none",
        // 触摸目标大小
        touchSize === "large" ? "btn-touch-lg" : "btn-touch",
        // 优化的内边距 - 更紧凑但仍触摸友好
        "px-3 py-2 sm:px-4 sm:py-3",
        // 响应式文本大小
        "text-sm sm:text-base",
        // 最小高度确保触摸友好
        "min-h-[44px]",
        className
      )}
      {...props}
    />
  )
})

TouchFriendlyButton.displayName = "TouchFriendlyButton" 