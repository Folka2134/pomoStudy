import { ActivityDay } from "@/types";

// contexts/utils/localStorageUtils.ts
export const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error(`Error parsing localStorage for ${key}:`, error);
      }
    }
  }
  return defaultValue;
};

export const saveToLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage for ${key}:`, error);
    }
  }
};

// Helper function to generate mock activity data
export function generateActivityData(): ActivityDay[] {
  const days = 365; // Full year of data
  const result: ActivityDay[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));

    // Generate random activity data
    const intensity = Math.floor(Math.random() * 5); // 0-4
    const minutes = intensity === 0 ? 0 : intensity * 30 + Math.floor(Math.random() * 30);

    result.push({
      date: date.toISOString().split("T")[0],
      intensity,
      minutes,
    });
  }

  // Make sure recent days have some activity to match the streak
  for (let i = 0; i < 20; i++) {
    const index = result.length - 1 - i;
    if (index >= 0) {
      result[index].intensity = Math.max(1, Math.floor(Math.random() * 5));
      result[index].minutes = result[index].intensity * 30 + Math.floor(Math.random() * 30);
    }
  }

  return result;
}
