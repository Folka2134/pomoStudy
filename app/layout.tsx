import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { StudyProvider } from "@/context/study-context"

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
        <StudyProvider>{children}</StudyProvider>
      </body>
    </html>
  )
}

