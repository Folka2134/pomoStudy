"use client"

import { Edit2, Star } from "lucide-react"
import { useStudy } from "@/context/study-context"
import { Button } from "@/components/ui/button"

export function StatsOverview() {
  const {
    level,
    levelProgress,
    nextLevel,
    totalHours,
    hoursToNextLevel,
    streak,
    bestStreak,
    dailyMotivation,
    focusTips,
    updateDailyMotivation,
  } = useStudy()

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-secondary rounded-md">
          <Star className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="font-semibold">{level.name}</h2>
          <div className="text-sm text-muted-foreground">Level {level.number}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{totalHours} hrs</span>
          <span>
            Progress to {nextLevel}: {hoursToNextLevel} hrs left
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full" style={{ width: `${levelProgress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-md p-3">
          <div className="text-accent font-bold text-2xl">{streak}</div>
          <div className="text-xs text-muted-foreground">DAY STREAK</div>
        </div>
        <div className="bg-secondary/50 rounded-md p-3">
          <div className="text-accent font-bold text-2xl">{bestStreak}</div>
          <div className="text-xs text-muted-foreground">BEST STREAK</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium flex items-center">
              <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
              DAILY MOTIVATION
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-sm italic pl-4">"{dailyMotivation}"</div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
            <div className="text-sm font-medium">FOCUS TIPS</div>
          </div>
          <ul className="space-y-2">
            {focusTips.map((tip, index) => (
              <li key={index} className="text-sm flex items-start pl-4">
                <span className="text-primary mr-2">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

