"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type {
  ClimbingSession,
  ClimbingBlock,
  ClimbingBlockType,
  BoardType,
  Intensity,
} from "@/lib/types"

interface ClimbingEditorProps {
  session: ClimbingSession
  lastSession?: ClimbingSession
  onUpdate: (session: ClimbingSession) => void
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

function BlockRow({
  block,
  index,
  isEditable,
  onChange,
  onRemove,
}: {
  block: ClimbingBlock
  index: number
  isEditable: boolean
  onChange?: (index: number, block: ClimbingBlock) => void
  onRemove?: (index: number) => void
}) {
  if (!isEditable) {
    return (
      <div className="flex flex-col gap-1 border-b border-border py-2 last:border-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{block.blockType}</span>
          {block.boardType !== "None" && (
            <span className="text-xs text-muted-foreground">
              ({block.boardType})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {block.gradeRange && <span>{block.gradeRange}</span>}
          <Badge
            variant="secondary"
            className={cn("h-4 px-1.5 text-[10px]", intensityColors[block.intensity])}
          >
            {block.intensity}
          </Badge>
          <span>{block.duration} min</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-md border border-border p-3">
      <div className="flex items-center justify-between">
        <Select
          value={block.blockType}
          onValueChange={(value: ClimbingBlockType) =>
            onChange?.(index, { ...block, blockType: value })
          }
        >
          <SelectTrigger className="h-8 w-[160px]">
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
          className="h-6 w-6"
          onClick={() => onRemove?.(index)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Select
          value={block.boardType}
          onValueChange={(value: BoardType) =>
            onChange?.(index, { ...block, boardType: value })
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
            onChange?.(index, { ...block, gradeRange: e.target.value })
          }
          placeholder="Grade range"
          className="h-8 text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {intensities.map((intensity) => (
            <Button
              key={intensity}
              type="button"
              variant={block.intensity === intensity ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs",
                block.intensity === intensity && intensityColors[intensity]
              )}
              onClick={() => onChange?.(index, { ...block, intensity })}
            >
              {intensity}
            </Button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Input
            type="number"
            value={block.duration || ""}
            onChange={(e) =>
              onChange?.(index, { ...block, duration: Number(e.target.value) || 0 })
            }
            className="h-8 w-16 text-sm"
          />
          <span className="text-xs text-muted-foreground">min</span>
        </div>
      </div>
    </div>
  )
}

export function ClimbingEditor({
  session,
  lastSession,
  onUpdate,
}: ClimbingEditorProps) {
  const [blocks, setBlocks] = useState<ClimbingBlock[]>(session.blocks)

  const handleBlockChange = (index: number, block: ClimbingBlock) => {
    const newBlocks = [...blocks]
    newBlocks[index] = block
    setBlocks(newBlocks)
    onUpdate({ ...session, blocks: newBlocks })
  }

  const handleAddBlock = () => {
    const newBlock: ClimbingBlock = {
      id: `block-${Date.now()}`,
      blockType: "Other",
      boardType: "None",
      gradeRange: "",
      intensity: "Moderate",
      duration: 15,
      notes: "",
      exercises: [],
    }

    const newBlocks = [...blocks, newBlock]
    setBlocks(newBlocks)
    onUpdate({ ...session, blocks: newBlocks })
  }

  const handleRemoveBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index)
    setBlocks(newBlocks)
    onUpdate({ ...session, blocks: newBlocks })
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
          Last Time
        </h4>
        {lastSession ? (
          <div className="space-y-1">
            {lastSession.blocks.map((block, index) => (
              <BlockRow
                key={block.id}
                block={block}
                index={index}
                isEditable={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/50">No previous session</p>
        )}
      </div>

      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
          Today
        </h4>
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <BlockRow
              key={block.id}
              block={block}
              index={index}
              isEditable={true}
              onChange={handleBlockChange}
              onRemove={handleRemoveBlock}
            />
          ))}

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleAddBlock}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Block
          </Button>
        </div>
      </div>
    </div>
  )
}