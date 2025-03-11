"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { loadFromLocalStorage, saveToLocalStorage } from "./utils/localStorageUtils";

interface TimerContextType {
  timerState: "idle" | "running" | "paused" | "completed";
  isRunning: boolean;
  isBreak: boolean;
  elapsedTime: number;
  focusTime: number;
  breakTime: number;
  targetSessions: number;
  sessionsCompleted: number;
  timerTechnique: string;

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipToBreak: () => void;
  updateFocusTime: (time: number) => void;
  updateBreakTime: (time: number) => void;
  updateTargetSessions: (sessions: number) => void;
  setTimerTechnique: (technique: string) => void;

  // Events for other contexts to subscribe to
  onSessionComplete: (callback: () => void) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  // Use ref for callbacks to persist between renders
  const sessionCompleteCallbacksRef = useRef<Array<() => void>>([]);

  // Timer state
  const [timerState, setTimerState] = useState<"idle" | "running" | "paused" | "completed">(
    loadFromLocalStorage('timerState', "idle")
  );
  const [isBreak, setIsBreak] = useState(loadFromLocalStorage('isBreak', false));
  const [elapsedTime, setElapsedTime] = useState(loadFromLocalStorage('elapsedTime', 0));
  const [focusTime, setFocusTime] = useState(loadFromLocalStorage('focusTime', 0));
  const [breakTime, setBreakTime] = useState(loadFromLocalStorage('breakTime', 0));
  const [targetSessions, setTargetSessions] = useState(loadFromLocalStorage('targetSessions', 0));
  const [sessionsCompleted, setSessionsCompleted] = useState(loadFromLocalStorage('sessionsCompleted', 0));
  const [timerTechnique, setTimerTechnique] = useState(loadFromLocalStorage('timerTechnique', "pomodoro"));

  // Session completion callback storage
  const sessionCompleteCallbacks: Array<() => void> = [];

  // Timer functions
  const startTimer = () => {
    setTimerState("running");
  };

  const pauseTimer = () => {
    setTimerState("paused");
  };

  const resetTimer = () => {
    setTimerState("idle");
    setElapsedTime(0);
    setIsBreak(false);
  };

  const skipToBreak = () => {
    setIsBreak(true);
    setElapsedTime(0);
  };

  // Timer settings
  const updateFocusTime = (time: number) => {
    setFocusTime(time);
  };

  const updateBreakTime = (time: number) => {
    setBreakTime(time);
  };

  const updateTargetSessions = (sessions: number) => {
    setTargetSessions(sessions);
  };

  // Event registration
  const onSessionComplete = (callback: () => void) => {
    sessionCompleteCallbacksRef.current.push(callback);
    // Return function to unregister callback if needed
    return () => {
      const index = sessionCompleteCallbacksRef.current.indexOf(callback);
      if (index !== -1) {
        sessionCompleteCallbacksRef.current.splice(index, 1);
      }
    };
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState === "running") {
      interval = setInterval(() => {
        setElapsedTime((prev) => {
          const totalTime = isBreak ? breakTime * 60 : focusTime * 60;

          if (prev >= totalTime - 1) {
            clearInterval(interval);

            // If focus session completed, increment sessions
            if (!isBreak) {
              const newSessionsCompleted = Math.min(sessionsCompleted + 1, targetSessions);
              setSessionsCompleted(newSessionsCompleted);
              saveToLocalStorage('sessionsCompleted', newSessionsCompleted);

              // Notify listeners that a session completed
              console.log("Session completed, calling callbacks...");
              sessionCompleteCallbacksRef.current.forEach(callback => callback());

              setIsBreak(true);
              return 0;
            } else {
              setIsBreak(false);
              setTimerState("idle");
              return 0;
            }
          }

          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState, isBreak, focusTime, breakTime, targetSessions, sessionsCompleted]);

  // Use effects to save to localStorage when state changes
  useEffect(() => {
    saveToLocalStorage('timerState', timerState);
  }, [timerState]);

  useEffect(() => {
    saveToLocalStorage('isBreak', isBreak);
  }, [isBreak]);

  useEffect(() => {
    saveToLocalStorage('elapsedTime', elapsedTime);
  }, [elapsedTime]);

  useEffect(() => {
    saveToLocalStorage('focusTime', focusTime);
    saveToLocalStorage('breakTime', breakTime);
    saveToLocalStorage('targetSessions', targetSessions);
    saveToLocalStorage('sessionsCompleted', sessionsCompleted);
    saveToLocalStorage('timerTechnique', timerTechnique);
  }, [focusTime, breakTime, targetSessions, sessionsCompleted, timerTechnique]);

  const value = {
    timerState,
    isRunning: timerState === "running",
    isBreak,
    elapsedTime,
    focusTime,
    breakTime,
    targetSessions,
    sessionsCompleted,
    timerTechnique,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToBreak,
    updateFocusTime,
    updateBreakTime,
    updateTargetSessions,
    setTimerTechnique,
    onSessionComplete
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
