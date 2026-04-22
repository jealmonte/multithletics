"use client"

import { useEffect, useState } from "react"
import { TopBar } from "@/components/top-bar"
import { TemplateKanban } from "@/components/templates/template-kanban"
import { TemplateEditor } from "@/components/templates/template-editor"
import { createClient } from "@/lib/supabase/client"
import type {
  Template,
  HypertrophyTemplate,
  ClimbingTemplate,
  CombatTemplate,
  Exercise,
  MuscleGroup,
  ClimbingBlock,
} from "@/lib/types"
import type { DbTemplateExercise, DbTemplateBlock } from "@/lib/db-types"

type DbSessionTemplate = {
  id: string
  user_id: string
  name: string
  session_category: "hypertrophy" | "climbing" | "muaythai" | "bjj"
  description: string | null
  created_at: string
  updated_at: string
}

function mapBlockTypeFromDb(value: string | null) {
  switch (value) {
    case "warmup":
      return "Warmup" as const
    case "no_hangs":
    case "nohangs":
      return "No-hangs" as const
    case "limit_board":
    case "limitboard":
      return "Limit board" as const
    case "tension_board":
    case "tensionboard":
      return "Tension board" as const
    case "endurance_circuit":
    case "endurancecircuit":
      return "Endurance circuit" as const
    case "spray_board":
    case "sprayboard":
      return "Spray board" as const
    case "outdoor_prep":
    case "outdoorprep":
      return "Outdoor prep" as const
    case "other":
    default:
      return "Other" as const
  }
}

function mapBoardTypeFromDb(value: string | null) {
  switch (value) {
    case "moonboard":
      return "Moonboard" as const
    case "kilter":
      return "Kilter" as const
    case "tension":
      return "Tension" as const
    case "spray":
      return "Spray" as const
    case "none":
    case null:
    default:
      return "None" as const
  }
}

function mapIntensityFromDb(value: string | null) {
  switch (value) {
    case "easy":
      return "Easy" as const
    case "moderate":
      return "Moderate" as const
    case "hard":
      return "Hard" as const
    default:
      return "Moderate" as const
  }
}

