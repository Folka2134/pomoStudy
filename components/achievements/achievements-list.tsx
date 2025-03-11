"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AchievementCard } from "@/components/achievements/achievement-card"
import { useAchievements } from "@/context/AchievementContext"

export function AchievementsList() {
  const achievements = useAchievements()
  const [filter, setFilter] = useState<"all" | "daily" | "streaks" | "progress">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAchievements = achievements.allAchievements.filter((achievement) => {
    if (filter !== "all" && achievement.type !== filter) {
      return false
    }

    if (searchQuery) {
      return (
        achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return true
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex space-x-2">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </FilterButton>
          <FilterButton active={filter === "daily"} onClick={() => setFilter("daily")}>
            Daily Challenges
          </FilterButton>
          <FilterButton active={filter === "streaks"} onClick={() => setFilter("streaks")}>
            Streaks
          </FilterButton>
          <FilterButton active={filter === "progress"} onClick={() => setFilter("progress")}>
            Total Progress
          </FilterButton>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  )
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={active ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
    >
      {children}
    </Button>
  )
}

