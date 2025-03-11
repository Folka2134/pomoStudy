// "use client"
//
// import type React from "react"
// import { ThemeProvider } from "next-themes"
// import { useState, useEffect } from "react"
// import { AchievementsProvider } from "@/context/AchievementContext"
// import { TaskProvider } from "@/context/TaskContext"
// import { StatsProvider } from "@/context/StatsContext"
// import { TimerProvider } from "@/context/TimerContext"
// import { ActivityProvider } from "@/context/ActivityContext"
//
// export function Providers({ children }: { children: React.ReactNode }) {
//   const [mounted, setMounted] = useState(false)
//
//   useEffect(() => {
//     setMounted(true)
//   }, [])
//
//   if (!mounted) {
//     return <>{children}</>
//   }
//
//   return (
//     <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
//       <AchievementsProvider>
//         <StatsProvider>
//           <TaskProvider>
//             <TimerProvider>
//               <ActivityProvider>
//                 {children}
//               </ActivityProvider>
//             </TimerProvider>
//           </TaskProvider>
//         </StatsProvider>
//       </AchievementsProvider>
//     </ThemeProvider>
//   )
// }
//
