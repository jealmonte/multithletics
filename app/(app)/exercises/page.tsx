"use client"

import { useEffect, useMemo, useState } from "react"
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
import { createClient } from "@/lib/supabase/client"
import type {
  DbExercise,
  DbExerciseSubregion,
  DbMuscleGroup,
  DbMuscleSubregion,
} from "@/lib/db-types"
import type { Exercise, ExerciseCategory, MuscleGroup } from "@/lib/types"

export default function ExercisesPage() {
  const supabase = createClient()

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [dbMuscleGroups, setDbMuscleGroups] = useState<DbMuscleGroup[]>([])
  const [dbSubregions, setDbSubregions] = useState<DbMuscleSubregion[]>([])
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [muscleFilter, setMuscleFilter] = useState<string>("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)

    const [
      { data: muscleGroupsData, error: mgError },
      { data: subregionsData, error: srError },
      { data: exercisesData, error: exError },
      { data: exerciseSubregionsData, error: esError },
    ] = await Promise.all([
      supabase.from("muscle_groups").select("*").order("name"),
      supabase.from("muscle_subregions").select("*").order("name"),
      supabase.from("exercises").select("*").order("created_at", { ascending: false }),
      supabase.from("exercise_subregions").select("*"),
    ])

    if (mgError) console.error(mgError)
    if (srError) console.error(srError)
    if (exError) console.error(exError)
    if (esError) console.error(esError)

    const muscleGroups = (muscleGroupsData ?? []) as DbMuscleGroup[]
    const subregions = (subregionsData ?? []) as DbMuscleSubregion[]
    const dbExercises = (exercisesData ?? []) as DbExercise[]
    const exerciseSubregions = (exerciseSubregionsData ?? []) as DbExerciseSubregion[]

    setDbMuscleGroups(muscleGroups)
    setDbSubregions(subregions)

    const uiExercises: Exercise[] = dbExercises.map((exercise) => {
      const mg = muscleGroups.find((m) => m.id === exercise.primary_muscle_group_id)

      const linkedSubregionIds = exerciseSubregions
        .filter((row) => row.exercise_id === exercise.id)
        .map((row) => row.muscle_subregion_id)

      let resolvedSubregions = subregions
        .filter((s) => linkedSubregionIds.includes(s.id))
        .map((s) => s.name)

      if (
        resolvedSubregions.length === 0 &&
        exercise.primary_subregion_id
      ) {
        const fallback = subregions.find((s) => s.id === exercise.primary_subregion_id)
        if (fallback) {
          resolvedSubregions = [fallback.name]
        }
      }

      return {
        id: exercise.id,
        name: exercise.name,
        category:
          exercise.category === "hypertrophy"
            ? "Hypertrophy"
            : exercise.category === "climbing"
            ? "Climbing"
            : "Other",
        primaryMuscleGroup: (mg?.name ?? "Chest") as MuscleGroup,
        subRegions: resolvedSubregions,
      }
    })

    setExercises(uiExercises)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === "all" || exercise.category === categoryFilter
      const matchesMuscle =
        muscleFilter === "all" || exercise.primaryMuscleGroup === muscleFilter

      return matchesSearch && matchesCategory && matchesMuscle
    })
  }, [exercises, search, categoryFilter, muscleFilter])

  const handleAddExercise = async (newExercise: Omit<Exercise, "id">) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in to add exercises.")
      return
    }

    const muscleGroup = dbMuscleGroups.find(
      (m) => m.name === newExercise.primaryMuscleGroup
    )

    if (!muscleGroup) {
      alert("Could not find the selected muscle group in the database.")
      return
    }

    const chosenSubregions = dbSubregions.filter(
      (s) =>
        s.muscle_group_id === muscleGroup.id &&
        newExercise.subRegions.includes(s.name)
    )

    if (chosenSubregions.length === 0) {
      alert("Please select at least one valid sub-region.")
      return
    }

    const primarySubregion = chosenSubregions[0]

    const dbCategory =
      newExercise.category === "Hypertrophy"
        ? "hypertrophy"
        : newExercise.category === "Climbing"
        ? "climbing"
        : "other"

    const { data: insertedExercise, error: insertError } = await supabase
      .from("exercises")
      .insert({
        user_id: user.id,
        name: newExercise.name,
        category: dbCategory,
        primary_muscle_group_id: muscleGroup.id,
        primary_subregion_id: primarySubregion.id,
      })
      .select("*")
      .single()

    if (insertError || !insertedExercise) {
      console.error(insertError)
      alert(insertError?.message ?? "Failed to insert exercise.")
      return
    }

    const joinRows = chosenSubregions.map((subregion) => ({
      exercise_id: insertedExercise.id,
      muscle_subregion_id: subregion.id,
    }))

    const { error: joinError } = await supabase
      .from("exercise_subregions")
      .insert(joinRows)

    if (joinError) {
      console.error(joinError)
      alert(joinError.message)
      return
    }

    await loadData()
    setModalOpen(false)
  }

  const categories: ExerciseCategory[] = ["Hypertrophy", "Climbing", "Other"]
  const muscleGroups = dbMuscleGroups.map((g) => g.name as MuscleGroup)

  return (
    <div className="flex h-screen flex-col">
      <TopBar title="Exercises" showWeekRange={false} />

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative min-w-[200px] max-w-md flex-1">
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

        <p className="mb-4 text-sm text-muted-foreground">
          {loading
            ? "Loading exercises..."
            : `Showing ${filteredExercises.length} of ${exercises.length} exercises`}
        </p>

        <div className="rounded-md border">
          <ExerciseTable exercises={filteredExercises} onEdit={() => {}} />
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