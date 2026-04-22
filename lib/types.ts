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
  Chest: ["Upper Chest", "Mid Chest", "Lower Chest"],

  Back: [
    "Lats",
    "Upper Back",
    "Mid Traps / Rhomboids",
    "Lower Traps",
    "Spinal Erectors",
    "Teres Major",
  ],

  Shoulders: [
    "Front Delts",
    "Lateral Delts",
    "Rear Delts",
    "Rotator Cuff",
  ],

  Biceps: [
    "Long Head",
    "Short Head",
    "Brachialis",
    "Brachioradialis",
  ],

  Triceps: [
    "Long Head",
    "Lateral Head",
    "Medial Head",
  ],

  Forearms: [
    "Wrist Flexors",
    "Wrist Extensors",
    "Finger Flexors",
    "Pronators",
    "Supinators",
  ],

  Core: [
    "Rectus Abdominis",
    "Obliques",
    "Transverse Abdominis",
    "Hip Flexors",
    "QL",
  ],

  Quads: [
    "Rectus Femoris",
    "Vastus Lateralis",
    "Vastus Medialis",
    "Vastus Intermedius",
    "Adductors",
  ],

  Hamstrings: [
    "Biceps Femoris",
    "Semimembranosus",
    "Semitendinosus",
    "Hip Extension Bias",
    "Knee Flexion Bias",
  ],

  Glutes: [
    "Glute Max",
    "Glute Med",
    "Glute Min",
  ],

  Calves: [
    "Gastrocnemius",
    "Soleus",
    "Tibialis Anterior",
  ],
}

// Exercise
export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  primaryMuscleGroup: MuscleGroup
  subRegions: string[]
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
  subRegions: string[]
  targetRepMin?: number
  targetRepMax?: number
  sets: SetData[]
}

// Climbing block
export type ClimbingBlock = {
  id: string
  blockType: ClimbingBlockType
  boardType: BoardType
  gradeRange: string
  intensity: Intensity
  duration: number
  notes?: string
  exercises: ClimbingBlockExercise[]
}

export type ClimbingBlockExercise = {
  exerciseId: string
  exerciseName: string
  primaryMuscleGroup: MuscleGroup
  subRegions: string[]
  defaultSets: number
  targetRepMin: number
  targetRepMax: number
  notes?: string
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
    subRegions: string[]
    defaultSets: number
    targetRepMin: number
    targetRepMax: number
  }[]
}

export type ClimbingTemplate = {
  id: string
  name: string
  category: "Climbing"
  blocks: ClimbingBlock[]
}

export interface CombatTemplate {
  id: string
  name: string
  category: "Muay Thai" | "BJJ"
  plannedDuration: number
  notes?: string
}

export type Template = HypertrophyTemplate | ClimbingTemplate | CombatTemplate
