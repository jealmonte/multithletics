"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { HypertrophySession, SessionExercise, SetData } from "@/lib/types"

interface HypertrophyEditorProps {
  session: HypertrophySession
  lastSession?: HypertrophySession
  onUpdate: (session: HypertrophySession) => void
}

function SetInputRow({
  set,
  index,
  onChange,
  onRemove,
}: {
  set: SetData
  index: number
  onChange: (index: number, set: SetData) => void
  onRemove: (index: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={set.weight || ""}
        onChange={(e) =>
          onChange(index, { ...set, weight: Number(e.target.value) })
        }
        placeholder="lbs"
        className="w-20 h-8 text-sm"
      />
      <span className="text-muted-foreground text-sm">x</span>
      <Input
        type="number"
        value={set.reps || ""}
        onChange={(e) =>
          onChange(index, { ...set, reps: Number(e.target.value) })
        }
        placeholder="reps"
        className="w-16 h-8 text-sm"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => onRemove(index)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}

function formatLastTimeSets(sets: SetData[]): string {
  return sets.map((s) => `${s.weight} x ${s.reps}`).join(", ")
}

export function HypertrophyEditor({
  session,
  lastSession,
  onUpdate,
}: HypertrophyEditorProps) {
  const [exercises, setExercises] = useState<SessionExercise[]>(
    session.exercises
  )

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    set: SetData
  ) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex].sets[setIndex] = set
    setExercises(newExercises)
    onUpdate({ ...session, exercises: newExercises })
  }

  const handleAddSet = (exerciseIndex: number) => {
    const newExercises = [...exercises]
    const lastSet =
      newExercises[exerciseIndex].sets[
        newExercises[exerciseIndex].sets.length - 1
      ]
    newExercises[exerciseIndex].sets.push({
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
    })
    setExercises(newExercises)
    onUpdate({ ...session, exercises: newExercises })
  }

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex].sets.splice(setIndex, 1)
    setExercises(newExercises)
    onUpdate({ ...session, exercises: newExercises })
  }

  // Find matching exercise from last session
  const getLastTimeExercise = (exerciseId: string) => {
    return lastSession?.exercises.find((e) => e.exerciseId === exerciseId)
  }

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-[1fr,1fr,1fr] gap-4 border-b border-border pb-2">
        <div className="text-sm font-medium text-muted-foreground">
          Exercise
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          Last Time
        </div>
        <div className="text-sm font-medium text-muted-foreground">Today</div>
      </div>

      {/* Exercise Rows */}
      {exercises.map((exercise, exerciseIndex) => {
        const lastTimeExercise = getLastTimeExercise(exercise.exerciseId)
        return (
          <div
            key={exercise.exerciseId}
            className="grid grid-cols-[1fr,1fr,1fr] gap-4 py-3 border-b border-border last:border-0"
          >
            {/* Exercise Name */}
            <div>
              <p className="text-sm font-medium">{exercise.exerciseName}</p>
              <p className="text-xs text-muted-foreground">
                {exercise.primaryMuscleGroup} - {exercise.subRegion}
              </p>
            </div>

            {/* Last Time (Read-only) */}
            <div className="text-sm text-muted-foreground">
              {lastTimeExercise ? (
                formatLastTimeSets(lastTimeExercise.sets)
              ) : (
                <span className="text-muted-foreground/50">No data</span>
              )}
            </div>

            {/* Today (Editable) */}
            <div className="space-y-2">
              {exercise.sets.map((set, setIndex) => (
                <SetInputRow
                  key={setIndex}
                  set={set}
                  index={setIndex}
                  onChange={(idx, newSet) =>
                    handleSetChange(exerciseIndex, idx, newSet)
                  }
                  onRemove={(idx) => handleRemoveSet(exerciseIndex, idx)}
                />
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleAddSet(exerciseIndex)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Set
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
