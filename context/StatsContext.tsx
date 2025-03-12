"use client";

import React, { createContext, useState, useContext, useReducer, useEffect } from "react";
import { loadFromLocalStorage, saveToLocalStorage, getTodayString } from "./utils/localStorageUtils";
import { useTimer } from "./TimerContext";
import { Level } from "@/types";

// Constants
const LEVEL_NAMES = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster"];
const DEFAULT_FOCUS_TIPS = [
  "Take a 2-minute break every 25 minutes to maintain peak focus",
  "Stay hydrated and keep a water bottle at your desk",
];
const DEFAULT_MOTIVATION = "Focus on the process, not just the outcome";

// Types
interface StatsState {
  streak: number;
  bestStreak: number;
  sessionsToday: number;
  focusedTimeToday: number;
  totalSessions: number;
  totalHours: number;
  totalMinutes: number;
  targetHours: number;
  levelInfo: {
    level: Level;
    progress: number;
    nextLevel: string;
    hoursToNextLevel: number;
  };
  dailyMotivation: string;
  focusTips: string[];
  lastLoginDate: string;
}

interface StatsContextType extends StatsState {
  updateDailyMotivation: (text: string) => void;
  updateLevel: (newLevel: Level) => void;
  updateLevelProgress: (progress: number) => void;
  resetProgress: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  isDayChange: boolean;
}

// Action types
type StatsAction =
  | { type: 'INCREMENT_STREAK' }
  | { type: 'RESET_STREAK' }
  | { type: 'UPDATE_DAILY_MOTIVATION', payload: string }
  | { type: 'UPDATE_LEVEL', payload: Level }
  | { type: 'UPDATE_LEVEL_PROGRESS', payload: number }
  | { type: 'COMPLETE_SESSION', payload: number }
  | { type: 'RESET_DAILY_STATS' }
  | { type: 'RESET_ALL_PROGRESS' };

// Initial state loader
const loadInitialState = (): StatsState => {
  return {
    streak: loadFromLocalStorage('streak', 0),
    bestStreak: loadFromLocalStorage('bestStreak', 0),
    sessionsToday: loadFromLocalStorage('sessionsToday', 0),
    focusedTimeToday: loadFromLocalStorage('focusedTimeToday', 0),
    totalSessions: loadFromLocalStorage('totalSessions', 0),
    totalHours: loadFromLocalStorage('totalHours', 0),
    totalMinutes: loadFromLocalStorage('totalMinutes', 0),
    targetHours: loadFromLocalStorage('targetHours', 0),
    levelInfo: {
      level: loadFromLocalStorage('level', { name: "Bronze", number: 1 }),
      progress: loadFromLocalStorage('levelProgress', 0),
      nextLevel: loadFromLocalStorage('nextLevel', "Silver"),
      hoursToNextLevel: loadFromLocalStorage('hoursToNextLevel', 10),
    },
    dailyMotivation: loadFromLocalStorage('dailyMotivation', DEFAULT_MOTIVATION),
    focusTips: loadFromLocalStorage('focusTips', DEFAULT_FOCUS_TIPS),
    lastLoginDate: loadFromLocalStorage('lastLoginDate', getTodayString()),
  };
};

// Helper functions
const calculateLevelUp = (currentLevel: Level) => {
  const newLevelNumber = currentLevel.number + 1;
  const newLevelName = LEVEL_NAMES[newLevelNumber] || "Legendary";
  const nextLevelName = LEVEL_NAMES[newLevelNumber + 1] || "Legendary+";
  const newHoursToNextLevel = 10 * (newLevelNumber + 1);

  return {
    level: { name: newLevelName, number: newLevelNumber },
    nextLevel: nextLevelName,
    hoursToNextLevel: newHoursToNextLevel,
    progress: 0,
  };
};

