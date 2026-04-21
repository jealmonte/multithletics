import type {
  Exercise,
  Session,
  Template,
  HypertrophySession,
  ClimbingSession,
  CombatSession,
  HypertrophyTemplate,
  ClimbingTemplate,
  CombatTemplate,
} from "./types"

// Mock Exercises
export const exercises: Exercise[] = [
  {
    id: "ex-1",
    name: "Bench Press",
    category: "Hypertrophy",
    primaryMuscleGroup: "Chest",
    subRegion: "Mid",
  },
  {
    id: "ex-2",
    name: "Incline Dumbbell Press",
    category: "Hypertrophy",
    primaryMuscleGroup: "Chest",
    subRegion: "Upper",
  },
  {
    id: "ex-3",
    name: "Pull-ups",
    category: "Hypertrophy",
    primaryMuscleGroup: "Back",
    subRegion: "Lats",
  },
  {
    id: "ex-4",
    name: "Barbell Row",
    category: "Hypertrophy",
    primaryMuscleGroup: "Back",
    subRegion: "Upper Back",
  },
  {
    id: "ex-5",
    name: "Overhead Press",
    category: "Hypertrophy",
    primaryMuscleGroup: "Shoulders",
    subRegion: "Front Delt",
  },
  {
    id: "ex-6",
    name: "Lateral Raises",
    category: "Hypertrophy",
    primaryMuscleGroup: "Shoulders",
    subRegion: "Side Delt",
  },
  {
    id: "ex-7",
    name: "Barbell Curl",
    category: "Hypertrophy",
    primaryMuscleGroup: "Biceps",
    subRegion: "Long Head",
  },
  {
    id: "ex-8",
    name: "Tricep Pushdown",
    category: "Hypertrophy",
    primaryMuscleGroup: "Triceps",
    subRegion: "Lateral Head",
  },
  {
    id: "ex-9",
    name: "Squat",
    category: "Hypertrophy",
    primaryMuscleGroup: "Quads",
    subRegion: "Rectus Femoris",
  },
  {
    id: "ex-10",
    name: "Romanian Deadlift",
    category: "Hypertrophy",
    primaryMuscleGroup: "Hamstrings",
    subRegion: "Biceps Femoris",
  },
  {
    id: "ex-11",
    name: "Leg Press",
    category: "Hypertrophy",
    primaryMuscleGroup: "Quads",
    subRegion: "Vastus Lateralis",
  },
  {
    id: "ex-12",
    name: "Hip Thrust",
    category: "Hypertrophy",
    primaryMuscleGroup: "Glutes",
    subRegion: "Gluteus Maximus",
  },
  {
    id: "ex-13",
    name: "Crimp Hangs",
    category: "Climbing",
    primaryMuscleGroup: "Forearms",
    subRegion: "Flexors",
  },
  {
    id: "ex-14",
    name: "Open Hand Hangs",
    category: "Climbing",
    primaryMuscleGroup: "Forearms",
    subRegion: "Flexors",
  },
]

// Helper to get current week dates
const getWeekDates = () => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - dayOfWeek)
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date.toISOString().split("T")[0]
  })
}

const weekDates = getWeekDates()

