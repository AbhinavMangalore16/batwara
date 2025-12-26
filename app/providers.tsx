"use client"
import { authClient } from "@/lib/auth-client";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({children}: {children: ReactNode}){
    const router = useRouter();
    return (
        <AuthUIProvider 
        authClient={authClient}
        navigate={router.push}
        replace={router.replace}
        onSessionChange={()=>{
            router.refresh()
        }}
        Link={Link}
        >
            {children}
            <Toaster />
        </AuthUIProvider>
    )
}