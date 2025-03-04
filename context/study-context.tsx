"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Task, Achievement, ActivityDay } from "@/types"

interface StudyContextType {
  // Timer state
  timerState: "idle" | "running" | "paused" | "completed"
  isRunning: boolean
  isBreak: boolean
  elapsedTime: number
  focusTime: number
  breakTime: number
  targetSessions: number
  sessionsCompleted: number
  timerTechnique: string

  // Timer actions
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  skipToBreak: () => void
  updateFocusTime: (time: number) => void
  updateBreakTime: (time: number) => void
  updateTargetSessions: (sessions: number) => void
  setTimerTechnique: (technique: string) => void

  // Tasks
  tasks: Task[]
  addTask: (text: string) => void
  removeTask: (id: string) => void
  toggleTask: (id: string) => void
  updateTaskPriority: (id: string, priority: number) => void

  // Stats
  streak: number
  bestStreak: number
  sessionsToday: number
  focusedTimeToday: number
  totalSessions: number
  totalHours: number
  totalMinutes: number
  targetHours: number
  level: { name: string; number: number }
  levelProgress: number
  nextLevel: string
  hoursToNextLevel: number
  dailyMotivation: string
  focusTips: string[]
  updateDailyMotivation: (text: string) => void

  // Achievements
  achievements: Achievement[]

  // Activity
  activityData: ActivityDay[]
}

const StudyContext = createContext<StudyContextType | undefined>(undefined)