// Mock Sessions
export const sessions: Session[] = [
  // Sunday - Rest day
  
  // Monday - Upper A
  {
    id: "sess-1",
    name: "Upper A",
    category: "Hypertrophy",
    date: weekDates[1],
    status: "Completed",
    plannedDuration: 75,
    actualDuration: 80,
    notes: "Good session, felt strong",
    exercises: [
      {
        exerciseId: "ex-1",
        exerciseName: "Bench Press",
        primaryMuscleGroup: "Chest",
        subRegion: "Mid",
        sets: [
          { weight: 225, reps: 8 },
          { weight: 225, reps: 8 },
          { weight: 225, reps: 7 },
        ],
      },
      {
        exerciseId: "ex-3",
        exerciseName: "Pull-ups",
        primaryMuscleGroup: "Back",
        subRegion: "Lats",
        sets: [
          { weight: 45, reps: 10 },
          { weight: 45, reps: 9 },
          { weight: 45, reps: 8 },
        ],
      },
      {
        exerciseId: "ex-5",
        exerciseName: "Overhead Press",
        primaryMuscleGroup: "Shoulders",
        subRegion: "Front Delt",
        sets: [
          { weight: 135, reps: 8 },
          { weight: 135, reps: 7 },
          { weight: 135, reps: 6 },
        ],
      },
      {
        exerciseId: "ex-7",
        exerciseName: "Barbell Curl",
        primaryMuscleGroup: "Biceps",
        subRegion: "Long Head",
        sets: [
          { weight: 85, reps: 12 },
          { weight: 85, reps: 10 },
        ],
      },
    ],
  } as HypertrophySession,
  
  // Tuesday - Board Power
  {
    id: "sess-2",
    name: "Board Power",
    category: "Climbing",
    date: weekDates[2],
    status: "Completed",
    plannedDuration: 90,
    actualDuration: 95,
    notes: "Projecting V8s on Kilter",
    blocks: [
      {
        id: "block-1",
        blockType: "Warmup",
        boardType: "None",
        gradeRange: "V0-V2",
        intensity: "Easy",
        duration: 15,
      },
      {
        id: "block-2",
        blockType: "No-hangs",
        boardType: "None",
        gradeRange: "",
        intensity: "Moderate",
        duration: 10,
      },
      {
        id: "block-3",
        blockType: "Limit board",
        boardType: "Kilter",
        gradeRange: "V6-V8",
        intensity: "Hard",
        duration: 45,
      },
      {
        id: "block-4",
        blockType: "Spray board",
        boardType: "Spray",
        gradeRange: "V4-V6",
        intensity: "Moderate",
        duration: 20,
      },
    ],
  } as ClimbingSession,
  
  // Wednesday - Muay Thai
  {
    id: "sess-3",
    name: "Muay Thai",
    category: "Muay Thai",
    date: weekDates[3],
    status: "Completed",
    plannedDuration: 90,
    actualDuration: 90,
    intensity: "Hard",
    notes: "Sparring rounds, worked on teeps",
  } as CombatSession,
  
  // Thursday - Lower
  {
    id: "sess-4",
    name: "Lower",
    category: "Hypertrophy",
    date: weekDates[4],
    status: "Planned",
    plannedDuration: 70,
    exercises: [
      {
        exerciseId: "ex-9",
        exerciseName: "Squat",
        primaryMuscleGroup: "Quads",
        subRegion: "Rectus Femoris",
        sets: [
          { weight: 315, reps: 6 },
          { weight: 315, reps: 6 },
          { weight: 315, reps: 6 },
        ],
      },
      {
        exerciseId: "ex-10",
        exerciseName: "Romanian Deadlift",
        primaryMuscleGroup: "Hamstrings",
        subRegion: "Biceps Femoris",
        sets: [
          { weight: 225, reps: 10 },
          { weight: 225, reps: 10 },
          { weight: 225, reps: 10 },
        ],
      },
      {
        exerciseId: "ex-11",
        exerciseName: "Leg Press",
        primaryMuscleGroup: "Quads",
        subRegion: "Vastus Lateralis",
        sets: [
          { weight: 450, reps: 12 },
          { weight: 450, reps: 12 },
        ],
      },
      {
        exerciseId: "ex-12",
        exerciseName: "Hip Thrust",
        primaryMuscleGroup: "Glutes",
        subRegion: "Gluteus Maximus",
        sets: [
          { weight: 275, reps: 12 },
          { weight: 275, reps: 12 },
        ],
      },
    ],
  } as HypertrophySession,
  
  // Friday - BJJ
  {
    id: "sess-5",
    name: "BJJ",
    category: "BJJ",
    date: weekDates[5],
    status: "Planned",
    plannedDuration: 90,
    intensity: "Moderate",
    notes: "Focus on guard passing",
  } as CombatSession,
  
  // Saturday - Tension Board
  {
    id: "sess-6",
    name: "Tension",
    category: "Climbing",
    date: weekDates[6],
    status: "Planned",
    plannedDuration: 75,
    blocks: [
      {
        id: "block-5",
        blockType: "Warmup",
        boardType: "None",
        gradeRange: "V0-V3",
        intensity: "Easy",
        duration: 15,
      },
      {
        id: "block-6",
        blockType: "Tension board",
        boardType: "Tension",
        gradeRange: "V5-V7",
        intensity: "Hard",
        duration: 50,
      },
    ],
  } as ClimbingSession,
  
  // Additional session on Tuesday - Upper B
  {
    id: "sess-7",
    name: "Upper B",
    category: "Hypertrophy",
    date: weekDates[2],
    status: "Planned",
    plannedDuration: 70,
    exercises: [
      {
        exerciseId: "ex-2",
        exerciseName: "Incline Dumbbell Press",
        primaryMuscleGroup: "Chest",
        subRegion: "Upper",
        sets: [
          { weight: 85, reps: 10 },
          { weight: 85, reps: 10 },
          { weight: 85, reps: 9 },
        ],
      },
      {
        exerciseId: "ex-4",
        exerciseName: "Barbell Row",
        primaryMuscleGroup: "Back",
        subRegion: "Upper Back",
        sets: [
          { weight: 185, reps: 10 },
          { weight: 185, reps: 10 },
          { weight: 185, reps: 9 },
        ],
      },
      {
        exerciseId: "ex-6",
        exerciseName: "Lateral Raises",
        primaryMuscleGroup: "Shoulders",
        subRegion: "Side Delt",
        sets: [
          { weight: 25, reps: 15 },
          { weight: 25, reps: 15 },
          { weight: 25, reps: 12 },
        ],
      },
      {
        exerciseId: "ex-8",
        exerciseName: "Tricep Pushdown",
        primaryMuscleGroup: "Triceps",
        subRegion: "Lateral Head",
        sets: [
          { weight: 60, reps: 15 },
          { weight: 60, reps: 15 },
        ],
      },
    ],
  } as HypertrophySession,
]

