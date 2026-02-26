import { AdminShell } from "@/components/admin-shell"
import { ErrorBoundary } from "@/components/error-boundary"

export default function AdminPage() {
  return (
    <ErrorBoundary>
      <AdminShell />
    </ErrorBoundary>
  )
}
