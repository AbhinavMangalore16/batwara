"use client"

import { useRouter } from "next/navigation" // Import Router for auto-refresh
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Import your new Modals
import { AddFriendModal } from "@/components/modals/add-friend-modal"
import { CreateBillModal } from "@/components/modals/create-bill-modal"

export function SiteHeader() {
  const router = useRouter()

  // This function forces the current page to re-fetch data from the server
  const handleRefresh = () => {
    router.refresh()
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        
        {/* Left Side: Trigger & Title */}
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>

        {/* Right Side: The Action Buttons */}
        <div className="ml-auto flex items-center gap-2">
          
          {/* 1. Add Friend Modal */}
          <AddFriendModal />

          {/* 2. Create Bill Modal 
              Passing handleRefresh ensures the dashboard updates 
              immediately after you create a bill. 
          */}
          <CreateBillModal onBillCreated={handleRefresh} />
          
        </div>
      </div>
    </header>
  )
}