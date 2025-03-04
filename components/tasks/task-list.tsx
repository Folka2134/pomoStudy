"use client"

import type React from "react"

import { useState } from "react"
import { Trash2, Plus, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useStudy } from "@/context/study-context"

export function TaskList() {
  const { tasks, addTask, removeTask, toggleTask, updateTaskPriority } = useStudy()
  const [newTaskText, setNewTaskText] = useState("")

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(newTaskText)
      setNewTaskText("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Input
          placeholder="Enter new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleAddTask} size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-4">No tasks yet. Add one to get started!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-md bg-card border border-border"
            >
              <div className="flex items-center space-x-3 flex-1">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.text}</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-4 w-4 cursor-pointer ${
                        rating <= task.priority ? "fill-accent text-accent" : "text-muted-foreground"
                      }`}
                      onClick={() => updateTaskPriority(task.id, rating)}
                    />
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTask(task.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

