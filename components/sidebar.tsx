"use client"

import { useState } from "react"
import { Flame, Clock } from "lucide-react"
import { TaskList } from "@/components/tasks/task-list"
import { TimerSettings } from "@/components/timer/timer-settings"
import { cn } from "@/lib/utils"
import { useStats } from "@/context/StatsContext"
import { useActivity } from "@/context/ActivityContext"

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<"tasks" | "settings">("tasks")
  const stats = useStats()
  const activity = useActivity()

  return (
    <div className="w-80 border-r border-border flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="p-4 border-b border-border">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-accent mb-2">
            <Flame className="h-5 w-5" />
            <span className="font-bold">{stats.streak} day streak</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>{stats.sessionsToday} sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>{formatTime(stats.focusedTimeToday)} focused</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("tasks")}
          className={cn("flex-1 p-2 text-sm font-medium", activeTab === "tasks" ? "border-b-2 border-accent" : "")}
        >
          Task List
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={cn("flex-1 p-2 text-sm font-medium", activeTab === "settings" ? "border-b-2 border-accent" : "")}
        >
          Timer Settings
        </button>
      </div>

      <div className="flex-1 overflow-auto">{activeTab === "tasks" ? <TaskList /> : <TimerSettings />}</div>
    </div>
  )
}

function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

