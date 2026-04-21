"use client"

import { useState } from "react"
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
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import type { Exercise, ExerciseCategory, MuscleGroup } from "@/lib/types"
import { muscleSubRegions } from "@/lib/types"

interface AddExerciseModalProps {
  open: boolean
  onClose: () => void
  onAdd: (exercise: Omit<Exercise, "id">) => void
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

export function AddExerciseModal({ open, onClose, onAdd }: AddExerciseModalProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<ExerciseCategory | "">("")
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | "">("")
  const [subRegion, setSubRegion] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const availableSubRegions = muscleGroup
    ? muscleSubRegions[muscleGroup as MuscleGroup]
    : []

  const handleMuscleGroupChange = (value: MuscleGroup) => {
    setMuscleGroup(value)
    setSubRegion("") // Reset sub-region when muscle group changes
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
    if (!subRegion) {
      newErrors.subRegion = "Sub-region is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    onAdd({
      name: name.trim(),
      category: category as ExerciseCategory,
      primaryMuscleGroup: muscleGroup as MuscleGroup,
      subRegion,
    })

    // Reset form
    setName("")
    setCategory("")
    setMuscleGroup("")
    setSubRegion("")
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setName("")
    setCategory("")
    setMuscleGroup("")
    setSubRegion("")
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
          <DialogDescription>
            Add a new exercise to your personal library.
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
              Sub-region <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              value={subRegion}
              onValueChange={setSubRegion}
              disabled={!muscleGroup}
            >
              <SelectTrigger aria-invalid={!!errors.subRegion}>
                <SelectValue
                  placeholder={
                    muscleGroup
                      ? "Select sub-region"
                      : "Select muscle group first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableSubRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subRegion && <FieldError>{errors.subRegion}</FieldError>}
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Exercise</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
