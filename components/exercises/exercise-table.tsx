"use client"

import { Badge } from "@/components/ui/badge"
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
}

const categoryColors: Record<ExerciseCategory, string> = {
  Hypertrophy: "bg-blue-100 text-blue-800",
  Climbing: "bg-emerald-100 text-emerald-800",
  Other: "bg-gray-100 text-gray-800",
}

export function ExerciseTable({ exercises }: ExerciseTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Name</TableHead>
          <TableHead className="w-[150px]">Category</TableHead>
          <TableHead className="w-[180px]">Primary Muscle Group</TableHead>
          <TableHead>Sub-region</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exercises.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
              No exercises found
            </TableCell>
          </TableRow>
        ) : (
          exercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell className="font-medium">{exercise.name}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn("text-xs", categoryColors[exercise.category])}
                >
                  {exercise.category}
                </Badge>
              </TableCell>
              <TableCell>{exercise.primaryMuscleGroup}</TableCell>
              <TableCell className="text-muted-foreground">
                {exercise.subRegion}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