export default function TemplatesPage() {
  const supabase = createClient()
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([])

  const loadTemplates = async () => {
    setLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      setTemplates([])
      setLoading(false)
      return
    }

    const [
      { data: exerciseRows, error: exercisesError },
      { data: muscleGroupRows, error: mgError },
      { data: subregionRows, error: srError },
      { data: templateRows, error: templateError },
      { data: templateExerciseRows, error: templateExerciseError },
      { data: templateBlockRows, error: templateBlockError },
    ] = await Promise.all([
      supabase.from("exercises").select("*").eq("user_id", user.id).order("name", { ascending: true }),
      supabase.from("muscle_groups").select("*"),
      supabase.from("muscle_subregions").select("*"),
      supabase.from("session_templates").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
      supabase.from("template_exercises").select("*").order("order_index", { ascending: true }),
      supabase.from("template_blocks").select("*").order("order_index", { ascending: true }),
    ])

    if (exercisesError) console.error(exercisesError)
    if (mgError) console.error(mgError)
    if (srError) console.error(srError)
    if (templateError) console.error(templateError)
    if (templateExerciseError) console.error(templateExerciseError)
    if (templateBlockError) console.error(templateBlockError)

    const muscleGroups = (muscleGroupRows ?? []) as any[]
    const subregions = (subregionRows ?? []) as any[]

    const uiExercises: Exercise[] = ((exerciseRows ?? []) as any[]).map((e) => {
      const mg = muscleGroups.find((m) => m.id === e.primary_muscle_group_id)
      const sr = subregions.find((s) => s.id === e.primary_subregion_id)

      return {
        id: e.id,
        name: e.name,
        category:
          e.category === "hypertrophy"
            ? "Hypertrophy"
            : e.category === "climbing"
              ? "Climbing"
              : "Other",
        primaryMuscleGroup: (mg?.name ?? "Chest") as MuscleGroup,
        subRegions: sr ? [sr.name] : [],
      }
    })

    setAvailableExercises(uiExercises)

    const dbTemplates = (templateRows ?? []) as DbSessionTemplate[]
    const dbTemplateExercises = (templateExerciseRows ?? []) as DbTemplateExercise[]
    const dbTemplateBlocks = (templateBlockRows ?? []) as DbTemplateBlock[]

    const uiTemplates: Template[] = dbTemplates.map((t) => {
      if (t.session_category === "hypertrophy") {
        const exercises = dbTemplateExercises
          .filter((row) => row.template_id === t.id)
          .sort((a, b) => a.order_index - b.order_index)
          .map((row) => {
            const ex = uiExercises.find((e) => e.id === row.exercise_id)
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

        return {
          id: t.id,
          name: t.name,
          category: "Hypertrophy",
          exercises,
        } satisfies HypertrophyTemplate
      }

      if (t.session_category === "climbing") {
        const blocks = dbTemplateBlocks
          .filter((row) => row.template_id === t.id)
          .sort((a, b) => a.order_index - b.order_index)
          .map((row, index): ClimbingBlock => {
            const gradeRange =
              row.grade_min && row.grade_max
                ? `${row.grade_min}-${row.grade_max}`
                : row.grade_min || row.grade_max || ""

            return {
              id: row.id ?? `block-${index}`,
              blockType: mapBlockTypeFromDb(row.block_type),
              boardType: mapBoardTypeFromDb(row.board_type),
              gradeRange,
              intensity: mapIntensityFromDb(row.intensity),
              duration: row.planned_duration_min ?? 0,
              notes: row.notes ?? "",
              exercises: [],
            }
          })

        return {
          id: t.id,
          name: t.name,
          category: "Climbing",
          blocks,
        } satisfies ClimbingTemplate
      }

      const combatCategory = t.session_category === "muaythai" ? "Muay Thai" : "BJJ"

      return {
        id: t.id,
        name: t.name,
        category: combatCategory,
        plannedDuration: 60,
        notes: t.description ?? "",
      } satisfies CombatTemplate
    })

    setTemplates(uiTemplates)
    setLoading(false)
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setEditorOpen(true)
  }

  const handleAddTemplate = async (
    category: "Hypertrophy" | "Climbing" | "Muay Thai" | "BJJ"
  ) => {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      alert("You must be logged in to add templates.")
      return
    }

    let sessionCategory: DbSessionTemplate["session_category"]
    if (category === "Hypertrophy") sessionCategory = "hypertrophy"
    else if (category === "Climbing") sessionCategory = "climbing"
    else if (category === "Muay Thai") sessionCategory = "muaythai"
    else sessionCategory = "bjj"

    const name = `New ${category} Template`

    const { data, error } = await supabase
      .from("session_templates")
      .insert({
        user_id: user.id,
        name,
        session_category: sessionCategory,
        description: null,
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    const t = data as DbSessionTemplate

    let newTemplate: Template
    if (sessionCategory === "hypertrophy") {
      newTemplate = {
        id: t.id,
        name: t.name,
        category: "Hypertrophy",
        exercises: [],
      } as HypertrophyTemplate
    } else if (sessionCategory === "climbing") {
      newTemplate = {
        id: t.id,
        name: t.name,
        category: "Climbing",
        blocks: [],
      } as ClimbingTemplate
    } else {
      newTemplate = {
        id: t.id,
        name: t.name,
        category: sessionCategory === "muaythai" ? "Muay Thai" : "BJJ",
        plannedDuration: 60,
        notes: "",
      } as CombatTemplate
    }

    setTemplates((prev) => [...prev, newTemplate])
    setSelectedTemplate(newTemplate)
    setEditorOpen(true)
  }

  const handleSaveTemplate = async (updatedTemplate: Template) => {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    if (!user) return

    let sessionCategory: DbSessionTemplate["session_category"]
    let description: string | null = null

    if (updatedTemplate.category === "Hypertrophy") {
      sessionCategory = "hypertrophy"
      description = null
    } else if (updatedTemplate.category === "Climbing") {
      sessionCategory = "climbing"
      description = null
    } else if (updatedTemplate.category === "Muay Thai") {
      sessionCategory = "muaythai"
      description = (updatedTemplate as CombatTemplate).notes ?? null
    } else {
      sessionCategory = "bjj"
      description = (updatedTemplate as CombatTemplate).notes ?? null
    }

    const { error } = await supabase
      .from("session_templates")
      .update({
        name: updatedTemplate.name,
        session_category: sessionCategory,
        description,
      })
      .eq("id", updatedTemplate.id)
      .eq("user_id", user.id)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    setTemplates((prev) => prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)))
    setSelectedTemplate(updatedTemplate)
    await loadTemplates()
  }

  const handleCloseEditor = () => {
    setEditorOpen(false)
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar title="Templates" showWeekRange={false} />

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading templates...
          </div>
        ) : (
          <>
            <TemplateKanban
              templates={templates}
              selectedTemplateId={selectedTemplate?.id ?? null}
              onSelectTemplate={handleSelectTemplate}
              onAddTemplate={handleAddTemplate}
            />

            <TemplateEditor
              template={selectedTemplate}
              open={editorOpen}
              onClose={handleCloseEditor}
              onSave={handleSaveTemplate}
              availableExercises={availableExercises}
            />
          </>
        )}
      </div>
    </div>
  )
}