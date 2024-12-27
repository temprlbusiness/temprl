import { AppSidebar } from "./AppSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Rightcontent from "@/components/ui/Rightcontent"

export default function LandingPage() {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 ">
            <SidebarTrigger className="-ml-1 text-primary " />
          </div>
        </header>
        <Rightcontent />
      </SidebarInset>
    </SidebarProvider>
  )
}

