"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { TemplateKanban } from "@/components/templates/template-kanban"
import { TemplateEditor } from "@/components/templates/template-editor"
import { templates as initialTemplates } from "@/lib/mock-data"
import type {
  Template,
  HypertrophyTemplate,
  ClimbingTemplate,
  CombatTemplate,
} from "@/lib/types"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setEditorOpen(true)
  }

  const handleAddTemplate = (
    category: "Hypertrophy" | "Climbing" | "Muay Thai" | "BJJ"
  ) => {
    const id = `tmpl-${Date.now()}`

    let newTemplate: Template

    if (category === "Hypertrophy") {
      newTemplate = {
        id,
        name: "New Template",
        category: "Hypertrophy",
        exercises: [],
      } as HypertrophyTemplate
    } else if (category === "Climbing") {
      newTemplate = {
        id,
        name: "New Template",
        category: "Climbing",
        blocks: [],
      } as ClimbingTemplate
    } else {
      newTemplate = {
        id,
        name: "New Template",
        category,
        plannedDuration: 60,
        notes: "",
      } as CombatTemplate
    }

    setTemplates([...templates, newTemplate])
    setSelectedTemplate(newTemplate)
    setEditorOpen(true)
  }

  const handleSaveTemplate = (updatedTemplate: Template) => {
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
        <TemplateKanban
          templates={templates}
          selectedTemplateId={selectedTemplate?.id ?? null}
          onSelectTemplate={handleSelectTemplate}
          onAddTemplate={handleAddTemplate}
        />
      </div>
      <TemplateEditor
        template={selectedTemplate}
        open={editorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveTemplate}
      />
    </div>
  )
}
