"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AuthView() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4">
      <div className="mb-6 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-emerald-400 mb-2">Batwara</h1>
        <p className="text-neutral-400 text-sm">Group Expense Tracker</p>
      </div>

      <div className="flex flex-col items-center">
        {isSignUp ? (
          <SignUp
            routing="hash"
            signInUrl="/login"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorBackground: "#0d1117",
                colorText: "#ffffff",
                colorPrimary: "#10b981",
                colorInputBackground: "#161b22",
                colorInputText: "#ffffff",
              },
            }}
          />
        ) : (
          <SignIn
            routing="hash"
            signUpUrl="/login"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorBackground: "#0d1117",
                colorText: "#ffffff",
                colorPrimary: "#10b981",
                colorInputBackground: "#161b22",
                colorInputText: "#ffffff",
              },
            }}
          />
        )}

        <div className="mt-4">
          <Button
            variant="ghost"
            className="text-neutral-400 hover:text-white"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </div>
      </div>
    </div>
  );
}