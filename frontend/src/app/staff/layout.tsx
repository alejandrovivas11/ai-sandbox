import { SidebarProvider, SidebarInset } from "@/components/ui/Sidebar"
import { AppSidebar } from "@/components/navigation/Sidebar"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
