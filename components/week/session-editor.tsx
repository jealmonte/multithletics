"use client"

import { Clock, Calendar as CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { HypertrophyEditor } from "./hypertrophy-editor"
import { ClimbingEditor } from "./climbing-editor"
import { CombatEditor } from "./combat-editor"
import type {
  Session,
  SessionCategory,
  HypertrophySession,
  ClimbingSession,
  CombatSession,
} from "@/lib/types"

interface SessionEditorProps {
  session: Session
  lastSession?: Session
  onUpdate: (session: Session) => void
  onSave: () => void
  onMarkComplete: () => void
}

const categoryColors: Record<SessionCategory, string> = {
  Hypertrophy: "bg-blue-100 text-blue-800",
  Climbing: "bg-emerald-100 text-emerald-800",
  "Muay Thai": "bg-orange-100 text-orange-800",
  BJJ: "bg-rose-100 text-rose-800",
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })
}

export function SessionEditor({
  session,
  lastSession,
  onUpdate,
  onSave,
  onMarkComplete,
}: SessionEditorProps) {
  const handleDurationChange = (duration: number) => {
    onUpdate({ ...session, actualDuration: duration })
  }

  const handleNotesChange = (notes: string) => {
    onUpdate({ ...session, notes })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{session.name}</h2>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {formatDate(session.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {session.actualDuration || session.plannedDuration} min
                {session.actualDuration && session.plannedDuration !== session.actualDuration && (
                  <span className="text-muted-foreground/70">
                    (planned: {session.plannedDuration})
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn("px-2 py-1", categoryColors[session.category])}
            >
              {session.category}
            </Badge>
            <Badge variant={session.status === "Completed" ? "default" : "outline"}>
              {session.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1 p-4">
        {session.category === "Hypertrophy" && (
          <HypertrophyEditor
            session={session as HypertrophySession}
            lastSession={lastSession as HypertrophySession | undefined}
            onUpdate={(updated) => onUpdate(updated)}
          />
        )}
        {session.category === "Climbing" && (
          <ClimbingEditor
            session={session as ClimbingSession}
            lastSession={lastSession as ClimbingSession | undefined}
            onUpdate={(updated) => onUpdate(updated)}
          />
        )}
        {(session.category === "Muay Thai" || session.category === "BJJ") && (
          <CombatEditor
            session={session as CombatSession}
            lastSession={lastSession as CombatSession | undefined}
            onUpdate={(updated) => onUpdate(updated)}
          />
        )}

        {/* Duration and Notes for Hypertrophy and Climbing */}
        {(session.category === "Hypertrophy" || session.category === "Climbing") && (
          <>
            <Separator className="my-6" />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">
                  Session Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={session.actualDuration || session.plannedDuration}
                  onChange={(e) => handleDurationChange(Number(e.target.value))}
                  className="mt-2 w-32"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={session.notes || ""}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Session notes..."
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          </>
        )}
      </ScrollArea>

      {/* Footer Actions */}
      <div className="border-t border-border p-4">
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onSave}>
            Save Session
          </Button>
          {session.status === "Planned" && (
            <Button onClick={onMarkComplete}>Mark as Completed</Button>
          )}
        </div>
      </div>
    </div>
  )
}
