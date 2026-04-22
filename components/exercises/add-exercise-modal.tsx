"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import type { Exercise, ExerciseCategory, MuscleGroup } from "@/lib/types"
import { muscleSubRegions } from "@/lib/types"

interface AddExerciseModalProps {
  open: boolean
  onClose: () => void
  onAdd: (exercise: Omit<Exercise, "id">) => void | Promise<void>
  initialExercise?: Exercise | null
  mode?: "add" | "edit"
}

const categories: ExerciseCategory[] = ["Hypertrophy", "Climbing", "Other"]

const muscleGroups: MuscleGroup[] = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Core",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
]

export function AddExerciseModal({
  open,
  onClose,
  onAdd,
  initialExercise = null,
  mode = "add",
}: AddExerciseModalProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<ExerciseCategory | "">("")
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | "">("")
  const [subRegions, setSubRegions] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const availableSubRegions = useMemo(
    () => (muscleGroup ? muscleSubRegions[muscleGroup as MuscleGroup] : []),
    [muscleGroup]
  )

  const resetForm = () => {
    setName("")
    setCategory("")
    setMuscleGroup("")
    setSubRegions([])
    setErrors({})
    setSubmitting(false)
  }

  useEffect(() => {
    if (!open) return

    if (initialExercise) {
      setName(initialExercise.name)
      setCategory(initialExercise.category)
      setMuscleGroup(initialExercise.primaryMuscleGroup)
      setSubRegions(initialExercise.subRegions ?? [])
      setErrors({})
      setSubmitting(false)
    } else {
      resetForm()
    }
  }, [open, initialExercise])

  useEffect(() => {
    setSubRegions((prev) =>
      prev.filter((region) => availableSubRegions.includes(region))
    )
  }, [availableSubRegions])

  const handleMuscleGroupChange = (value: MuscleGroup) => {
    setMuscleGroup(value)
    setSubRegions([])
  }

  const toggleSubRegion = (region: string, checked: boolean) => {
    setSubRegions((prev) =>
      checked ? [...prev, region] : prev.filter((r) => r !== region)
    )
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!category) {
      newErrors.category = "Category is required"
    }
    if (!muscleGroup) {
      newErrors.muscleGroup = "Primary muscle group is required"
    }
    if (subRegions.length === 0) {
      newErrors.subRegion = "Select at least one sub-region"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    try {
      setSubmitting(true)

      await onAdd({
        name: name.trim(),
        category: category as ExerciseCategory,
        primaryMuscleGroup: muscleGroup as MuscleGroup,
        subRegions,
      })

      resetForm()
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (submitting) return
    resetForm()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Exercise" : "Add Exercise"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update an exercise in your personal library."
              : "Add a new exercise to your personal library."}
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-4 py-4">
          <Field>
            <FieldLabel>
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bench Press"
              aria-invalid={!!errors.name}
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>
              Category <span className="text-destructive">*</span>
            </FieldLabel>
            <Select value={category} onValueChange={(v) => setCategory(v as ExerciseCategory)}>
              <SelectTrigger aria-invalid={!!errors.category}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <FieldError>{errors.category}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>
              Primary Muscle Group <span className="text-destructive">*</span>
            </FieldLabel>
            <Select value={muscleGroup} onValueChange={handleMuscleGroupChange}>
              <SelectTrigger aria-invalid={!!errors.muscleGroup}>
                <SelectValue placeholder="Select muscle group" />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.muscleGroup && <FieldError>{errors.muscleGroup}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>
              Sub-regions <span className="text-destructive">*</span>
            </FieldLabel>

            <div className="max-h-56 space-y-2 overflow-auto rounded-md border p-3">
              {!muscleGroup ? (
                <p className="text-sm text-muted-foreground">Select muscle group first</p>
              ) : availableSubRegions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sub-regions available</p>
              ) : (
                availableSubRegions.map((region) => (
                  <label
                    key={region}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={subRegions.includes(region)}
                      onCheckedChange={(checked) =>
                        toggleSubRegion(region, checked === true)
                      }
                    />
                    <span>{region}</span>
                  </label>
                ))
              )}
            </div>

            {subRegions.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Selected: {subRegions.join(", ")}
              </p>
            )}

            {errors.subRegion && <FieldError>{errors.subRegion}</FieldError>}
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting
              ? mode === "edit"
                ? "Saving..."
                : "Adding..."
              : mode === "edit"
              ? "Save Changes"
              : "Add Exercise"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}