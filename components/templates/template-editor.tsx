"use client"

import { useEffect, useState } from "react"
import { X, Plus, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type {
  Template,
  HypertrophyTemplate,
  ClimbingTemplate,
  CombatTemplate,
  ClimbingBlockType,
  BoardType,
  Intensity,
  Exercise,
} from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import type { DbTemplateExercise, DbTemplateBlock } from "@/lib/db-types"

const blockTypes: ClimbingBlockType[] = [
  "Warmup",
  "No-hangs",
  "Limit board",
  "Tension board",
  "Endurance circuit",
  "Spray board",
  "Outdoor prep",
  "Other",
]

const boardTypes: BoardType[] = ["Moonboard", "Kilter", "Tension", "Spray", "None"]
const intensities: Intensity[] = ["Easy", "Moderate", "Hard"]
const intensityColors: Record<Intensity, string> = {
  Easy: "bg-green-100 text-green-800",
  Moderate: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-800",
}

function mapBlockTypeToDb(type: ClimbingBlockType): string {
  switch (type) {
    case "Warmup":
      return "warmup"
    case "No-hangs":
      return "no_hangs"
    case "Limit board":
      return "limit_board"
    case "Tension board":
      return "tension_board"
    case "Endurance circuit":
      return "endurance_circuit"
    case "Spray board":
      return "spray_board"
    case "Outdoor prep":
      return "outdoor_prep"
    case "Other":
    default:
      return "other"
  }
}

function mapIntensityFromDb(value: string | null): Intensity {
  switch (value) {
    case "easy":
      return "Easy"
    case "moderate":
      return "Moderate"
    case "hard":
      return "Hard"
    default:
      return "Moderate"
  }
}

function mapIntensityToDb(intensity: Intensity): string {
  switch (intensity) {
    case "Easy":
      return "easy"
    case "Moderate":
      return "moderate"
    case "Hard":
      return "hard"
    default:
      return "moderate"
  }
}

function mapBoardTypeToDb(board: BoardType): string {
  switch (board) {
    case "Moonboard":
      return "moonboard"
    case "Kilter":
      return "kilter"
    case "Tension":
      return "tension"
    case "Spray":
      return "spray"
    case "None":
    default:
      return "none"
  }
}

function mapBoardTypeFromDb(value: string | null): BoardType {
  switch (value) {
    case "moonboard":
      return "Moonboard"
    case "kilter":
      return "Kilter"
    case "tension":
      return "Tension"
    case "spray":
      return "Spray"
    case "none":
    case null:
    default:
      return "None"
  }
}

function mapBlockTypeFromDb(value: string | null): ClimbingBlockType {
  switch (value) {
    case "warmup":
      return "Warmup"
    case "no_hangs":
      return "No-hangs"
    case "limit_board":
      return "Limit board"
    case "tension_board":
      return "Tension board"
    case "endurance_circuit":
      return "Endurance circuit"
    case "spray_board":
      return "Spray board"
    case "outdoor_prep":
      return "Outdoor prep"
    case "other":
    default:
      return "Other"
  }
}

function HypertrophyTemplateEditor({
  template,
  onChange,
  availableExercises,
}: {
  template: HypertrophyTemplate
  onChange: (template: HypertrophyTemplate) => void
  availableExercises: Exercise[]
}) {
  const [name, setName] = useState(template.name)
  const [exercises, setExercises] = useState(template.exercises)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    setName(template.name)
    setExercises(template.exercises)
  }, [template])

  const updateExercises = (
    updater:
      | typeof exercises
      | ((current: typeof exercises) => typeof exercises)
  ) => {
    const nextExercises =
      typeof updater === "function" ? updater(exercises) : updater

    setExercises(nextExercises)
    onChange({ ...template, name, exercises: nextExercises })
  }

  const handleNameChange = (newName: string) => {
    setName(newName)
    onChange({ ...template, name: newName, exercises })
  }

  const handleAddExercise = (exerciseId: string) => {
    const ex = availableExercises.find((e) => e.id === exerciseId)
    if (!ex) return

    const newExercise = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      primaryMuscleGroup: ex.primaryMuscleGroup,
      subRegions: ex.subRegions,
      defaultSets: 3,
      targetRepMin: 5,
      targetRepMax: 10,
    }

    updateExercises([...exercises, newExercise])
  }

  const handleRemoveExercise = (index: number) => {
    updateExercises(exercises.filter((_, i) => i !== index))
  }

  const handleExerciseChange = (
    index: number,
    field: "defaultSets" | "targetRepMin" | "targetRepMax",
    value: number
  ) => {
    updateExercises((current) => {
      const next = [...current]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const moveExercise = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    if (toIndex < 0 || toIndex >= exercises.length) return

    updateExercises((current) => {
      const next = [...current]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const selectableExercises = availableExercises.filter(
    (e) =>
      e.category === "Hypertrophy" &&
      !exercises.some((ex) => ex.exerciseId === e.id)
  )

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Template Name</label>
        <Input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="mt-1.5"
        />
      </div>

      <Separator />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium">Exercises</label>
          <Select onValueChange={handleAddExercise}>
            <SelectTrigger className="h-8 w-[220px]">
              <SelectValue placeholder="Add exercise..." />
            </SelectTrigger>
            <SelectContent>
              {selectableExercises.map((ex) => (
                <SelectItem key={ex.id} value={ex.id}>
                  {ex.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.exerciseId}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedIndex === null) return
                moveExercise(draggedIndex, index)
                setDraggedIndex(null)
              }}
              onDragEnd={() => setDraggedIndex(null)}
              className={cn(
                "flex items-center gap-3 rounded-md border bg-card p-3 transition-colors",
                draggedIndex === index && "opacity-50"
              )}
            >
              <button
                type="button"
                draggable
                onDragStart={() => setDraggedIndex(index)}
                className="cursor-grab text-muted-foreground active:cursor-grabbing"
                aria-label={`Reorder ${exercise.exerciseName}`}
                title="Drag to reorder"
              >
                <GripVertical className="h-4 w-4" />
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{exercise.exerciseName}</p>
                <p className="text-xs text-muted-foreground">
                  {exercise.primaryMuscleGroup} - {exercise.subRegions.join(", ")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={exercise.defaultSets}
                  onChange={(e) =>
                    handleExerciseChange(index, "defaultSets", Number(e.target.value))
                  }
                  className="h-8 w-14 text-center text-sm"
                />
                <span className="text-xs text-muted-foreground">sets</span>
                <span className="text-muted-foreground">x</span>
                <Input
                  type="number"
                  value={exercise.targetRepMin}
                  onChange={(e) =>
                    handleExerciseChange(index, "targetRepMin", Number(e.target.value))
                  }
                  className="h-8 w-14 text-center text-sm"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="number"
                  value={exercise.targetRepMax}
                  onChange={(e) =>
                    handleExerciseChange(index, "targetRepMax", Number(e.target.value))
                  }
                  className="h-8 w-14 text-center text-sm"
                />
                <span className="text-xs text-muted-foreground">reps</span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === 0}
                  onClick={() => moveExercise(index, index - 1)}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === exercises.length - 1}
                  onClick={() => moveExercise(index, index + 1)}
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleRemoveExercise(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {exercises.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No exercises added yet
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ClimbingTemplateEditor({
  template,
  onChange,
}: {
  template: ClimbingTemplate
  onChange?: (template: ClimbingTemplate) => void
}) {
  const [name, setName] = useState(template.name)
  const [blocks, setBlocks] = useState(template.blocks)

  useEffect(() => {
    setName(template.name)
    setBlocks(template.blocks)
  }, [template])

  const handleNameChange = (newName: string) => {
    setName(newName)
    onChange?.({ ...template, name: newName, blocks })
  }

  const handleBlockChange = (
    index: number,
    field: keyof (typeof blocks)[number],
    value: string | number
  ) => {
    const newBlocks = [...blocks]
    newBlocks[index] = { ...newBlocks[index], [field]: value }
    setBlocks(newBlocks)
    onChange?.({ ...template, name, blocks: newBlocks })
  }

  const handleAddBlock = () => {
    const newBlock = {
      blockType: "Other" as ClimbingBlockType,
      boardType: "None" as BoardType,
      gradeRange: "",
      intensity: "Moderate" as Intensity,
      duration: 15,
      notes: "",
    }
    const newBlocks = [...blocks, newBlock]
    setBlocks(newBlocks)
    onChange?.({ ...template, name, blocks: newBlocks })
  }

  const handleRemoveBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index)
    setBlocks(newBlocks)
    onChange?.({ ...template, name, blocks: newBlocks })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 border-b bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Template name
            </label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Moonboard Power A"
              className="h-8 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Blocks</p>
            <p className="text-xs text-muted-foreground">
              Configure your warmup, board work, and finisher blocks. Add notes
              like “Full-body stretch” or “Scap warmup” per block.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddBlock}>
            <Plus className="mr-1 h-3 w-3" />
            Block
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 p-4">
          {blocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No blocks yet. Add a warmup, board, or finisher block to get
              started.
            </p>
          ) : (
            blocks.map((block, index) => (
              <div
                key={index}
                className="space-y-3 rounded-md border bg-card p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Block {index + 1}
                    </Badge>
                    <Select
                      value={block.blockType}
                      onValueChange={(value) =>
                        handleBlockChange(index, "blockType", value)
                      }
                    >
                      <SelectTrigger className="h-8 w-[180px] text-xs">
                        <SelectValue placeholder="Block type" />
                      </SelectTrigger>
                      <SelectContent>
                        {blockTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBlock(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Board
                    </label>
                    <Select
                      value={block.boardType}
                      onValueChange={(value) =>
                        handleBlockChange(index, "boardType", value)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Board type" />
                      </SelectTrigger>
                      <SelectContent>
                        {boardTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Grade range
                    </label>
                    <Input
                      value={block.gradeRange}
                      onChange={(e) =>
                        handleBlockChange(index, "gradeRange", e.target.value)
                      }
                      placeholder="e.g. V3–V5"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Intensity
                    </label>
                    <div className="flex gap-1">
                      {intensities.map((level) => (
                        <Button
                          key={level}
                          type="button"
                          size="sm"
                          variant={
                            block.intensity === level ? "default" : "outline"
                          }
                          className="h-7 px-2 text-xs"
                          onClick={() =>
                            handleBlockChange(index, "intensity", level)
                          }
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Duration (min)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={block.duration}
                      onChange={(e) =>
                        handleBlockChange(
                          index,
                          "duration",
                          Number(e.target.value) || 0
                        )
                      }
                      className="h-8 w-[80px] text-xs"
                    />
                  </div>
                </div>

                {/* Notes field */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Notes
                  </label>
                  <Input
                    value={block.notes ?? ""}
                    onChange={(e) =>
                      handleBlockChange(index, "notes", e.target.value)
                    }
                    placeholder="e.g. Full-body stretch, scap warmup, easy traverses"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function CombatTemplateEditor({
  template,
  onChange,
}: {
  template: CombatTemplate
  onChange: (template: CombatTemplate) => void
}) {
  const [name, setName] = useState(template.name)
  const [duration, setDuration] = useState(template.plannedDuration)
  const [notes, setNotes] = useState(template.notes || "")

  useEffect(() => {
    setName(template.name)
    setDuration(template.plannedDuration)
    setNotes(template.notes || "")
  }, [template])

  const handleNameChange = (newName: string) => {
    setName(newName)
    onChange({ ...template, name: newName, plannedDuration: duration, notes })
  }

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
    onChange({ ...template, name, plannedDuration: newDuration, notes })
  }

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes)
    onChange({ ...template, name, plannedDuration: duration, notes: newNotes })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Template Name</label>
        <Input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Category</label>
        <Badge variant="secondary" className="ml-2 mt-1.5">
          {template.category}
        </Badge>
      </div>

      <Separator />

      <div>
        <label className="text-sm font-medium">Planned Duration (minutes)</label>
        <Input
          type="number"
          value={duration}
          onChange={(e) => handleDurationChange(Number(e.target.value))}
          className="mt-1.5 w-32"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Default notes for this session type..."
          className="mt-1.5"
          rows={4}
        />
      </div>
    </div>
  )
}

type TemplateEditorProps = {
  template: Template | null
  open: boolean
  onClose: () => void
  onSave: (template: Template) => void
  availableExercises: Exercise[]
}

export function TemplateEditor({
  template,
  open,
  onClose,
  onSave,
  availableExercises,
}: TemplateEditorProps) {
  const supabase = createClient()
  const [editedTemplate, setEditedTemplate] = useState<Template | null>(template)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadNested = async () => {
      if (!template) {
        setEditedTemplate(null)
        return
      }

      let localTemplate: Template = template

      if (template.category === "Hypertrophy") {
        setLoading(true)

        const { data, error } = await supabase
          .from("template_exercises")
          .select("*")
          .eq("template_id", template.id)
          .order("order_index", { ascending: true })

        if (error) {
          console.error(error)
          setEditedTemplate(template)
          setLoading(false)
          return
        }

        const rows = (data ?? []) as DbTemplateExercise[]

        const exercises = rows
          .map((row) => {
            const ex = availableExercises.find((e) => e.id === row.exercise_id)
            if (!ex) return null

            return {
              exerciseId: row.exercise_id,
              exerciseName: ex.name,
              primaryMuscleGroup: ex.primaryMuscleGroup,
              subRegions: ex.subRegions,
              defaultSets: row.default_sets,
              targetRepMin: row.target_rep_min,
              targetRepMax: row.target_rep_max,
            }
          })
          .filter(Boolean) as HypertrophyTemplate["exercises"]

        localTemplate = {
          ...(template as HypertrophyTemplate),
          exercises,
        }

        setEditedTemplate(localTemplate)
        setLoading(false)
        return
      }

      if (template.category === "Climbing") {
        const { data, error } = await supabase
          .from("template_blocks")
          .select("*")
          .eq("template_id", template.id)
          .order("order_index", { ascending: true })

        if (error) {
          console.error(error)
          setEditedTemplate(template)
          return
        }

        const rows = (data ?? []) as DbTemplateBlock[]

        localTemplate = {
          ...(template as ClimbingTemplate),
          blocks: rows.map((row, index) => {
            const gradeRange =
              row.grade_min && row.grade_max
                ? `${row.grade_min}-${row.grade_max}`
                : row.grade_min || row.grade_max || ""

            return {
              id: `block-${index}`,
              blockType: mapBlockTypeFromDb(row.block_type),
              boardType: mapBoardTypeFromDb(row.board_type),
              gradeRange,
              intensity: mapIntensityFromDb(row.intensity),
              duration: row.planned_duration_min ?? 0,
              notes: row.notes ?? "",
            }
          }),
        }

        setEditedTemplate(localTemplate)
        return
      }

      setEditedTemplate(template)
    }

    loadNested()
  }, [template, supabase, availableExercises])

  const handleSave = async () => {
    if (!editedTemplate) return

    setLoading(true)

    if (editedTemplate.category === "Hypertrophy") {
      const ht = editedTemplate as HypertrophyTemplate

      const { data: existing, error: exError } = await supabase
        .from("template_exercises")
        .select("id, exercise_id")
        .eq("template_id", ht.id)

      if (exError) {
        console.error(exError)
        alert(exError.message)
        setLoading(false)
        return
      }

      const existingRows = (existing ?? []) as { id: string; exercise_id: string }[]

      const upserts = ht.exercises.map((ex, index) => ({
        template_id: ht.id,
        exercise_id: ex.exerciseId,
        order_index: index,
        default_sets: ex.defaultSets,
        target_rep_min: ex.targetRepMin,
        target_rep_max: ex.targetRepMax,
      }))

      const toKeepIds = upserts
        .map((u) => existingRows.find((r) => r.exercise_id === u.exercise_id)?.id)
        .filter(Boolean) as string[]

      const toDeleteIds = existingRows
        .map((r) => r.id)
        .filter((id) => !toKeepIds.includes(id))

      if (toDeleteIds.length > 0) {
        const { error: delError } = await supabase
          .from("template_exercises")
          .delete()
          .in("id", toDeleteIds)

        if (delError) {
          console.error(delError)
          alert(delError.message)
          setLoading(false)
          return
        }
      }

      if (upserts.length > 0) {
        const { error: upsertError } = await supabase
          .from("template_exercises")
          .upsert(upserts, { onConflict: "template_id,exercise_id" })

        if (upsertError) {
          console.error(upsertError)
          alert(upsertError.message)
          setLoading(false)
          return
        }
      }
    }

    if (editedTemplate.category === "Climbing") {
      const ct = editedTemplate as ClimbingTemplate

      const { error: deleteError } = await supabase
        .from("template_blocks")
        .delete()
        .eq("template_id", ct.id)

      if (deleteError) {
        console.error(deleteError)
        alert(deleteError.message)
        setLoading(false)
        return
      }

      if (ct.blocks.length > 0) {
        const payload = ct.blocks.map((block, index) => {
          const gradeParts = block.gradeRange.split("-")

          return {
            template_id: ct.id,
            order_index: index,
            block_type: mapBlockTypeToDb(block.blockType),
            board_type: mapBoardTypeToDb(block.boardType),
            grade_min: gradeParts[0] || null,
            grade_max: gradeParts[1] || null,
            intensity: mapIntensityToDb(block.intensity),
            planned_duration_min: block.duration ?? 0,
            notes: block.notes ?? null,
          }
        })

        const { error: insertError } = await supabase
          .from("template_blocks")
          .insert(payload)

        if (insertError) {
          console.error(insertError)
          alert(insertError.message)
          setLoading(false)
          return
        }
      }
    }

    onSave(editedTemplate)
    onClose()
    setLoading(false)
  }

  if (!editedTemplate) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[92vw] sm:w-[720px] sm:max-w-[720px] lg:w-[860px] lg:max-w-[860px]">
        <SheetHeader>
          <SheetTitle>Edit Template</SheetTitle>
          <SheetDescription>Make changes to your training template</SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-180px)] pr-4">
          {editedTemplate.category === "Hypertrophy" && (
            <HypertrophyTemplateEditor
              template={editedTemplate as HypertrophyTemplate}
              onChange={setEditedTemplate}
              availableExercises={availableExercises}
            />
          )}

          {editedTemplate.category === "Climbing" && (
            <ClimbingTemplateEditor
              template={editedTemplate as ClimbingTemplate}
              onChange={setEditedTemplate}
            />
          )}

          {(editedTemplate.category === "Muay Thai" ||
            editedTemplate.category === "BJJ") && (
            <CombatTemplateEditor
              template={editedTemplate as CombatTemplate}
              onChange={setEditedTemplate}
            />
          )}
        </ScrollArea>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}