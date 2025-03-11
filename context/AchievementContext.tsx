"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loadFromLocalStorage,
  saveToLocalStorage
} from "./utils/localStorageUtils";
import { useTimer } from "./TimerContext";
import { useStats } from "./StatsContext";
import { useActivity } from "./ActivityContext";
import { Achievement } from "@/types";

interface AchievementsContextType {
  allAchievements: Achievement[];
  unlockAchievement: (id: string) => void;
  updateAchievementProgress: (id: string, progress: number) => void;
  checkAchievements: () => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  const timer = useTimer()
  const stats = useStats()
  const activity = useActivity()

  // Achievements
  const [allAchievements, setAchievements] = useState<Achievement[]>(
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
      // Add more default achievements here
    ])
  );

  // Achievement management functions
  const unlockAchievement = (id: string) => {
    const updatedAchievements = allAchievements.map(achievement =>
      achievement.id === id
        ? { ...achievement, unlocked: true }
        : achievement
    );
    setAchievements(updatedAchievements);
  };

  const updateAchievementProgress = (id: string, progress: number) => {
    const updatedAchievements = allAchievements.map(achievement => {
      if (achievement.id === id) {
        const updatedProgress = progress;
        const isComplete = updatedProgress >= achievement.target;

        return {
          ...achievement,
          progress: updatedProgress,
          unlocked: isComplete ? true : achievement.unlocked
        };
      }
      return achievement;
    });

    setAchievements(updatedAchievements);
  };

  // Utility function to check achievement progress
  const checkAchievements = () => {
    // Example implementation (to be customized based on your actual achievements)
    allAchievements.forEach(achievement => {
      if (achievement.unlocked) return;

      switch (achievement.type) {
        case "streaks":
          if (stats.streak >= achievement.target) {
            unlockAchievement(achievement.id);
          } else {
            updateAchievementProgress(achievement.id, stats.streak);
          }
          break;
        case "sessions":
          if (stats.totalSessions >= achievement.target) {
            unlockAchievement(achievement.id);
          } else {
            updateAchievementProgress(achievement.id, stats.totalSessions);
          }
          break;
        case "hours":
          const totalHoursFloat = stats.totalHours + (stats.totalMinutes / 60);
          if (totalHoursFloat >= achievement.target) {
            unlockAchievement(achievement.id);
          } else {
            updateAchievementProgress(achievement.id, totalHoursFloat);
          }
          break;
        // Add more achievement types as needed
      }
    });
  };

  // Subscribe to timer session completions to check achievements
  useEffect(() => {
    const unsubscribe = timer.onSessionComplete(() => {
      checkAchievements();
    });

    return unsubscribe;
  }, [timer, stats, allAchievements]);

  // Check achievements on mount and when relevant stats change
  useEffect(() => {
    checkAchievements();
  }, [stats.streak, stats.totalSessions, stats.totalHours]);

  // Save achievements changes
  useEffect(() => {
    saveToLocalStorage('achievements', allAchievements);
  }, [allAchievements]);

  const value = {
    allAchievements,
    unlockAchievement,
    updateAchievementProgress,
    checkAchievements
  };

  return <AchievementsContext.Provider value={value}>{children}</AchievementsContext.Provider>;
}

export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error("useAchievements must be used within a AchievementsProvider")
  }
  return context
}
