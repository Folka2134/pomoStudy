"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Task, Achievement, ActivityDay } from "@/types"
import { generateActivityData, getTodayString } from "./utils/localStorageUtils"

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
  updateLevel: (newLevel: { name: string; number: number }) => void
  updateLevelProgress: (progress: number) => void
  resetProgress: () => void

  // Achievements
  achievements: Achievement[]
  unlockAchievement: (id: string) => void
  updateAchievementProgress: (id: string, progress: number) => void

  // Activity
  activityData: ActivityDay[]
}

const StudyContext = createContext<StudyContextType | undefined>(undefined)

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(key)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (error) {
          console.error(`Error parsing localStorage for ${key}:`, error)
        }
      }
    }
    return defaultValue
  }

  const saveToLocalStorage = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(`Error saving to localStorage for ${key}:`, error)
      }
    }
  }

  // Timer state
  const [timerState, setTimerState] = useState<"idle" | "running" | "paused" | "completed">(
    loadFromLocalStorage('timerState', "idle")
  )
  const [isBreak, setIsBreak] = useState(loadFromLocalStorage('isBreak', false))
  const [elapsedTime, setElapsedTime] = useState(loadFromLocalStorage('elapsedTime', 0))
  const [focusTime, setFocusTime] = useState(loadFromLocalStorage('focusTime', 25))
  const [breakTime, setBreakTime] = useState(loadFromLocalStorage('breakTime', 5))
  const [targetSessions, setTargetSessions] = useState(loadFromLocalStorage('targetSessions', 4))
  const [sessionsCompleted, setSessionsCompleted] = useState(loadFromLocalStorage('sessionsCompleted', 2))
  const [timerTechnique, setTimerTechnique] = useState(loadFromLocalStorage('timerTechnique', "pomodoro"))

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(loadFromLocalStorage("tasks", [
  ]))

  // Stats
  const [streak, setStreak] = useState(loadFromLocalStorage('streak', 20))
  const [bestStreak, setBestStreak] = useState(loadFromLocalStorage('bestStreak', 20))
  const [sessionsToday, setSessionsToday] = useState(loadFromLocalStorage('sessionsToday', 2))
  const [focusedTimeToday, setFocusedTimeToday] = useState(loadFromLocalStorage('focusedTimeToday', 120))
  const [totalSessions, setTotalSessions] = useState(loadFromLocalStorage('totalSessions', 246))
  const [totalHours, setTotalHours] = useState(loadFromLocalStorage('totalHours', 158))
  const [totalMinutes, setTotalMinutes] = useState(loadFromLocalStorage('totalMinutes', 11))
  const [targetHours, setTargetHours] = useState(loadFromLocalStorage('targetHours', 200))
  const [dailyMotivation, setDailyMotivation] = useState(loadFromLocalStorage('dailyMotivation', "Focus on the process, not just the outcome"))
  const [focusTips, setFocusTips] = useState(loadFromLocalStorage('focusTips', [
    "Take a 2-minute break every 25 minutes to maintain peak focus",
    "Stay hydrated and keep a water bottle at your desk",
  ]))

  // Level
  const [level, setLevel] = useState(loadFromLocalStorage('level', { name: "Platinum", number: 6 }))
  const [levelProgress, setLevelProgress] = useState(loadFromLocalStorage('levelProgress', 57.2))
  const [nextLevel, setNextLevel] = useState(loadFromLocalStorage('nextLevel', "Diamond"))
  const [hoursToNextLevel, setHoursToNextLevel] = useState(loadFromLocalStorage('hoursToNextLevel', 43))

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(
    loadFromLocalStorage('achievements', [
      {
        id: "1",
        title: "Academic Comeback",
        description: "Complete 3 Sessions every day for 5 days",
        type: "streaks",
        unlocked: false,
        progress: 5,
        target: 5,
        icon: "trophy",
      },
    ])
  )

  // Activity
  const [activityData, setActivityData] = useState<ActivityDay[]>(
    loadFromLocalStorage('activityData', generateActivityData())
  )

  // Last login date for daily reset checks
  const [lastLoginDate, setLastLoginDate] = useState(
    loadFromLocalStorage('lastLoginDate', getTodayString())
  )

  // Check for daily reset needs
  useEffect(() => {
    const today = getTodayString()

    if (lastLoginDate !== today) {
      // It's a new day - reset daily metrics
      setSessionsToday(0)
      setFocusedTimeToday(0)
      setLastLoginDate(today)
      saveToLocalStorage('lastLoginDate', today)

      // Check for streak maintenance
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toISOString().split('T')[0]

      // Find activity for yesterday
      const yesterdayActivity = activityData.find(day => day.date === yesterdayString)

      if (yesterdayActivity && yesterdayActivity.intensity > 0) {
        // Maintain streak
        const newStreak = streak + 1
        setStreak(newStreak)
        saveToLocalStorage('streak', newStreak)

        // Update best streak if needed
        if (newStreak > bestStreak) {
          setBestStreak(newStreak)
          saveToLocalStorage('bestStreak', newStreak)
        }
      } else {
        // Reset streak
        setStreak(0)
        saveToLocalStorage('streak', 0)
      }

      // Update achievements that require daily tracking
      checkDailyAchievements()
    }
  }, [])

  // Achievement management functions
  const unlockAchievement = (id: string) => {
    const updatedAchievements = achievements.map(achievement =>
      achievement.id === id
        ? { ...achievement, unlocked: true }
        : achievement
    )
    setAchievements(updatedAchievements)
    saveToLocalStorage('achievements', updatedAchievements)
  }

  const updateAchievementProgress = (id: string, progress: number) => {
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.id === id) {
        const updatedProgress = progress
        const isComplete = updatedProgress >= achievement.target

        return {
          ...achievement,
          progress: updatedProgress,
          unlocked: isComplete ? true : achievement.unlocked
        }
      }
      return achievement
    })

    setAchievements(updatedAchievements)
    saveToLocalStorage('achievements', updatedAchievements)
  }

  // Utility function to check achievement progress after sessions
  const checkDailyAchievements = () => {
    // Implement logic to check and update achievements based on daily activities
    // This would be called after completing sessions or at day change
  }

  // Level management functions
  const updateLevel = (newLevel: { name: string; number: number }) => {
    setLevel(newLevel)
    saveToLocalStorage('level', newLevel)
  }

  const updateLevelProgress = (progress: number) => {
    setLevelProgress(progress)
    saveToLocalStorage('levelProgress', progress)

    // Check if level up needed
    if (progress >= 100) {
      // Level up logic
      const newLevelNumber = level.number + 1

      // Define level names as needed
      const levelNames = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster"]
      const newLevelName = levelNames[newLevelNumber] || "Legendary"

      updateLevel({ name: newLevelName, number: newLevelNumber })
      setLevelProgress(0)
      saveToLocalStorage('levelProgress', 0)

      // Update next level
      const nextLevelName = levelNames[newLevelNumber + 1] || "Legendary+"
      setNextLevel(nextLevelName)
      saveToLocalStorage('nextLevel', nextLevelName)
    }
  }

  // Function to reset all progress (for testing or user request)
  const resetProgress = () => {
    if (typeof window !== 'undefined') {
      // Clear specific localStorage items instead of all localStorage
      const keysToKeep = ['focusTime', 'breakTime', 'timerTechnique'] // Settings to preserve

      // Get keys to remove
      const keysToRemove = Object.keys(localStorage)
        .filter(key => key.startsWith('study_') && !keysToKeep.includes(key))

      // Remove keys
      keysToRemove.forEach(key => localStorage.removeItem(key))

      // Reset state to defaults
      setStreak(0)
      setBestStreak(0)
      setSessionsToday(0)
      setFocusedTimeToday(0)
      setTotalSessions(0)
      setTotalHours(0)
      setTotalMinutes(0)

      // Reset achievements
      const resetAchievements = achievements.map(achievement => ({
        ...achievement,
        unlocked: false,
        progress: 0
      }))
      setAchievements(resetAchievements)

      // Reset level
      setLevel({ name: "Bronze", number: 1 })
      setLevelProgress(0)
      setNextLevel("Silver")
      setHoursToNextLevel(10)

      // Could add a confirmation dialog before executing this function
    }
  }


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
              const newSessionsCompleted = Math.min(sessionsCompleted + 1, targetSessions)
              setSessionsCompleted(newSessionsCompleted)
              saveToLocalStorage('sessionsCompleted', newSessionsCompleted)

              // Update stats
              const newSessionsToday = sessionsToday + 1
              setSessionsToday(newSessionsToday)
              saveToLocalStorage('sessionsToday', newSessionsToday)

              const newTotalSessions = totalSessions + 1
              setTotalSessions(newTotalSessions)
              saveToLocalStorage('totalSessions', newTotalSessions)

              // Update focused time
              const minutesAdded = focusTime
              const newFocusedTimeToday = focusedTimeToday + minutesAdded
              setFocusedTimeToday(newFocusedTimeToday)
              saveToLocalStorage('focusedTimeToday', newFocusedTimeToday)

              // Update total time
              let newTotalHours = totalHours
              let newTotalMinutes = totalMinutes + minutesAdded

              if (newTotalMinutes >= 60) {
                newTotalHours += Math.floor(newTotalMinutes / 60)
                newTotalMinutes = newTotalMinutes % 60
              }

              setTotalHours(newTotalHours)
              setTotalMinutes(newTotalMinutes)
              saveToLocalStorage('totalHours', newTotalHours)
              saveToLocalStorage('totalMinutes', newTotalMinutes)

              // Update level progress based on completed focus time
              const progressIncrement = (minutesAdded / 60) / (hoursToNextLevel) * 100
              const newProgress = Math.min(levelProgress + progressIncrement, 100)
              updateLevelProgress(newProgress)

              // Update activity data for today
              const today = getTodayString()
              const updatedActivityData = [...activityData]
              const todayIndex = updatedActivityData.findIndex(day => day.date === today)

              if (todayIndex >= 0) {
                updatedActivityData[todayIndex] = {
                  ...updatedActivityData[todayIndex],
                  minutes: updatedActivityData[todayIndex].minutes + minutesAdded,
                  intensity: Math.min(4, Math.floor(newSessionsToday / 2))
                }
              } else {
                updatedActivityData.push({
                  date: today,
                  minutes: minutesAdded,
                  intensity: 1
                })
              }

              setActivityData(updatedActivityData)
              saveToLocalStorage('activityData', updatedActivityData)

              // Check achievements after completing a session
              checkDailyAchievements()

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
  }, [timerState, isBreak, focusTime, breakTime, targetSessions])

  // Use effects to save to localStorage when state changes
  useEffect(() => {
    saveToLocalStorage('timerState', timerState)
  }, [timerState])

  useEffect(() => {
    saveToLocalStorage('isBreak', isBreak)
  }, [isBreak])

  useEffect(() => {
    saveToLocalStorage('elapsedTime', elapsedTime)
  }, [elapsedTime])

  useEffect(() => {
    saveToLocalStorage('tasks', tasks)
  }, [tasks])

  useEffect(() => {
    saveToLocalStorage('focusTime', focusTime)
    saveToLocalStorage('breakTime', breakTime)
    saveToLocalStorage('targetSessions', targetSessions)
    saveToLocalStorage('sessionsCompleted', sessionsCompleted)
    saveToLocalStorage('timerTechnique', timerTechnique)
  }, [focusTime, breakTime, targetSessions, sessionsCompleted, timerTechnique])

  useEffect(() => { saveToLocalStorage('streak', streak) }, [streak])
  useEffect(() => { saveToLocalStorage('bestStreak', bestStreak) }, [bestStreak])
  useEffect(() => { saveToLocalStorage('sessionsToday', sessionsToday) }, [sessionsToday])
  useEffect(() => { saveToLocalStorage('focusedTimeToday', focusedTimeToday) }, [focusedTimeToday])
  useEffect(() => { saveToLocalStorage('totalSessions', totalSessions) }, [totalSessions])
  useEffect(() => { saveToLocalStorage('totalHours', totalHours) }, [totalHours])
  useEffect(() => { saveToLocalStorage('totalMinutes', totalMinutes) }, [totalMinutes])
  useEffect(() => { saveToLocalStorage('level', level) }, [level])
  useEffect(() => { saveToLocalStorage('levelProgress', levelProgress) }, [levelProgress])
  useEffect(() => { saveToLocalStorage('achievements', achievements) }, [achievements])
  useEffect(() => { saveToLocalStorage('activityData', activityData) }, [activityData])

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
    unlockAchievement,
    updateAchievementProgress,

    // Level management
    updateLevel,
    updateLevelProgress,
    resetProgress,

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

