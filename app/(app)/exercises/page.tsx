"use client"

import { useState, useMemo } from "react"
import { Search, Plus } from "lucide-react"
import { TopBar } from "@/components/top-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExerciseTable } from "@/components/exercises/exercise-table"
import { AddExerciseModal } from "@/components/exercises/add-exercise-modal"
import { exercises as initialExercises } from "@/lib/mock-data"
import type { Exercise, ExerciseCategory, MuscleGroup } from "@/lib/types"

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

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [muscleFilter, setMuscleFilter] = useState<string>("all")
  const [modalOpen, setModalOpen] = useState(false)

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesCategory =
        categoryFilter === "all" || exercise.category === categoryFilter
      const matchesMuscle =
        muscleFilter === "all" || exercise.primaryMuscleGroup === muscleFilter

      return matchesSearch && matchesCategory && matchesMuscle
    })
  }, [exercises, search, categoryFilter, muscleFilter])

  const handleAddExercise = (newExercise: Omit<Exercise, "id">) => {
    const exercise: Exercise = {
      ...newExercise,
      id: `ex-${Date.now()}`,
    }
    setExercises([...exercises, exercise])
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar title="Exercises" showWeekRange={false} />

      <div className="flex-1 overflow-auto p-6">
        {/* Filters Row */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercises..."
              className="pl-9"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={muscleFilter} onValueChange={setMuscleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Muscle Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Muscles</SelectItem>
              {muscleGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => setModalOpen(true)} className="ml-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Exercise
          </Button>
        </div>

        {/* Results info */}
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {filteredExercises.length} of {exercises.length} exercises
        </p>

        {/* Table */}
        <div className="rounded-md border">
          <ExerciseTable exercises={filteredExercises} />
        </div>
      </div>

      <AddExerciseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddExercise}
      />
    </div>
  )
}