export function StudyProvider({ children }: { children: React.ReactNode }) {
  // Timer state
  const [timerState, setTimerState] = useState<"idle" | "running" | "paused" | "completed">("idle")
  const [isBreak, setIsBreak] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [focusTime, setFocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [targetSessions, setTargetSessions] = useState(4)
  const [sessionsCompleted, setSessionsCompleted] = useState(2)
  const [timerTechnique, setTimerTechnique] = useState("pomodoro")

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Complete math homework", completed: false, priority: 4 },
    { id: "2", text: "Read chapter 5", completed: false, priority: 3 },
    { id: "3", text: "Prepare for presentation", completed: true, priority: 5 },
    { id: "4", text: "Review notes", completed: false, priority: 2 },
  ])

  // Stats
  const [streak, setStreak] = useState(20)
  const [bestStreak, setBestStreak] = useState(20)
  const [sessionsToday, setSessionsToday] = useState(2)
  const [focusedTimeToday, setFocusedTimeToday] = useState(120) // in minutes
  const [totalSessions, setTotalSessions] = useState(246)
  const [totalHours, setTotalHours] = useState(158)
  const [totalMinutes, setTotalMinutes] = useState(11)
  const [targetHours, setTargetHours] = useState(200)
  const [dailyMotivation, setDailyMotivation] = useState("Focus on the process, not just the outcome")
  const [focusTips, setFocusTips] = useState([
    "Take a 2-minute break every 25 minutes to maintain peak focus",
    "Stay hydrated and keep a water bottle at your desk",
  ])

  // Level
  const [level, setLevel] = useState({ name: "Platinum", number: 6 })
  const [levelProgress, setLevelProgress] = useState(57.2)
  const [nextLevel, setNextLevel] = useState("Diamond")
  const [hoursToNextLevel, setHoursToNextLevel] = useState(43)

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "Academic Comeback",
      description: "Complete 3 Sessions every day for 5 days",
      type: "streaks",
      unlocked: true,
      progress: 5,
      target: 5,
      icon: "trophy",
    },
    {
      id: "2",
      title: "Consistency Champion",
      description: "Complete at least 4 Sessions every day for 7 days",
      type: "streaks",
      unlocked: true,
      progress: 7,
      target: 7,
      icon: "flame",
    },
    {
      id: "3",
      title: "Daily Devotion",
      description: "Complete at least 1 Pomodoro every day for 10 days",
      type: "daily",
      unlocked: true,
      progress: 10,
      target: 10,
      icon: "heart",
    },
    {
      id: "4",
      title: "Dedication Master",
      description: "Complete at least 5 Sessions every day for 5 days",
      type: "daily",
      unlocked: true,
      progress: 5,
      target: 5,
      icon: "star",
    },
    {
      id: "5",
      title: "From cooked to cooking",
      description: "Complete at least 2 Sessions every day for 14 days",
      type: "streaks",
      unlocked: true,
      progress: 14,
      target: 14,
      icon: "calendar",
    },
    {
      id: "6",
      title: "Monthly Master",
      description: "Complete at least 3 Sessions every day for 30 days",
      type: "progress",
      unlocked: false,
      progress: 19,
      target: 30,
      icon: "calendar",
    },
    {
      id: "7",
      title: "Revenge? No, Just Growth",
      description: "Complete at least 8 Sessions every day for 7 days",
      type: "progress",
      unlocked: false,
      progress: 5,
      target: 7,
      icon: "shield",
    },
    {
      id: "8",
      title: "Marathon Runner",
      description: "Complete at least 6 Sessions every day for 21 days",
      type: "progress",
      unlocked: false,
      progress: 10,
      target: 21,
      icon: "zap",
    },
    {
      id: "9",
      title: "Focus Samurai",
      description: "Complete at least 5 Sessions for 10 days straight",
      type: "streaks",
      unlocked: true,
      progress: 10,
      target: 10,
      icon: "zap",
    },
    {
      id: "10",
      title: "Eternal Flame",
      description: "Complete at least 1 Pomodoro every day for 100 days",
      type: "progress",
      unlocked: false,
      progress: 20,
      target: 100,
      icon: "flame",
    },
    {
      id: "11",
      title: "Perfect Balance",
      description: "Complete at least 4 Sessions every day for 14 days",
      type: "daily",
      unlocked: true,
      progress: 14,
      target: 14,
      icon: "scale",
    },
  ])

  // Activity
  const [activityData, setActivityData] = useState<ActivityDay[]>(generateActivityData())

  // Timer functions
  const startTimer = () => {
    setTimerState("running")
  }

  const pauseTimer = () => {
    setTimerState("paused")
  }

  const resetTimer = () => {
    setTimerState("idle")
    setElapsedTime(0)
    setIsBreak(false)
  }

  const skipToBreak = () => {
    setIsBreak(true)
    setElapsedTime(0)
  }

  // Task functions
  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority: 1,
    }
    setTasks([...tasks, newTask])
  }

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const updateTaskPriority = (id: string, priority: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, priority } : task)))
  }

  // Timer settings
  const updateFocusTime = (time: number) => {
    setFocusTime(time)
  }

  const updateBreakTime = (time: number) => {
    setBreakTime(time)
  }

  const updateTargetSessions = (sessions: number) => {
    setTargetSessions(sessions)
  }

  const updateDailyMotivation = (text: string) => {
    setDailyMotivation(text)
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timerState === "running") {
      interval = setInterval(() => {
        setElapsedTime((prev) => {
          const totalTime = isBreak ? breakTime * 60 : focusTime * 60

          if (prev >= totalTime - 1) {
            clearInterval(interval)

            // If focus session completed, increment sessions
            if (!isBreak) {
              setSessionsCompleted((prev) => Math.min(prev + 1, targetSessions))
              setIsBreak(true)
              return 0
            } else {
              setIsBreak(false)
              setTimerState("idle")
              return 0
            }
          }

          return prev + 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [timerState, isBreak, focusTime, breakTime, targetSessions]) // Removed elapsedTime from dependencies

  const value = {
    // Timer state
    timerState,
    isRunning: timerState === "running",
    isBreak,
    elapsedTime,
    focusTime,
    breakTime,
    targetSessions,
    sessionsCompleted,
    timerTechnique,

    // Timer actions
    startTimer,
    pauseTimer,
    resetTimer,
    skipToBreak,
    updateFocusTime,
    updateBreakTime,
    updateTargetSessions,
    setTimerTechnique,

    // Tasks
    tasks,
    addTask,
    removeTask,
    toggleTask,
    updateTaskPriority,

    // Stats
    streak,
    bestStreak,
    sessionsToday,
    focusedTimeToday,
    totalSessions,
    totalHours,
    totalMinutes,
    targetHours,
    level,
    levelProgress,
    nextLevel,
    hoursToNextLevel,
    dailyMotivation,
    focusTips,
    updateDailyMotivation,

    // Achievements
    achievements,

    // Activity
    activityData,
  }

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
}

export function useStudy() {
  const context = useContext(StudyContext)
  if (context === undefined) {
    throw new Error("useStudy must be used within a StudyProvider")
  }
  return context
}

// Helper function to generate mock activity data
function generateActivityData(): ActivityDay[] {
  const days = 84 // 12 weeks
  const result: ActivityDay[] = []

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))

    // Generate random activity data
    const intensity = Math.floor(Math.random() * 5) // 0-4
    const minutes = intensity === 0 ? 0 : intensity * 30 + Math.floor(Math.random() * 30)

    result.push({
      date: date.toISOString().split("T")[0],
      intensity,
      minutes,
    })
  }

  // Make sure recent days have some activity to match the streak
  for (let i = 0; i < 20; i++) {
    const index = result.length - 1 - i
    if (index >= 0) {
      result[index].intensity = Math.max(1, Math.floor(Math.random() * 5))
      result[index].minutes = result[index].intensity * 30 + Math.floor(Math.random() * 30)
    }
  }

  return result
}

