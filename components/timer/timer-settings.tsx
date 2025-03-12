"use client"
import { Clock, Plus, Minus } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTimer } from "@/context/TimerContext"
import { useStats } from "@/context/StatsContext"

export function TimerSettings() {
  const timer = useTimer()
  const stats = useStats()

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Timer Settings
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Management Technique</label>
          <Select value={timer.timerTechnique} onValueChange={timer.setTimerTechnique}>
            <SelectTrigger>
              <SelectValue placeholder="Select technique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pomodoro">Classic Pomodoro</SelectItem>
              <SelectItem value="52-17">52/17 Method</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {timer.timerTechnique === "pomodoro" && (
            <p className="text-xs text-muted-foreground">Traditional 25/5 split with 4 sessions</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Focus time (minutes)</label>
            <span className="text-sm">{timer.focusTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => timer.updateFocusTime(Math.max(1, timer.focusTime - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Slider
              value={[timer.focusTime]}
              min={1}
              max={60}
              step={1}
              onValueChange={(value) => timer.updateFocusTime(value[0])}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => timer.updateFocusTime(Math.min(60, timer.focusTime + 1))}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Break Length (minutes)</label>
            <span className="text-sm">{timer.breakTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => timer.updateBreakTime(Math.max(1, timer.breakTime - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Slider
              value={[timer.breakTime]}
              min={1}
              max={30}
              step={1}
              onValueChange={(value) => timer.updateBreakTime(value[0])}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => timer.updateBreakTime(Math.min(30, timer.breakTime + 1))}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Target Sessions</label>
            <span className="text-sm">{timer.targetSessions}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => timer.updateTargetSessions(Math.max(1, timer.targetSessions - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Slider
              value={[timer.targetSessions]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => timer.updateTargetSessions(value[0])}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => timer.updateTargetSessions(Math.min(10, timer.targetSessions + 1))}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Sessions Completed</span>
            <span className="font-medium">
              {timer.sessionsCompleted} / {timer.targetSessions}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${(timer.sessionsCompleted / timer.targetSessions) * 100}%` }}
            />
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-sm mb-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => stats.resetProgress()}>Reset Data</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

