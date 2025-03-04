"use client"

import type React from "react"

import Link from "next/link"
import { Settings, Trophy, BarChart2, User, List } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-card">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center mr-8 text-xl font-bold text-accent">
          <span>StudyFocus</span>
        </Link>

        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          <NavItem href="/" icon={<List className="h-5 w-5" />} isActive={pathname === "/"} />
          <NavItem href="/achievements" icon={<Trophy className="h-5 w-5" />} isActive={pathname === "/achievements"} />
          <NavItem href="/stats" icon={<BarChart2 className="h-5 w-5" />} isActive={pathname === "/stats"} />
          <NavItem href="/profile" icon={<User className="h-5 w-5" />} isActive={pathname === "/profile"} />
        </nav>

        <div className="flex items-center">
          <Link href="/settings" className="p-2 rounded-md hover:bg-accent/10">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}

function NavItem({ href, icon, isActive }: { href: string; icon: React.ReactNode; isActive: boolean }) {
  return (
    <Link href={href} className={cn("flex items-center p-2 rounded-md hover:bg-accent/10", isActive && "text-accent")}>
      {icon}
    </Link>
  )
}

