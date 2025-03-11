
export const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error(`Error parsing localStorage for ${key}:`, error)
      }
    }
  }
  return defaultValue
}

export const saveToLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving to localStorage for ${key}:`, error)
    }
  }
}

export const getTodayString = () => {
  const today = new Date()
  return today.toISOString().split("T")[0]
}
