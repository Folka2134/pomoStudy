// contexts/ActivityContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  generateActivityData,
  getTodayString
} from "./utils/localStorageUtils";
import { ActivityDay } from "@/types";
import { useTimer } from "./TimerContext";
import { useStats } from "./StatsContext";

interface ActivityContextType {
  activityData: ActivityDay[];
  getActivityForDate: (date: string) => ActivityDay | undefined;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const timer = useTimer()
  const stats = useStats()

  // Activity
  const [activityData, setActivityData] = useState<ActivityDay[]>(
    loadFromLocalStorage('activityData', generateActivityData())
  );

  // Last login date for streak maintenance
  const [lastLoginDate, setLastLoginDate] = useState(
    loadFromLocalStorage('lastLoginDate', getTodayString())
  );

  // Helper function to get activity for a specific date
  const getActivityForDate = (date: string): ActivityDay | undefined => {
    return activityData.find(day => day.date === date);
  };

  // Check for daily streak maintenance
  useEffect(() => {
    const today = getTodayString();

    if (lastLoginDate !== today) {
      // It's a new day - check streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      // Find activity for yesterday
      const yesterdayActivity = getActivityForDate(yesterdayString);

      if (yesterdayActivity && yesterdayActivity.intensity > 0) {
        // Maintain streak
        stats.incrementStreak();
      } else {
        // Reset streak
        stats.resetStreak();
      }

      // Update last login date
      setLastLoginDate(today);
      saveToLocalStorage('lastLoginDate', today);
    }
  }, [lastLoginDate, stats]);

  // Subscribe to session completions to update activity data
  useEffect(() => {
    const unsubscribe = timer.onSessionComplete(() => {
      // Update activity data for today
      const today = getTodayString();
      const minutesAdded = timer.focusTime;

      const updatedActivityData = [...activityData];
      const todayIndex = updatedActivityData.findIndex(day => day.date === today);

      if (todayIndex >= 0) {
        updatedActivityData[todayIndex] = {
          ...updatedActivityData[todayIndex],
          minutes: updatedActivityData[todayIndex].minutes + minutesAdded,
          intensity: Math.min(4, Math.floor((updatedActivityData[todayIndex].minutes + minutesAdded) / 60))
        };
      } else {
        updatedActivityData.push({
          date: today,
          minutes: minutesAdded,
          intensity: 1
        });
      }

      setActivityData(updatedActivityData);
      saveToLocalStorage('activityData', updatedActivityData);
    });

    return unsubscribe;
  }, [timer, activityData]);

  // Save activity data changes
  useEffect(() => {
    saveToLocalStorage('activityData', activityData);
  }, [activityData]);

  const value = {
    activityData,
    getActivityForDate
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
}
