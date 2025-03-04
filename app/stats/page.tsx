import { Navbar } from "@/components/navbar"
import { StatsOverview } from "@/components/stats/stats-overview"
import { ActivityHistory } from "@/components/stats/activity-history"
import { TotalProgress } from "@/components/stats/total-progress"

export default function StatsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Statistics</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsOverview />
          <TotalProgress />
        </div>

        <div className="mt-6">
          <ActivityHistory />
        </div>
      </div>
    </main>
  )
}

