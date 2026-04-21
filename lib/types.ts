// Session Categories
export type SessionCategory = "Hypertrophy" | "Climbing" | "Muay Thai" | "BJJ"

// Session Status
export type SessionStatus = "Planned" | "Completed"

// Intensity levels
export type Intensity = "Easy" | "Moderate" | "Hard"

// Block types for climbing sessions
export type ClimbingBlockType = 
  | "Warmup"
  | "No-hangs"
  | "Limit board"
  | "Tension board"
  | "Endurance circuit"
  | "Spray board"
  | "Outdoor prep"
  | "Other"

// Board types
export type BoardType = "Moonboard" | "Kilter" | "Tension" | "Spray" | "None"

// Exercise categories
export type ExerciseCategory = "Hypertrophy" | "Climbing" | "Other"

// Muscle groups and sub-regions
export type MuscleGroup = 
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Biceps"
  | "Triceps"
  | "Forearms"
  | "Core"
  | "Quads"
  | "Hamstrings"
  | "Glutes"
  | "Calves"

export const muscleSubRegions: Record<MuscleGroup, string[]> = {
  Chest: ["Upper", "Mid", "Lower"],
  Back: ["Lats", "Upper Back", "Traps", "Lower Back"],
  Shoulders: ["Front Delt", "Side Delt", "Rear Delt"],
  Biceps: ["Long Head", "Short Head"],
  Triceps: ["Long Head", "Lateral Head", "Medial Head"],
  Forearms: ["Flexors", "Extensors", "Brachioradialis"],
  Core: ["Abs", "Obliques", "Lower Back"],
  Quads: ["Rectus Femoris", "Vastus Lateralis", "Vastus Medialis"],
  Hamstrings: ["Biceps Femoris", "Semimembranosus"],
  Glutes: ["Gluteus Maximus", "Gluteus Medius"],
  Calves: ["Gastrocnemius", "Soleus"],
}

// Exercise
export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  primaryMuscleGroup: MuscleGroup
  subRegion: string
}

// Set data for hypertrophy
export interface SetData {
  weight: number
  reps: number
}

// Exercise entry in a session
export interface SessionExercise {
  exerciseId: string
  exerciseName: string
  primaryMuscleGroup: MuscleGroup
  subRegion: string
  sets: SetData[]
}

// Climbing block
export interface ClimbingBlock {
  id: string
  blockType: ClimbingBlockType
  boardType: BoardType
  gradeRange: string
  intensity: Intensity
  duration: number // minutes
}

// Base session interface
export interface BaseSession {
  id: string
  name: string
  category: SessionCategory
  date: string // ISO date string
  status: SessionStatus
  plannedDuration: number // minutes
  actualDuration?: number
  notes?: string
}

// Hypertrophy session
export interface HypertrophySession extends BaseSession {
  category: "Hypertrophy"
  exercises: SessionExercise[]
}

// Climbing session
export interface ClimbingSession extends BaseSession {
  category: "Climbing"
  blocks: ClimbingBlock[]
}

// Combat session (Muay Thai or BJJ)
export interface CombatSession extends BaseSession {
  category: "Muay Thai" | "BJJ"
  intensity: Intensity
}

export type Session = HypertrophySession | ClimbingSession | CombatSession

// Templates
export interface HypertrophyTemplate {
  id: string
  name: string
  category: "Hypertrophy"
  exercises: {
    exerciseId: string
    exerciseName: string
    primaryMuscleGroup: MuscleGroup
    subRegion: string
    defaultSets: number
    defaultReps: number
  }[]
}

export interface ClimbingTemplate {
  id: string
  name: string
  category: "Climbing"
  blocks: Omit<ClimbingBlock, "id">[]
}

export interface CombatTemplate {
  id: string
  name: string
  category: "Muay Thai" | "BJJ"
  plannedDuration: number
  notes?: string
}

export type Template = HypertrophyTemplate | ClimbingTemplate | CombatTemplate
