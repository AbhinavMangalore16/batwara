"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr"; // 👈 Import SWR
import { apiFetch } from "@/lib/api"; // 👈 Import apiFetch

export const CustomNavbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Fetch real session state directly from the API (cached & synced!)
  const { data: user, isLoading } = useSWR("/api/users/me", apiFetch);
  const isLoggedIn = !!user;

  const handleSignOut = async () => {
    // If you have a backend logout endpoint (like /api/auth/signout), you should call it here:
    // await apiFetch("/api/auth/signout", { method: "POST" });

    // Clear fallbacks
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_refresh_token");
    localStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_refresh_token");
    sessionStorage.removeItem("auth_user");
    
    // 2. Tell SWR to instantly clear the user cache globally
    mutate("/api/users/me", null, false);
    
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Testimonials",
      link: "#testimonials",
    },
    {
      name: "Contact",
      link: "#contact",
    }
  ];

  return (
    <div className="sticky top-0 z-50 w-full">
      <Navbar className="sticky top-0 z-50">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-8">
            {isLoading ? (
              // Show a small loading pulse while checking auth
              <div className="w-24 h-10 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
            ) : isLoggedIn ? (
              <NavbarButton variant="primary" onClick={handleSignOut}>
                Sign Out
              </NavbarButton>
            ) : (
              <NavbarButton variant="primary" href="/login">Login</NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 mt-4">
              {isLoading ? (
                <div className="w-full h-10 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
              ) : isLoggedIn ? (
                <NavbarButton
                  onClick={handleSignOut}
                  variant="primary"
                  className="w-full"
                >
                  Sign Out
                </NavbarButton>
              ) : (
                <>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                    href="/login"
                  >
                    Login
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Book a call
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};