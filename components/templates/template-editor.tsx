"use client"

import { useState } from "react"
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
import { exercises as exerciseLibrary } from "@/lib/mock-data"
import type {
  Template,
  HypertrophyTemplate,
  ClimbingTemplate,
  CombatTemplate,
  ClimbingBlockType,
  BoardType,
  Intensity,
} from "@/lib/types"

interface TemplateEditorProps {
  template: Template | null
  open: boolean
  onClose: () => void
  onSave: (template: Template) => void
}

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

function HypertrophyTemplateEditor({
  template,
  onChange,
}: {
  template: HypertrophyTemplate
  onChange: (template: HypertrophyTemplate) => void
}) {
  const [name, setName] = useState(template.name)
  const [exercises, setExercises] = useState(template.exercises)

  const handleNameChange = (newName: string) => {
    setName(newName)
    onChange({ ...template, name: newName })
  }

  const handleAddExercise = (exerciseId: string) => {
    const ex = exerciseLibrary.find((e) => e.id === exerciseId)
    if (!ex) return

    const newExercise = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      primaryMuscleGroup: ex.primaryMuscleGroup,
      subRegion: ex.subRegion,
      defaultSets: 3,
      defaultReps: 10,
    }
    const newExercises = [...exercises, newExercise]
    setExercises(newExercises)
    onChange({ ...template, exercises: newExercises })
  }

  const handleRemoveExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index)
    setExercises(newExercises)
    onChange({ ...template, exercises: newExercises })
  }

  const handleExerciseChange = (
    index: number,
    field: "defaultSets" | "defaultReps",
    value: number
  ) => {
    const newExercises = [...exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setExercises(newExercises)
    onChange({ ...template, exercises: newExercises })
  }

  const availableExercises = exerciseLibrary.filter(
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
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">Exercises</label>
          <Select onValueChange={handleAddExercise}>
            <SelectTrigger className="w-[200px] h-8">
              <SelectValue placeholder="Add exercise..." />
            </SelectTrigger>
            <SelectContent>
              {availableExercises.map((ex) => (
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
              className="flex items-center gap-3 rounded-md border bg-card p-3"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {exercise.exerciseName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {exercise.primaryMuscleGroup} - {exercise.subRegion}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={exercise.defaultSets}
                  onChange={(e) =>
                    handleExerciseChange(index, "defaultSets", Number(e.target.value))
                  }
                  className="w-14 h-8 text-sm text-center"
                />
                <span className="text-xs text-muted-foreground">sets</span>
                <span className="text-muted-foreground">x</span>
                <Input
                  type="number"
                  value={exercise.defaultReps}
                  onChange={(e) =>
                    handleExerciseChange(index, "defaultReps", Number(e.target.value))
                  }
                  className="w-14 h-8 text-sm text-center"
                />
                <span className="text-xs text-muted-foreground">reps</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleRemoveExercise(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {exercises.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
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
  onChange: (template: ClimbingTemplate) => void
}) {
  const [name, setName] = useState(template.name)
  const [blocks, setBlocks] = useState(template.blocks)

  const handleNameChange = (newName: string) => {
    setName(newName)
    onChange({ ...template, name: newName })
  }

  const handleAddBlock = () => {
    const newBlock = {
      blockType: "Other" as ClimbingBlockType,
      boardType: "None" as BoardType,
      gradeRange: "",
      intensity: "Moderate" as Intensity,
      duration: 15,
    }
    const newBlocks = [...blocks, newBlock]
    setBlocks(newBlocks)
    onChange({ ...template, blocks: newBlocks })
  }

  const handleRemoveBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index)
    setBlocks(newBlocks)
    onChange({ ...template, blocks: newBlocks })
  }

  const handleBlockChange = (
    index: number,
    field: keyof (typeof blocks)[0],
    value: string | number
  ) => {
    const newBlocks = [...blocks]
    newBlocks[index] = { ...newBlocks[index], [field]: value }
    setBlocks(newBlocks)
    onChange({ ...template, blocks: newBlocks })
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

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium">Blocks</label>
          <Button variant="outline" size="sm" onClick={handleAddBlock}>
            <Plus className="h-4 w-4 mr-1" />
            Add Block
          </Button>
        </div>

        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div
              key={index}
              className="rounded-md border bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Select
                  value={block.blockType}
                  onValueChange={(value) =>
                    handleBlockChange(index, "blockType", value)
                  }
                >
                  <SelectTrigger className="w-[160px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blockTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleRemoveBlock(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={block.boardType}
                  onValueChange={(value) =>
                    handleBlockChange(index, "boardType", value)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Board" />
                  </SelectTrigger>
                  <SelectContent>
                    {boardTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={block.gradeRange}
                  onChange={(e) =>
                    handleBlockChange(index, "gradeRange", e.target.value)
                  }
                  placeholder="e.g. V3-V6"
                  className="h-8"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {intensities.map((intensity) => (
                    <Button
                      key={intensity}
                      variant={
                        block.intensity === intensity ? "default" : "outline"
                      }
                      size="sm"
                      className={cn(
                        "h-7 text-xs",
                        block.intensity === intensity &&
                          intensityColors[intensity]
                      )}
                      onClick={() =>
                        handleBlockChange(index, "intensity", intensity)
                      }
                    >
                      {intensity}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <Input
                    type="number"
                    value={block.duration}
                    onChange={(e) =>
                      handleBlockChange(index, "duration", Number(e.target.value))
                    }
                    className="w-16 h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">min</span>
                </div>
              </div>
            </div>
          ))}
          {blocks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No blocks added yet
            </p>
          )}
        </div>
      </div>
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

  const handleNameChange = (newName: string) => {
    setName(newName)
    onChange({ ...template, name: newName })
  }

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
    onChange({ ...template, plannedDuration: newDuration })
  }

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes)
    onChange({ ...template, notes: newNotes })
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
        <Badge variant="secondary" className="mt-1.5 ml-2">
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

export function TemplateEditor({
  template,
  open,
  onClose,
  onSave,
}: TemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<Template | null>(template)

  // Reset edited template when template prop changes
  if (template?.id !== editedTemplate?.id) {
    setEditedTemplate(template)
  }

  const handleSave = () => {
    if (editedTemplate) {
      onSave(editedTemplate)
      onClose()
    }
  }

  if (!editedTemplate) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Edit Template</SheetTitle>
          <SheetDescription>
            Make changes to your training template
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-180px)] mt-6 pr-4">
          {editedTemplate.category === "Hypertrophy" && (
            <HypertrophyTemplateEditor
              template={editedTemplate as HypertrophyTemplate}
              onChange={(t) => setEditedTemplate(t)}
            />
          )}
          {editedTemplate.category === "Climbing" && (
            <ClimbingTemplateEditor
              template={editedTemplate as ClimbingTemplate}
              onChange={(t) => setEditedTemplate(t)}
            />
          )}
          {(editedTemplate.category === "Muay Thai" ||
            editedTemplate.category === "BJJ") && (
            <CombatTemplateEditor
              template={editedTemplate as CombatTemplate}
              onChange={(t) => setEditedTemplate(t)}
            />
          )}
        </ScrollArea>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Template</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
