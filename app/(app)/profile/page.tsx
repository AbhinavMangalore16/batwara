"use client";

import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { IconUser, IconMail, IconKey, IconCalendar, IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
import { apiFetch } from "@/lib/api";

export default function ProfilePage() {
  const { data: user, isLoading } = useSWR("/api/users/me", apiFetch);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await apiFetch("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({ name: name.trim() }),
      });

      mutate("/api/users/me");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Could not update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-neutral-500">Loading profile...</div>;

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-neutral-800 pb-6">
        <h1 className="text-4xl font-extrabold text-emerald-400 tracking-tight flex items-center gap-3">
          <IconUser className="size-9" />
          User Profile & Settings
        </h1>
        <p className="text-neutral-400 text-sm mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-neutral-950 flex items-center justify-center text-4xl font-black shadow-lg shadow-emerald-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name || "User"}</h2>
            <p className="text-sm text-neutral-400">{user?.email}</p>
          </div>
          <div className="w-full pt-4 border-t border-neutral-800 text-xs text-neutral-500 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Auth Method:</span>
              <span className="text-neutral-300 font-medium">Better Auth</span>
            </div>
          </div>
        </div>

        {/* Edit Form & Account Details */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-5">
            <h3 className="text-lg font-bold text-white border-b border-neutral-800 pb-3">
              Personal Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">
                Display Name
              </label>
              <div className="relative">
                <IconUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 size-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full p-3.5 pl-11 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <IconMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 size-5" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full p-3.5 pl-11 bg-neutral-950/60 border border-neutral-800/80 rounded-xl text-neutral-400 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5 ml-1">
                Email is linked to your Better Auth credentials and cannot be changed here.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">
                User ID
              </label>
              <div className="relative">
                <IconKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 size-5" />
                <input
                  type="text"
                  value={user?.id || ""}
                  disabled
                  className="w-full p-3.5 pl-11 bg-neutral-950/60 border border-neutral-800/80 rounded-xl text-neutral-400 text-xs font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                  <IconCheck size={18} /> Profile updated successfully!
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                disabled={isSaving || !name.trim() || name === user?.name}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconDeviceFloppy size={18} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
