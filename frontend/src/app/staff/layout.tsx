import { SidebarProvider, SidebarInset } from "@/components/ui/Sidebar"
import { AppSidebar } from "@/components/Navigation/Sidebar"
import { QueryProvider } from "@/providers/QueryProvider"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  )
}
