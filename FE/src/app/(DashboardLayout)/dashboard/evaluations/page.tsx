import { EvaluationsList } from "@/components/evaluations-list"
import { Navigation } from "@/components/navigation"

export default function EvaluationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <EvaluationsList />
    </div>
  )
}
