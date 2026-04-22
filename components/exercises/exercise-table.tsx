"use client"

import { Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Exercise, ExerciseCategory } from "@/lib/types"

interface ExerciseTableProps {
  exercises: Exercise[]
  onEdit: (exercise: Exercise) => void
}

const categoryColors: Record<ExerciseCategory, string> = {
  Hypertrophy: "bg-blue-100 text-blue-800",
  Climbing: "bg-emerald-100 text-emerald-800",
  Other: "bg-gray-100 text-gray-800",
}

export function ExerciseTable({ exercises, onEdit }: ExerciseTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[260px]">Name</TableHead>
          <TableHead className="w-[140px]">Category</TableHead>
          <TableHead className="w-[180px]">Primary Muscle</TableHead>
          <TableHead>Sub-regions</TableHead>
          <TableHead className="w-[90px] text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exercises.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
              No exercises found
            </TableCell>
          </TableRow>
        ) : (
          exercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell className="font-medium">{exercise.name}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={cn("text-xs", categoryColors[exercise.category])}>
                  {exercise.category}
                </Badge>
              </TableCell>
              <TableCell>{exercise.primaryMuscleGroup}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.subRegions.map((region) => (
                    <Badge key={region} variant="outline" className="text-xs">
                      {region}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onEdit(exercise)}>
                  <Pencil className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}