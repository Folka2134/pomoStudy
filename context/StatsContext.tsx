// contexts/StatsContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loadFromLocalStorage, saveToLocalStorage, getTodayString } from "./utils/localStorageUtils";
import { useTimer } from "./TimerContext";
import { Level } from "@/types";

interface StatsContextType {
  streak: number;
  bestStreak: number;
  sessionsToday: number;
  focusedTimeToday: number;
  totalSessions: number;
  totalHours: number;
  totalMinutes: number;
  targetHours: number;
  level: Level;
  levelProgress: number;
  nextLevel: string;
  hoursToNextLevel: number;
  dailyMotivation: string;
  focusTips: string[];

  updateDailyMotivation: (text: string) => void;
  updateLevel: (newLevel: Level) => void;
  updateLevelProgress: (progress: number) => void;
  resetProgress: () => void;

  // For integration with achievements
  incrementStreak: () => void;
  resetStreak: () => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  // Get timer to subscribe to session completions
  const timer = useTimer();

  // Stats
  const [streak, setStreak] = useState(loadFromLocalStorage('streak', 0));
  const [bestStreak, setBestStreak] = useState(loadFromLocalStorage('bestStreak', 0));
  const [sessionsToday, setSessionsToday] = useState(loadFromLocalStorage('sessionsToday', 0));
  const [focusedTimeToday, setFocusedTimeToday] = useState(loadFromLocalStorage('focusedTimeToday', 0));
  const [totalSessions, setTotalSessions] = useState(loadFromLocalStorage('totalSessions', 0));
  const [totalHours, setTotalHours] = useState(loadFromLocalStorage('totalHours', 0));
  const [totalMinutes, setTotalMinutes] = useState(loadFromLocalStorage('totalMinutes', 0));
  const [targetHours, setTargetHours] = useState(loadFromLocalStorage('targetHours', 0));
  const [dailyMotivation, setDailyMotivation] = useState(loadFromLocalStorage('dailyMotivation', "Focus on the process, not just the outcome"));
  const [focusTips, setFocusTips] = useState(loadFromLocalStorage('focusTips', [
    "Take a 2-minute break every 25 minutes to maintain peak focus",
    "Stay hydrated and keep a water bottle at your desk",
  ]));

  // Level
  const [level, setLevel] = useState(loadFromLocalStorage('level', { name: "Platinum", number: 6 }));
  const [levelProgress, setLevelProgress] = useState(loadFromLocalStorage('levelProgress', 57.2));
  const [nextLevel, setNextLevel] = useState(loadFromLocalStorage('nextLevel', "Diamond"));
  const [hoursToNextLevel, setHoursToNextLevel] = useState(loadFromLocalStorage('hoursToNextLevel', 43));

  // Last login date for daily reset checks
  const [lastLoginDate, setLastLoginDate] = useState(
    loadFromLocalStorage('lastLoginDate', getTodayString())
  );

  // Level management functions
  const updateLevel = (newLevel: Level) => {
    setLevel(newLevel);
    saveToLocalStorage('level', newLevel);
  };

  const updateLevelProgress = (progress: number) => {
    setLevelProgress(progress);
    saveToLocalStorage('levelProgress', progress);

    // Check if level up needed
    if (progress >= 100) {
      // Level up logic
      const newLevelNumber = level.number + 1;

      // Define level names as needed
      const levelNames = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster"];
      const newLevelName = levelNames[newLevelNumber] || "Legendary";

      updateLevel({ name: newLevelName, number: newLevelNumber });
      setLevelProgress(0);
      saveToLocalStorage('levelProgress', 0);

      // Update next level
      const nextLevelName = levelNames[newLevelNumber + 1] || "Legendary+";
      setNextLevel(nextLevelName);
      saveToLocalStorage('nextLevel', nextLevelName);
    }
  };

  const updateDailyMotivation = (text: string) => {
    setDailyMotivation(text);
    saveToLocalStorage('dailyMotivation', text);
  };

  // Streak management
  const incrementStreak = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    saveToLocalStorage('streak', newStreak);

