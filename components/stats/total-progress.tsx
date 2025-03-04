"use client"

import { useStudy } from "@/context/study-context"
import { Activity, Clock } from "lucide-react"

export function TotalProgress() {
  const { totalSessions, totalHours, totalMinutes, targetHours } = useStudy()

  const formattedTime = `${totalHours}h${totalMinutes > 0 ? `${totalMinutes}m` : ""}`
  const progressPercentage = (totalHours / targetHours) * 100

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold flex items-center mb-6">
        <Activity className="mr-2 h-5 w-5" />
        Total Progress
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center mb-2">
            <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
            <span className="text-sm text-muted-foreground">SESSIONS</span>
          </div>
          <div className="text-3xl font-bold text-purple-500">{totalSessions}</div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
            <span className="text-sm text-muted-foreground">HOURS</span>
          </div>
          <div className="text-3xl font-bold text-purple-500">{formattedTime}</div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">TARGET HOURS</span>
          </div>
          <div className="text-sm font-medium">{targetHours}hr</div>
        </div>

        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>
    </div>
  )
}