// Reducer function
const statsReducer = (state: StatsState, action: StatsAction): StatsState => {
  switch (action.type) {
    case 'INCREMENT_STREAK': {
      const newStreak = state.streak + 1;
      const newBestStreak = Math.max(newStreak, state.bestStreak);
      return {
        ...state,
        streak: newStreak,
        bestStreak: newBestStreak,
      };
    }

    case 'RESET_STREAK':
      return {
        ...state,
        streak: 0,
      };

    case 'UPDATE_DAILY_MOTIVATION':
      return {
        ...state,
        dailyMotivation: action.payload,
      };

    case 'UPDATE_LEVEL':
      return {
        ...state,
        levelInfo: {
          ...state.levelInfo,
          level: action.payload,
        },
      };

    case 'UPDATE_LEVEL_PROGRESS': {
      const newProgress = action.payload;
      
      // Check if level up is needed
      if (newProgress >= 100) {
        const newLevelInfo = calculateLevelUp(state.levelInfo.level);
        return {
          ...state,
          levelInfo: newLevelInfo,
        };
      }
      
      return {
        ...state,
        levelInfo: {
          ...state.levelInfo,
          progress: newProgress,
        },
      };
    }

    case 'COMPLETE_SESSION': {
      const minutesAdded = action.payload;
      const newSessionsToday = state.sessionsToday + 1;
      const newFocusedTimeToday = state.focusedTimeToday + minutesAdded;
      const newTotalSessions = state.totalSessions + 1;
      
      // Calculate new total hours and minutes
      const totalMinutesTemp = state.totalMinutes + minutesAdded;
      const additionalHours = Math.floor(totalMinutesTemp / 60);
      const newTotalMinutes = totalMinutesTemp % 60;
      const newTotalHours = state.totalHours + additionalHours;
      
      // Calculate level progress
      const progressIncrement = (minutesAdded / 60) / state.levelInfo.hoursToNextLevel * 100;
      const newProgress = Math.min(state.levelInfo.progress + progressIncrement, 100);
      
      // Check if level up is needed
      if (newProgress >= 100) {
        const newLevelInfo = calculateLevelUp(state.levelInfo.level);
        return {
          ...state,
          sessionsToday: newSessionsToday,
          focusedTimeToday: newFocusedTimeToday,
          totalSessions: newTotalSessions,
          totalHours: newTotalHours,
          totalMinutes: newTotalMinutes,
          levelInfo: newLevelInfo,
        };
      }
      
      return {
        ...state,
        sessionsToday: newSessionsToday,
        focusedTimeToday: newFocusedTimeToday,
        totalSessions: newTotalSessions,
        totalHours: newTotalHours,
        totalMinutes: newTotalMinutes,
        levelInfo: {
          ...state.levelInfo,
          progress: newProgress,
        },
      };
    }

    case 'RESET_DAILY_STATS':
      return {
        ...state,
        sessionsToday: 0,
        focusedTimeToday: 0,
        lastLoginDate: getTodayString(),
      };

    case 'RESET_ALL_PROGRESS':
      return {
        ...state,
        streak: 0,
        bestStreak: 0,
        sessionsToday: 0,
        focusedTimeToday: 0,
        totalSessions: 0,
        totalHours: 0,
        totalMinutes: 0,
        levelInfo: {
          level: { name: "Bronze", number: 1 },
          progress: 0,
          nextLevel: "Silver",
          hoursToNextLevel: 10,
        },
      };

    default:
      return state;
  }
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const timer = useTimer();
  const [state, dispatch] = useReducer(statsReducer, null, loadInitialState);
  const [isDayChange, setIsDayChange] = useState(false)

  // Check for daily reset
  useEffect(() => {
    const checkForDailyReset = () => {
      const today = getTodayString();
      if (state.lastLoginDate !== today) {
        dispatch({ type: 'RESET_DAILY_STATS' });
        setIsDayChange(true)

        setTimeout(() => {
          setIsDayChange(false)
        }, 1000);
      }
    };

    // Check on mount
    checkForDailyReset();
    
    // Check when window gains focus
    const handleFocus = () => checkForDailyReset();
    window.addEventListener('focus', handleFocus);
    
    // Check once per hour
    const intervalId = setInterval(checkForDailyReset, 3600000);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [state.lastLoginDate]);

  // Subscribe to timer session completions
  useEffect(() => {
    const handleSessionComplete = () => {
      dispatch({ type: 'COMPLETE_SESSION', payload: timer.focusTime });
    };

    const unsubscribe = timer.onSessionComplete(handleSessionComplete);
    return unsubscribe;
  }, [timer]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    // Save basic stats
    saveToLocalStorage('streak', state.streak);
    saveToLocalStorage('bestStreak', state.bestStreak);
    saveToLocalStorage('sessionsToday', state.sessionsToday);
    saveToLocalStorage('focusedTimeToday', state.focusedTimeToday);
    saveToLocalStorage('totalSessions', state.totalSessions);
    saveToLocalStorage('totalHours', state.totalHours);
    saveToLocalStorage('totalMinutes', state.totalMinutes);
    saveToLocalStorage('lastLoginDate', state.lastLoginDate);
    
    // Save level info
    saveToLocalStorage('level', state.levelInfo.level);
    saveToLocalStorage('levelProgress', state.levelInfo.progress);
    saveToLocalStorage('nextLevel', state.levelInfo.nextLevel);
    saveToLocalStorage('hoursToNextLevel', state.levelInfo.hoursToNextLevel);
    
    // Save customizable content
    saveToLocalStorage('dailyMotivation', state.dailyMotivation);
    saveToLocalStorage('focusTips', state.focusTips);
  }, [state]);

  // Public interface methods
  const updateDailyMotivation = (text: string) => {
    dispatch({ type: 'UPDATE_DAILY_MOTIVATION', payload: text });
  };

  const updateLevel = (newLevel: Level) => {
    dispatch({ type: 'UPDATE_LEVEL', payload: newLevel });
  };

  const updateLevelProgress = (progress: number) => {
    dispatch({ type: 'UPDATE_LEVEL_PROGRESS', payload: progress });
  };

  const resetProgress = () => {
    if (typeof window !== 'undefined') {
      // Clear specific localStorage items instead of all localStorage
      const keysToKeep = ['focusTime', 'breakTime', 'timerTechnique']; // Settings to preserve
      
      // Get keys to remove
      const keysToRemove = Object.keys(localStorage)
        .filter(key => !keysToKeep.includes(key));
      
      // Remove keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Reset state
      dispatch({ type: 'RESET_ALL_PROGRESS' });
      console.log("Progress reset")
    }
  };

  const incrementStreak = () => {
    dispatch({ type: 'INCREMENT_STREAK' });
  };

  const resetStreak = () => {
    dispatch({ type: 'RESET_STREAK' });
  };

  // Combine state and methods for context value
  const value: StatsContextType = {
    ...state,
    updateDailyMotivation,
    updateLevel,
    updateLevelProgress,
    resetProgress,
    incrementStreak,
    resetStreak,
    isDayChange,
    // For interface compatibility with original code
    level: state.levelInfo.level,
    levelProgress: state.levelInfo.progress,
    nextLevel: state.levelInfo.nextLevel,
    hoursToNextLevel: state.levelInfo.hoursToNextLevel,
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
