"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconUsers,
  IconReceipt,
  IconScale,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import { apiFetch } from "@/lib/api";
import HLoader from "@/modules/extras/loader";
import { authClient } from "@/lib/auth-client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Fetch user for the whole app!
  const { data: user, error, isLoading } = useSWR("/api/users/me", apiFetch, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Global auth redirect ONLY when error occurs (e.g. 401 Unauthorized)
  useEffect(() => {
    if (!isLoading && error) {
      router.push("/login");
    }
  }, [error, isLoading, router]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
    router.push("/login");
  };

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <IconBrandTabler className="size-5" /> },
    { label: "Friends", href: "/friends", icon: <IconUsers className="size-5" /> },
    { label: "Bills & Expenses", href: "/bills", icon: <IconReceipt className="size-5" /> },
    { label: "Settlements & Debt", href: "/settlements", icon: <IconScale className="size-5" /> },
    { label: "Profile", href: "/profile", icon: <IconUser className="size-5" /> },
  ];

  if (isLoading) return <div className="flex h-screen items-center justify-center"><HLoader/></div>;
  if (!user) return null;

  return (

    <div className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden">
      
      <Sidebar open={open} setOpen={setOpen}>
        {/* 2. justify-between separates the top links from the bottom footer */}
        <SidebarBody className="justify-between gap-10">
          
          {/* 3. flex-1 overflow-y-auto allows the links to scroll if the screen gets too short */}
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div className="text-2xl font-black px-4 mb-8 text-emerald-400">B.</div>
            
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* 4. This footer stays pinned to the bottom */}
          <div className="px-4 border-t border-neutral-800 pt-4 pb-2 space-y-3">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Logged in as</p>
              <p className="font-medium text-neutral-200 truncate">{user.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-xs font-semibold text-rose-400 hover:text-rose-300 py-1.5 transition-colors"
            >
              <IconLogout className="size-4" />
              Sign Out
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* 5. The main content area scrolls independently! */}
      <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
        {children}
      </main>
      
    </div>
  );
}