// Mock Templates
export const templates: Template[] = [
  // Hypertrophy Templates
  {
    id: "tmpl-1",
    name: "Upper A",
    category: "Hypertrophy",
    exercises: [
      {
        exerciseId: "ex-1",
        exerciseName: "Bench Press",
        primaryMuscleGroup: "Chest",
        subRegion: "Mid",
        defaultSets: 3,
        defaultReps: 8,
      },
      {
        exerciseId: "ex-3",
        exerciseName: "Pull-ups",
        primaryMuscleGroup: "Back",
        subRegion: "Lats",
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        exerciseId: "ex-5",
        exerciseName: "Overhead Press",
        primaryMuscleGroup: "Shoulders",
        subRegion: "Front Delt",
        defaultSets: 3,
        defaultReps: 8,
      },
      {
        exerciseId: "ex-7",
        exerciseName: "Barbell Curl",
        primaryMuscleGroup: "Biceps",
        subRegion: "Long Head",
        defaultSets: 2,
        defaultReps: 12,
      },
    ],
  } as HypertrophyTemplate,
  {
    id: "tmpl-2",
    name: "Upper B",
    category: "Hypertrophy",
    exercises: [
      {
        exerciseId: "ex-2",
        exerciseName: "Incline Dumbbell Press",
        primaryMuscleGroup: "Chest",
        subRegion: "Upper",
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        exerciseId: "ex-4",
        exerciseName: "Barbell Row",
        primaryMuscleGroup: "Back",
        subRegion: "Upper Back",
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        exerciseId: "ex-6",
        exerciseName: "Lateral Raises",
        primaryMuscleGroup: "Shoulders",
        subRegion: "Side Delt",
        defaultSets: 3,
        defaultReps: 15,
      },
      {
        exerciseId: "ex-8",
        exerciseName: "Tricep Pushdown",
        primaryMuscleGroup: "Triceps",
        subRegion: "Lateral Head",
        defaultSets: 2,
        defaultReps: 15,
      },
    ],
  } as HypertrophyTemplate,
  {
    id: "tmpl-3",
    name: "Lower",
    category: "Hypertrophy",
    exercises: [
      {
        exerciseId: "ex-9",
        exerciseName: "Squat",
        primaryMuscleGroup: "Quads",
        subRegion: "Rectus Femoris",
        defaultSets: 3,
        defaultReps: 6,
      },
      {
        exerciseId: "ex-10",
        exerciseName: "Romanian Deadlift",
        primaryMuscleGroup: "Hamstrings",
        subRegion: "Biceps Femoris",
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        exerciseId: "ex-11",
        exerciseName: "Leg Press",
        primaryMuscleGroup: "Quads",
        subRegion: "Vastus Lateralis",
        defaultSets: 2,
        defaultReps: 12,
      },
      {
        exerciseId: "ex-12",
        exerciseName: "Hip Thrust",
        primaryMuscleGroup: "Glutes",
        subRegion: "Gluteus Maximus",
        defaultSets: 2,
        defaultReps: 12,
      },
    ],
  } as HypertrophyTemplate,
  
  // Climbing Templates
  {
    id: "tmpl-4",
    name: "Board Power",
    category: "Climbing",
    blocks: [
      {
        blockType: "Warmup",
        boardType: "None",
        gradeRange: "V0-V2",
        intensity: "Easy",
        duration: 15,
      },
      {
        blockType: "No-hangs",
        boardType: "None",
        gradeRange: "",
        intensity: "Moderate",
        duration: 10,
      },
      {
        blockType: "Limit board",
        boardType: "Kilter",
        gradeRange: "V6-V8",
        intensity: "Hard",
        duration: 45,
      },
      {
        blockType: "Spray board",
        boardType: "Spray",
        gradeRange: "V4-V6",
        intensity: "Moderate",
        duration: 20,
      },
    ],
  } as ClimbingTemplate,
  {
    id: "tmpl-5",
    name: "Tension",
    category: "Climbing",
    blocks: [
      {
        blockType: "Warmup",
        boardType: "None",
        gradeRange: "V0-V3",
        intensity: "Easy",
        duration: 15,
      },
      {
        blockType: "Tension board",
        boardType: "Tension",
        gradeRange: "V5-V7",
        intensity: "Hard",
        duration: 50,
      },
    ],
  } as ClimbingTemplate,
  {
    id: "tmpl-6",
    name: "Endurance",
    category: "Climbing",
    blocks: [
      {
        blockType: "Warmup",
        boardType: "None",
        gradeRange: "V0-V2",
        intensity: "Easy",
        duration: 10,
      },
      {
        blockType: "Endurance circuit",
        boardType: "Kilter",
        gradeRange: "V3-V5",
        intensity: "Moderate",
        duration: 60,
      },
    ],
  } as ClimbingTemplate,
  
  // Combat Templates
  {
    id: "tmpl-7",
    name: "Muay Thai",
    category: "Muay Thai",
    plannedDuration: 90,
    notes: "Standard class format",
  } as CombatTemplate,
  {
    id: "tmpl-8",
    name: "BJJ",
    category: "BJJ",
    plannedDuration: 90,
    notes: "Gi training",
  } as CombatTemplate,
]

// Helper function to get sessions for a specific date
export function getSessionsForDate(date: string): Session[] {
  return sessions.filter((s) => s.date === date)
}

// Helper function to get week range string
export function getWeekRangeString(): string {
  const start = new Date(weekDates[0])
  const end = new Date(weekDates[6])
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
  return `${start.toLocaleDateString("en-US", options)} – ${end.toLocaleDateString("en-US", options)}`
}

// Export week dates for use in components
export { weekDates }
