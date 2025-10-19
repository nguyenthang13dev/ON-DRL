import { ResultsPage } from "@/components/results-page"
import { Navigation } from "@/components/navigation"

export default function Results() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ResultsPage />
    </div>
  )
}
