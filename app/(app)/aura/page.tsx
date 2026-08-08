"use client";

import React from "react";

export default function AuraPage() {
  return (
    <div className="w-full h-screen flex flex-col bg-black text-white">
      {/* Optional Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-emerald-400">
          Aura Travel Planner
        </h1>
      </div>

      {/* Iframe Container */}
      <div className="flex-1">
        <iframe
          src="https://asset-manager--abhinavm16104.replit.app/"
          title="Aura Travel Planner"
          className="w-full h-full border-0"
          allow="clipboard-write; clipboard-read; fullscreen"
        />
      </div>
    </div>
  );
}