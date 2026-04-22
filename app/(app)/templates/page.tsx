"use client"

import { useEffect, useState } from "react"
import { TopBar } from "@/components/top-bar"
import { TemplateKanban } from "@/components/templates/template-kanban"
import { TemplateEditor } from "@/components/templates/template-editor"
import type {
  Template,
  HypertrophyTemplate,
  ClimbingTemplate,
  CombatTemplate,
  Exercise,
  MuscleGroup,
} from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

type DbSessionTemplate = {
  id: string
  user_id: string
  name: string
  session_category: "hypertrophy" | "climbing" | "muay_thai" | "bjj"
  description: string | null
  created_at: string
  updated_at: string
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

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setTemplates([])
      setLoading(false)
      return
    }

    const [
      { data: exerciseRows, error: exercisesError },
      { data: muscleGroupRows, error: mgError },
      { data: subregionRows, error: srError },
    ] = await Promise.all([
      supabase
        .from("exercises")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true }),
      supabase.from("muscle_groups").select("*"),
      supabase.from("muscle_subregions").select("*"),
    ])

    if (exercisesError) {
      console.error(exercisesError)
      setAvailableExercises([])
    } else {
      const muscleGroups = (muscleGroupRows ?? []) as any[]
      const subregions = (subregionRows ?? []) as any[]

      const uiExercises: Exercise[] = (exerciseRows ?? []).map((e: any) => {
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
    }

    const { data, error } = await supabase
      .from("session_templates")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error(error)
      setTemplates([])
      setLoading(false)
      return
    }

    const dbTemplates = (data ?? []) as DbSessionTemplate[]

    const uiTemplates: Template[] = dbTemplates.map((t) => {
      if (t.session_category === "hypertrophy") {
        const ht: HypertrophyTemplate = {
          id: t.id,
          name: t.name,
          category: "Hypertrophy",
          exercises: [], // will populate from template_exercises later
        }
        return ht
      }
      if (t.session_category === "climbing") {
        const ct: ClimbingTemplate = {
          id: t.id,
          name: t.name,
          category: "Climbing",
          blocks: [], // will populate from template_blocks later
        }
        return ct
      }
      const combatCat = t.session_category === "muay_thai" ? "Muay Thai" : "BJJ"
      const combat: CombatTemplate = {
        id: t.id,
        name: t.name,
        category: combatCat,
        plannedDuration: 60,
        notes: t.description ?? "",
      }
      return combat
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
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      alert("You must be logged in to add templates.")
      return
    }

    let sessionCategory: DbSessionTemplate["session_category"]
    if (category === "Hypertrophy") sessionCategory = "hypertrophy"
    else if (category === "Climbing") sessionCategory = "climbing"
    else if (category === "Muay Thai") sessionCategory = "muay_thai"
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
      .select("*")
      .single()

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    // Map new db row to UI template
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
        category: sessionCategory === "muay_thai" ? "Muay Thai" : "BJJ",
        plannedDuration: 60,
        notes: "",
      } as CombatTemplate
    }

    setTemplates((prev) => [...prev, newTemplate])
    setSelectedTemplate(newTemplate)
    setEditorOpen(true)
  }

  const handleSaveTemplate = async (updatedTemplate: Template) => {
    // For now, only update name/description in session_templates.
    // We'll wire exercises/blocks persistence in the next step.

    const {
      data: { user },
    } = await supabase.auth.getUser()
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
      sessionCategory = "muay_thai"
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

    setTemplates((prev) =>
      prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t))
    )
    setSelectedTemplate(updatedTemplate)
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