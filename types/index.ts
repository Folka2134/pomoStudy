export interface ActivityDay {
  date: string;
  intensity: number;
  minutes: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  type: string;
  progress: number;
  target: number;
  icon: string;
}

export interface Level {
  name: string;
  number: number;
}
