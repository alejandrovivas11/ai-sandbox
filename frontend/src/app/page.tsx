import { Breadcrumbs } from "@/components/Navigation/Breadcrumbs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { H2, Muted } from "@/components/ui/Typography"

export default function HomePage() {
  return (
    <main className="flex-1 p-6 pt-16 lg:pt-6">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />
      </div>

      <div className="mb-8">
        <H2>Dashboard</H2>
        <Muted className="mt-1">Welcome to the 3Y Health platform.</Muted>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">24</p>
            <Muted className="mt-1">Currently on shift</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patients Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">128</p>
            <Muted className="mt-1">Scheduled appointments</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">7</p>
            <Muted className="mt-1">Requires attention</Muted>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
