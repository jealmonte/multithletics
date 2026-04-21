"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { Session, SessionCategory } from "@/lib/types"

interface WeekCalendarProps {
  weekDates: string[]
  sessions: Session[]
  selectedSessionId: string | null
  onSelectSession: (session: Session) => void
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const categoryColors: Record<SessionCategory, string> = {
  Hypertrophy: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  Climbing: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  "Muay Thai": "bg-orange-100 text-orange-800 hover:bg-orange-200",
  BJJ: "bg-rose-100 text-rose-800 hover:bg-rose-200",
}

function SessionCard({
  session,
  isSelected,
  onClick,
}: {
  session: Session
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-md border bg-card p-2 text-left transition-all hover:shadow-sm",
        isSelected && "ring-2 ring-foreground ring-offset-1"
      )}
    >
      <p className="text-sm font-medium truncate">{session.name}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-1">
        <Badge
          variant="secondary"
          className={cn(
            "text-[10px] px-1.5 py-0 h-5",
            categoryColors[session.category]
          )}
        >
          {session.category}
        </Badge>
        <Badge
          variant={session.status === "Completed" ? "default" : "outline"}
          className="text-[10px] px-1.5 py-0 h-5"
        >
          {session.status}
        </Badge>
      </div>
    </button>
  )
}

export function WeekCalendar({
  weekDates,
  sessions,
  selectedSessionId,
  onSelectSession,
}: WeekCalendarProps) {
  const getSessionsForDate = (date: string) => {
    return sessions.filter((s) => s.date === date)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.getDate()
  }

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0]
    return dateStr === today
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header row */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDates.map((date, index) => (
          <div
            key={date}
            className={cn(
              "flex flex-col items-center py-3 border-r border-border last:border-r-0",
              isToday(date) && "bg-muted/50"
            )}
          >
            <span className="text-xs font-medium text-muted-foreground">
              {dayNames[index]}
            </span>
            <span
              className={cn(
                "mt-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                isToday(date) && "bg-foreground text-background"
              )}
            >
              {formatDate(date)}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid flex-1 grid-cols-7">
        {weekDates.map((date, index) => {
          const dateSessions = getSessionsForDate(date)
          return (
            <div
              key={date}
              className={cn(
                "flex flex-col gap-2 border-r border-border p-2 last:border-r-0 min-h-[200px]",
                isToday(date) && "bg-muted/30"
              )}
            >
              {dateSessions.length === 0 ? (
                <span className="text-xs text-muted-foreground/50 text-center mt-4">
                  Rest day
                </span>
              ) : (
                dateSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    isSelected={selectedSessionId === session.id}
                    onClick={() => onSelectSession(session)}
                  />
                ))
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
