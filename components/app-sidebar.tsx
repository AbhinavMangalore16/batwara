"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconSettings,
  IconUsers,
  IconInnerShadowTop,
  IconFileInvoice,     // Added for Batwara
  IconArrowsExchange,  // Added for Batwara
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// 1. Define static navigation data (Safe to keep outside)
const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      isActive: true,
    },
    {
      title: "My Expenses", // Batwara specific
      url: "/dashboard/expenses",
      icon: IconFileInvoice, 
    },
    {
      title: "Settlements", // Batwara specific
      url: "/dashboard/settlements",
      icon: IconArrowsExchange, 
    },
    {
      title: "Friends",
      url: "/dashboard/friends",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 2. Set default "Loading" or "Guest" user state
  const [user, setUser] = React.useState({
    name: "Loading...",
    email: "",
    avatar: "/avatars/user.jpg",
  });
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load user", e);
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-sidebar-primary-foreground">
                  <IconInnerShadowTop className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Batwara</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Pass the static data here */}
        <NavMain items={navData.navMain} />
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>
      
      <SidebarFooter>
        {/* Pass the dynamic state here */}
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}