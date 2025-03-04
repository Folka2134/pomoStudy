import { Navbar } from "@/components/navbar"
import { AchievementsList } from "@/components/achievements/achievements-list"

export default function AchievementsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trophy"
              >
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </span>
            <h1 className="text-2xl font-bold">Achievements</h1>
          </div>
          <div className="text-accent font-bold">
            Unlocked: <span>18/27</span>
          </div>
        </div>

        <AchievementsList />
      </div>
    </main>
  )
}

