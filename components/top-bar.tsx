"use client"

import { User } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getWeekRangeString } from "@/lib/mock-data"

interface TopBarProps {
  title?: string
  showWeekRange?: boolean
}

export function TopBar({ title, showWeekRange = true }: TopBarProps) {
  const weekRange = getWeekRangeString()

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        {showWeekRange && (
          <span className="text-sm font-medium text-muted-foreground">
            {weekRange}
          </span>
        )}
        {title && !showWeekRange && (
          <h1 className="text-lg font-semibold">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted text-muted-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
