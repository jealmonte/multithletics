"use client"

import { cn } from "@/lib/utils"
import type { Template, HypertrophyTemplate, ClimbingTemplate, CombatTemplate } from "@/lib/types"

interface TemplateCardProps {
  template: Template
  isSelected: boolean
  onClick: () => void
}

export function TemplateCard({ template, isSelected, onClick }: TemplateCardProps) {
  const getSubtitle = () => {
    if (template.category === "Hypertrophy") {
      const t = template as HypertrophyTemplate
      return `${t.exercises.length} exercises`
    }
    if (template.category === "Climbing") {
      const t = template as ClimbingTemplate
      return `${t.blocks.length} blocks`
    }
    const t = template as CombatTemplate
    return `${t.plannedDuration} min`
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border bg-card p-4 text-left transition-all hover:shadow-sm",
        isSelected && "ring-2 ring-foreground ring-offset-2"
      )}
    >
      <p className="font-medium">{template.name}</p>
      <p className="mt-1 text-sm text-muted-foreground">{getSubtitle()}</p>
    </button>
  )
}
