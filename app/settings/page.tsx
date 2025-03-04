import { Navbar } from "@/components/navbar"

export default function SettingsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">App Preferences</h2>
            <p className="text-muted-foreground">Settings will be implemented in a future update.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

