"use client";

import React, { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { 
  IconUserPlus, 
  IconSearch,
  IconBrandTabler,
  IconUsers,
  IconReceipt,
  IconLogout
} from "@tabler/icons-react";
import HLoader from "@/modules/extras/loader";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

export default function FriendsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(true); // Sidebar state

  // 🔐 Auth check & user fetch for Sidebar
  const { data: user, isLoading: isUserLoading } = useSWR("/api/users/me", apiFetch);

  const { data: friendsData, mutate } = useSWR(
    "/api/users/friends",
    apiFetch
  );

  const { data: searchResults } = useSWR(
    search ? `/api/users/search?name=${search}` : null,
    apiFetch
  );

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <IconBrandTabler /> },
    { label: "Friends", href: "/friends", icon: <IconUsers /> },
    { label: "Dev Blog", href: "/blog", icon: <IconReceipt /> },
    { label: "Logout", href: "/login", icon: <IconLogout /> },
  ];

  // ✅ Bulletproof parsing for friends
  const friends = useMemo(() => {
    if (!friendsData) return [];
    if (Array.isArray(friendsData)) return friendsData;
    if (Array.isArray(friendsData.friends)) return friendsData.friends;
    if (Array.isArray(friendsData.data)) return friendsData.data;
    return [];
  }, [friendsData]);

  // ✅ Bulletproof parsing for search results
  const results = useMemo(() => {
    if (!searchResults) return [];
    if (Array.isArray(searchResults)) return searchResults;
    if (Array.isArray(searchResults.users)) return searchResults.users;
    if (Array.isArray(searchResults.data)) return searchResults.data;
    return [];
  }, [searchResults]);

  const addFriend = async (friendId: string) => {
    try {
      await apiFetch("/api/users/add", {
        method: "POST",
        body: JSON.stringify({ friendId }),
      });

      // Clear the search bar and refresh the friends list!
      setSearch("");
      mutate();
    } catch (error) {
      console.error("Failed to add friend:", error);
      alert("Could not add friend. Please try again.");
    }
  };

  if (isUserLoading) return <HLoader />;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      

      {/* --- Main Content --- */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-emerald-400 tracking-tight">Friends</h1>

          {/* Search */}
          <div className="flex items-center gap-3 bg-neutral-900 p-4 rounded-xl border border-neutral-800 focus-within:border-emerald-500 transition-colors">
            <IconSearch size={20} className="text-neutral-400" />
            <input
              type="text"
              placeholder="Search users by their email address..."
              className="bg-transparent outline-none flex-1 text-white placeholder-neutral-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Search Results */}
          {search && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3">
                Search Results
              </h2>
              {results.length === 0 ? (
                <p className="text-neutral-500 bg-neutral-900 p-4 rounded-xl border border-neutral-800 text-center">
                  No users found matching "{search}".
                </p>
              ) : (
                results.map((searchUser: any) => {
                  // Check if they are already in your friends list so we don't show the "Add" button again
                  const isAlreadyFriend = friends.some((f: any) => f.id === searchUser.id);
                  // Don't show the current user in the search results to add themselves
                  if (searchUser.id === user.id) return null;

                  return (
                    <div
                      key={searchUser.id}
                      className="flex justify-between items-center bg-neutral-900 p-4 rounded-xl border border-neutral-800"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                          {searchUser.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-200">{searchUser.name}</p>
                          <p className="text-sm text-neutral-500">{searchUser.email}</p>
                        </div>
                      </div>

                      {!isAlreadyFriend ? (
                        <button
                          onClick={() => addFriend(searchUser.id)}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-medium px-4 py-2 rounded-lg transition"
                        >
                          <IconUserPlus size={18} />
                          Add
                        </button>
                      ) : (
                        <span className="text-sm text-emerald-500 px-4 py-2 font-medium">
                          Already friends
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Friends List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-3">
              Your Friends ({friends.length})
            </h2>

            {friends.length === 0 ? (
              <p className="text-neutral-500 py-4 text-center border border-dashed border-neutral-800 rounded-xl">
                You haven't added any friends yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((friend: any) => (
                  <div
                    key={friend.id}
                    className="flex justify-between items-center bg-neutral-900 p-5 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                        {friend.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-200">{friend.name}</p>
                        <p className="text-xs text-neutral-500">{friend.email}</p>
                      </div>
                    </div>

                    <Link
                      href={`/friends/${friend.id}`}
                      className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition"
                    >
                      View details ›
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}