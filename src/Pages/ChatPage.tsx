import { AppSidebar } from "@/components/ui/AppSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import AIBot from "@/components/ui/AIBot"

export default function ChatPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <header className="flex h-16 shrink-0  bg-gray-950 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 bg-gray-950">
            <SidebarTrigger className="-ml-1 text-primary " />
          </div>
        </header>
        <div className="flex flex-col min-h-screen bg-gray-950 text-white">
          <AIBot />
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}

