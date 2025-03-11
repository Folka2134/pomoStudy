// contexts/TaskContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loadFromLocalStorage, saveToLocalStorage } from "./utils/localStorageUtils";
import { Task } from "@/types";

interface TaskContextType {
  allTasks: Task[];
  addTask: (text: string) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTaskPriority: (id: string, priority: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  // Tasks
  const [allTasks, setTasks] = useState<Task[]>(loadFromLocalStorage("tasks", []));

  // Task functions
  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority: 1,
    };
    setTasks([...allTasks, newTask]);
  };

  const removeTask = (id: string) => {
    setTasks(allTasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(allTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const updateTaskPriority = (id: string, priority: number) => {
    setTasks(allTasks.map((task) => (task.id === id ? { ...task, priority } : task)));
  };

  // Save tasks to localStorage when they change
  useEffect(() => {
    saveToLocalStorage('tasks', allTasks);
  }, [allTasks]);

  const value = {
    allTasks,
    addTask,
    removeTask,
    toggleTask,
    updateTaskPriority,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
