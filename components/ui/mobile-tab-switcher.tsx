"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface MobileTabSwitcherProps {
  activeTab: string
  tabs: Tab[]
  onTabChange: (tabId: string) => void
  className?: string
}

export function MobileTabSwitcher({
  activeTab,
  tabs,
  onTabChange,
  className
}: MobileTabSwitcherProps) {
  return (
    <div className={cn(
      "flex w-full bg-gray-100 rounded-lg p-1 gap-1",
      className
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            // 基础样式
            "flex-1 flex items-center justify-center h-10 px-3 rounded-md text-sm font-medium transition-all duration-200 touch-manipulation",
            // 活跃状态
            activeTab === tab.id 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          {tab.icon && (
            <span className="mr-2 flex-shrink-0">{tab.icon}</span>
          )}
          <span className="truncate">{tab.label}</span>
        </button>
      ))}
    </div>
  )
} 