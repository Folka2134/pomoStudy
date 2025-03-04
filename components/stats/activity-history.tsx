"use client"

import { useStudy } from "@/context/study-context"
import { Calendar } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const DAYS_IN_WEEK = 7
const WEEKS_TO_SHOW = 53 // Show about a year of data

export interface ActivityDay {
  date: string
  intensity: number
  minutes: number
}

export function ActivityHistory() {
  const { activityData } = useStudy()

  // Ensure we have data for the last 371 days (53 weeks * 7 days)
  const filledActivityData = fillMissingDays(activityData, WEEKS_TO_SHOW * DAYS_IN_WEEK)

  // Group activity data by week
  const weeks = []
  for (let i = 0; i < filledActivityData.length; i += DAYS_IN_WEEK) {
    weeks.push(filledActivityData.slice(i, i + DAYS_IN_WEEK))
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Activity History
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">Last 12 months</div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          <div className="flex text-xs text-gray-400 mb-1">
            <div className="w-8"></div>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="w-4 text-center">
                {day[0]}
              </div>
            ))}
          </div>
          <div className="flex">
            <div className="flex flex-col text-xs text-gray-400 mr-2">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                (month, index) => (
                  <div key={month} style={{ height: "16px", marginTop: index === 0 ? "0" : "12px" }}>
                    {month}
                  </div>
                ),
              )}
            </div>
            <div className="inline-flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <TooltipProvider key={dayIndex}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className={`w-4 h-4 rounded-sm ${getActivityColor(day.intensity)}`} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {formatDate(day.date)}: {day.minutes} minutes
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex space-x-1 mx-2">
          <div className="h-3 w-3 rounded-sm bg-green-100 dark:bg-green-900" />
          <div className="h-3 w-3 rounded-sm bg-green-300 dark:bg-green-700" />
          <div className="h-3 w-3 rounded-sm bg-green-500 dark:bg-green-500" />
          <div className="h-3 w-3 rounded-sm bg-green-700 dark:bg-green-300" />
          <div className="h-3 w-3 rounded-sm bg-green-900 dark:bg-green-100" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

function getActivityColor(intensity: number) {
  if (intensity === 0) return "bg-gray-100 dark:bg-gray-700"
  if (intensity === 1) return "bg-green-100 dark:bg-green-900"
  if (intensity === 2) return "bg-green-300 dark:bg-green-700"
  if (intensity === 3) return "bg-green-500 dark:bg-green-500"
  if (intensity === 4) return "bg-green-700 dark:bg-green-300"
  return "bg-green-900 dark:bg-green-100"
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
}

function fillMissingDays(data: ActivityDay[], daysToFill: number): ActivityDay[] {
  const filledData: ActivityDay[] = []
  const today = new Date()

  for (let i = daysToFill - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split("T")[0]

    const existingDay = data.find((day) => day.date === dateString)
    if (existingDay) {
      filledData.push(existingDay)
    } else {
      filledData.push({
        date: dateString,
        intensity: 0,
        minutes: 0,
      })
    }
  }

  return filledData
}

