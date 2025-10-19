import { UnifiedDashboard } from "@/components/unified-dashboard"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <UnifiedDashboard />
    </div>
  )
}
