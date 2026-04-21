"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TemplateCard } from "./template-card"
import type { Template } from "@/lib/types"

interface TemplateKanbanProps {
  templates: Template[]
  selectedTemplateId: string | null
  onSelectTemplate: (template: Template) => void
  onAddTemplate: (category: "Hypertrophy" | "Climbing" | "Muay Thai" | "BJJ") => void
}

const columns = [
  {
    title: "Hypertrophy Sessions",
    category: "Hypertrophy" as const,
    color: "bg-blue-50 border-blue-200",
  },
  {
    title: "Climbing Sessions",
    category: "Climbing" as const,
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    title: "Combat Sessions",
    categories: ["Muay Thai", "BJJ"] as const,
    color: "bg-orange-50 border-orange-200",
  },
]

export function TemplateKanban({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onAddTemplate,
}: TemplateKanbanProps) {
  const getTemplatesForColumn = (
    category: string | readonly string[]
  ): Template[] => {
    if (Array.isArray(category)) {
      return templates.filter((t) => category.includes(t.category))
    }
    return templates.filter((t) => t.category === category)
  }

  return (
    <div className="grid h-full grid-cols-3 gap-4 p-4">
      {columns.map((column) => {
        const columnTemplates = getTemplatesForColumn(
          "categories" in column ? column.categories : column.category
        )
        const addCategory =
          "categories" in column ? column.categories[0] : column.category

        return (
          <div
            key={column.title}
            className={`flex flex-col rounded-lg border ${column.color}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-inherit p-4">
              <h3 className="font-semibold">{column.title}</h3>
              <span className="text-sm text-muted-foreground">
                {columnTemplates.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-3 overflow-auto p-4">
              {columnTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplateId === template.id}
                  onClick={() => onSelectTemplate(template)}
                />
              ))}
            </div>

            {/* Add Button */}
            <div className="border-t border-inherit p-3">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onAddTemplate(addCategory)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
