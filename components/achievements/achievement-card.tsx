import { Trophy, Flame, Heart, Star, Calendar, Shield, Zap, Scale } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Achievement } from "@/types"

interface AchievementCardProps {
  achievement: Achievement
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { title, description, unlocked, progress, target, icon } = achievement

  const progressPercentage = (progress / target) * 100

  return (
    <div className={cn("rounded-lg p-4 border", unlocked ? "bg-accent/20 border-accent" : "bg-card border-border")}>
      <div className="flex items-start space-x-3">
        <div
          className={cn("p-2 rounded-md", unlocked ? "text-accent bg-accent/10" : "text-muted-foreground bg-secondary")}
        >
          {getAchievementIcon(icon)}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            {unlocked && <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">Unlocked!</span>}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>

          {!unlocked && progress > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>
                  {progress}/{target}
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getAchievementIcon(iconName: string) {
  switch (iconName) {
    case "trophy":
      return <Trophy className="h-5 w-5" />
    case "flame":
      return <Flame className="h-5 w-5" />
    case "heart":
      return <Heart className="h-5 w-5" />
    case "star":
      return <Star className="h-5 w-5" />
    case "calendar":
      return <Calendar className="h-5 w-5" />
    case "shield":
      return <Shield className="h-5 w-5" />
    case "zap":
      return <Zap className="h-5 w-5" />
    case "scale":
      return <Scale className="h-5 w-5" />
    default:
      return <Trophy className="h-5 w-5" />
  }
}

