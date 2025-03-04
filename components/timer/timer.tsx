"use client"
import { Play, Pause, RotateCcw, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStudy } from "@/context/study-context"
import { cn } from "@/lib/utils"

export function Timer() {
  const {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToBreak,
    focusTime,
    breakTime,
    isRunning,
    isBreak,
    elapsedTime,
  } = useStudy()

  const totalTime = isBreak ? breakTime * 60 : focusTime * 60
  const remainingTime = totalTime - elapsedTime
  const progress = (elapsedTime / totalTime) * 100

  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60

  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke={isBreak ? "rgba(79, 70, 229, 0.8)" : "rgba(16, 185, 129, 0.8)"}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="progress-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold tracking-tighter">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="text-sm uppercase tracking-wider mt-2 text-muted-foreground">
            {isBreak ? "BREAK TIME" : "FOCUS SESSION"}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-8">
        <Button variant="outline" size="icon" onClick={resetTimer} className="rounded-full h-12 w-12">
          <RotateCcw className="h-5 w-5" />
        </Button>

        <Button
          onClick={isRunning ? pauseTimer : startTimer}
          className={cn(
            "rounded-full h-14 w-14 text-primary-foreground",
            isBreak ? "bg-indigo-600 hover:bg-indigo-700" : "bg-primary hover:bg-primary/90",
          )}
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>

        <Button variant="outline" size="icon" onClick={() => {}} className="rounded-full h-12 w-12">
          <ListTodo className="h-5 w-5" />
        </Button>
      </div>

      {!isBreak && !isRunning && (
        <Button variant="ghost" size="sm" onClick={skipToBreak} className="mt-4 text-xs text-muted-foreground">
          Skip to break
        </Button>
      )}
    </div>
  )
}

