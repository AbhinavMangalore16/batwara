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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const CustomNavbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for auth token
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
  }, []);
  const handleSignOut = () =>{
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_refresh_token");
    localStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_refresh_token");
    sessionStorage.removeItem("auth_user");
    setIsLoggedIn(false);
    router.push("/");
  }
  const handleDashboard = () => {
    router.push("/dashboard")
  }
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
  ]
  return (
    <div className="sticky top-0 z-50 w-full">
    <Navbar className="sticky top-0 z-50">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-8">
            {isLoggedIn ? (
              <div>
              <NavbarButton variant="primary" onClick={handleSignOut}>
                Sign Out
              </NavbarButton>
              <NavbarButton className="ml-4" variant="primary" onClick={handleDashboard}>
                Dashboard
              </NavbarButton>
              </div>
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
            <div className="flex w-full flex-col gap-4">
              {isLoggedIn ? (<> 
                <NavbarButton
                  onClick={handleSignOut}
                  variant="primary"
                  className="w-full"
                >
                  Sign Out
                </NavbarButton>
                <NavbarButton
                  onClick={handleDashboard}
                  variant="primary"
                  className="w-full ml-4"
                >
                  Dashboard
                </NavbarButton>
              </>
              ) : (
                <>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    <Link href='/login'>Login</Link>
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
  )
}