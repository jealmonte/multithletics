export type DbMuscleGroup = {
  id: string
  name: string
}

export type DbMuscleSubregion = {
  id: string
  muscle_group_id: string
  name: string
}

export type DbExercise = {
  id: string
  user_id: string
  name: string
  category: "hypertrophy" | "climbing" | "other"
  primary_muscle_group_id: string
  primary_subregion_id: string
  created_at: string
  updated_at: string
}

export type DbExerciseSubregion = {
  id: string
  exercise_id: string
  muscle_subregion_id: string
}

export type DbTemplateExercise = {
  id: string
  template_id: string
  exercise_id: string
  order_index: number
  default_sets: number
  target_rep_min: number
  target_rep_max: number
  notes: string | null
}

export type DbTemplateBlockExercise = {
  id: string
  template_id: string
  template_block_id: string
  exercise_id: string
  order_index: number
  default_sets: number
  target_rep_min: number
  target_rep_max: number
  notes: string | null
}

export type DbTemplateBlock = {
  id: string
  template_id: string
  block_type:
    | "warmup"
    | "no_hangs"
    | "limit_board"
    | "tension_board"
    | "endurance_circuit"
    | "spray_board"
    | "outdoor_prep"
    | "other"
  board_type: "moonboard" | "kilter" | "tension" | "spray" | "none"
  intensity: "easy" | "moderate" | "hard"
  grade_min: string | null
  grade_max: string | null
  planned_duration_min: number | null
  order_index: number
  notes: string | null
}