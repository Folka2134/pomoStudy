import { Navbar } from "@/components/navbar"
import { Timer } from "@/components/timer/timer"
import { Sidebar } from "@/components/sidebar"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-4 flex items-center justify-center">
          <Timer />
        </div>
      </div>
    </main>
  )
}

