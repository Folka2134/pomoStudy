import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { AchievementsProvider } from "@/context/AchievementContext"
import { TaskProvider } from "@/context/TaskContext"
import { StatsProvider } from "@/context/StatsContext"
import { TimerProvider } from "@/context/TimerContext"
import { ActivityProvider } from "@/context/ActivityContext"
import { ThemeProvider } from "next-themes"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Study Focus",
  description: "A productivity app to boost your study sessions",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
        <TimerProvider>
          <StatsProvider>
            <ActivityProvider>
              <AchievementsProvider>
                <TaskProvider>
                  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    {children}
                  </ThemeProvider>
                </TaskProvider>
              </AchievementsProvider>
            </ActivityProvider>
          </StatsProvider>
        </TimerProvider>
      </body>
    </html>
  )
}

