"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { CombatSession, Intensity } from "@/lib/types"

interface CombatEditorProps {
  session: CombatSession
  lastSession?: CombatSession
  onUpdate: (session: CombatSession) => void
}

const intensities: Intensity[] = ["Easy", "Moderate", "Hard"]

const intensityColors: Record<Intensity, string> = {
  Easy: "bg-green-100 text-green-800 border-green-200",
  Moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Hard: "bg-red-100 text-red-800 border-red-200",
}

export function CombatEditor({
  session,
  lastSession,
  onUpdate,
}: CombatEditorProps) {
  const [intensity, setIntensity] = useState<Intensity>(session.intensity)
  const [duration, setDuration] = useState(session.actualDuration || session.plannedDuration)
  const [notes, setNotes] = useState(session.notes || "")

  const handleIntensityChange = (newIntensity: Intensity) => {
    setIntensity(newIntensity)
    onUpdate({ ...session, intensity: newIntensity })
  }

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
    onUpdate({ ...session, actualDuration: newDuration })
  }

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes)
    onUpdate({ ...session, notes: newNotes })
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Last Time */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Last Time</h4>
        {lastSession ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="text-sm">
                {lastSession.actualDuration || lastSession.plannedDuration} minutes
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Intensity</p>
              <span
                className={cn(
                  "inline-flex px-2 py-0.5 rounded text-sm",
                  intensityColors[lastSession.intensity]
                )}
              >
                {lastSession.intensity}
              </span>
            </div>
            {lastSession.notes && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{lastSession.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/50">No previous session</p>
        )}
      </div>

      {/* Today */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Today</h4>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Duration (minutes)</p>
            <Input
              type="number"
              value={duration || ""}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              className="w-32"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Perceived Intensity</p>
            <div className="flex gap-2">
              {intensities.map((int) => (
                <Button
                  key={int}
                  variant={intensity === int ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    intensity === int && intensityColors[int]
                  )}
                  onClick={() => handleIntensityChange(int)}
                >
                  {int}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Notes</p>
            <Textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="How did the session go?"
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