    // Update best streak if needed
    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
      saveToLocalStorage('bestStreak', newStreak);
    }
  };

  const resetStreak = () => {
    setStreak(0);
    saveToLocalStorage('streak', 0);
  };

  // Function to reset all progress (for testing or user request)
  const resetProgress = () => {
    if (typeof window !== 'undefined') {
      // Clear specific localStorage items instead of all localStorage
      const keysToKeep = ['focusTime', 'breakTime', 'timerTechnique']; // Settings to preserve

      // Get keys to remove
      const keysToRemove = Object.keys(localStorage)
        .filter(key => !keysToKeep.includes(key));

      // Remove keys
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Reset state to defaults
      setStreak(0);
      setBestStreak(0);
      setSessionsToday(0);
      setFocusedTimeToday(0);
      setTotalSessions(0);
      setTotalHours(0);
      setTotalMinutes(0);

      // Reset level
      setLevel({ name: "Bronze", number: 1 });
      setLevelProgress(0);
      setNextLevel("Silver");
      setHoursToNextLevel(10);
    }
  };

  // Check for daily reset needs
  useEffect(() => {
    const today = getTodayString();

    if (lastLoginDate !== today) {
      // It's a new day - reset daily metrics
      setSessionsToday(0);
      setFocusedTimeToday(0);
      setLastLoginDate(today);
      saveToLocalStorage('lastLoginDate', today);
    }
  }, [lastLoginDate]);

  // Subscribe to timer session completions
  useEffect(() => {
    const handleSessionComplete = () => {
      // Use function form to access current state
      setSessionsToday(prev => {
        const newValue = prev + 1;
        console.log("Previous sessions: " + prev)
        console.log("New sessions: " + newValue)
        saveToLocalStorage('sessionsToday', newValue);
        return newValue;
      });

      setTotalSessions(prev => {
        const newValue = prev + 1;
        saveToLocalStorage('totalSessions', newValue);
        return newValue;
      });

      // Update focused time
      const minutesAdded = timer.focusTime;

      setFocusedTimeToday(prev => {
        const newValue = prev + minutesAdded;
        saveToLocalStorage('focusedTimeToday', newValue);
        return newValue;
      });

      // Update total time - use function form for all
      setTotalMinutes(prevMinutes => {
        const newMinutes = prevMinutes + minutesAdded;

        // If we have 60+ minutes, update hours too
        if (newMinutes >= 60) {
          setTotalHours(prevHours => {
            const hoursToAdd = Math.floor(newMinutes / 60);
            const newHours = prevHours + hoursToAdd;
            saveToLocalStorage('totalHours', newHours);
            return newHours;
          });

          const remainingMinutes = newMinutes % 60;
          saveToLocalStorage('totalMinutes', remainingMinutes);
          return remainingMinutes;
        } else {
          saveToLocalStorage('totalMinutes', newMinutes);
          return newMinutes;
        }
      });

      // Update level progress with function form too
      setLevelProgress(prevProgress => {
        const progressIncrement = (minutesAdded / 60) / hoursToNextLevel * 100;
        const newProgress = Math.min(prevProgress + progressIncrement, 100);
        saveToLocalStorage('levelProgress', newProgress);

        // Check for level up
        if (newProgress >= 100) {
          handleLevelUp();
        }

        return newProgress;
      });
    };

    // Separate function to handle level up
    const handleLevelUp = () => {
      // Get current level info
      setLevel(prevLevel => {
        const newLevelNumber = prevLevel.number + 1;
        const levelNames = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster"];
        const newLevelName = levelNames[newLevelNumber] || "Legendary";
        const newLevel = { name: newLevelName, number: newLevelNumber };

        saveToLocalStorage('level', newLevel);

        // Update next level
        const nextLevelName = levelNames[newLevelNumber + 1] || "Legendary+";
        setNextLevel(nextLevelName);
        saveToLocalStorage('nextLevel', nextLevelName);

        // Update hours needed
        const newHoursToNextLevel = 10 * (newLevelNumber + 1);
        setHoursToNextLevel(newHoursToNextLevel);
        saveToLocalStorage('hoursToNextLevel', newHoursToNextLevel);

        // Reset progress
        setLevelProgress(0);
        saveToLocalStorage('levelProgress', 0);

        return newLevel;
      });
    };

    const unsubscribe = timer.onSessionComplete(handleSessionComplete);

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [timer, hoursToNextLevel]); // Minimal dependencies

  // Save state changes to localStorage
  useEffect(() => { saveToLocalStorage('streak', streak); }, [streak]);
  useEffect(() => { saveToLocalStorage('bestStreak', bestStreak); }, [bestStreak]);
  useEffect(() => { saveToLocalStorage('sessionsToday', sessionsToday); }, [sessionsToday]);
  useEffect(() => { saveToLocalStorage('focusedTimeToday', focusedTimeToday); }, [focusedTimeToday]);
  useEffect(() => { saveToLocalStorage('totalSessions', totalSessions); }, [totalSessions]);
  useEffect(() => { saveToLocalStorage('totalHours', totalHours); }, [totalHours]);
  useEffect(() => { saveToLocalStorage('totalMinutes', totalMinutes); }, [totalMinutes]);
  useEffect(() => { saveToLocalStorage('level', level); }, [level]);
  useEffect(() => { saveToLocalStorage('levelProgress', levelProgress); }, [levelProgress]);

  const value = {
    streak,
    bestStreak,
    sessionsToday,
    focusedTimeToday,
    totalSessions,
    totalHours,
    totalMinutes,
    targetHours,
    level,
    levelProgress,
    nextLevel,
    hoursToNextLevel,
    dailyMotivation,
    focusTips,
    updateDailyMotivation,
    updateLevel,
    updateLevelProgress,
    resetProgress,
    incrementStreak,
    resetStreak
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
}
