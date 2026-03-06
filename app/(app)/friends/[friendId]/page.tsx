"use client";

import React, { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconSearch,
  IconEdit,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import HLoader from "@/modules/extras/loader";

// Helper to format currency
const formatCurrency = (amount: number = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount / 100);
};

export default function FriendDetailsPage() {
  const { friendId } = useParams();
  const router = useRouter();

  // States
  const [historySearch, setHistorySearch] = useState("");
  const [nickname, setNickname] = useState("");
  const [tempNickname, setTempNickname] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  // 1. Auth & user fetch
  const { data: user, isLoading: isUserLoading } = useSWR("/api/users/me", apiFetch);

  // 2. Fetch all friends so we can find this specific friend's real name
  const { data: friendsData } = useSWR("/api/users/friends", apiFetch);

  // 3. Friend expense details fetch
  const { data, isLoading: isDetailsLoading } = useSWR(
    friendId ? `/api/expenses/friend/${friendId}` : null,
    apiFetch
  );

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  // Load local nickname on mount
  useEffect(() => {
    if (friendId) {
      const savedName = localStorage.getItem(`nickname_${friendId}`);
      if (savedName) setNickname(savedName);
    }
  }, [friendId]);

  if (isDetailsLoading || isUserLoading) return <HLoader />;
  if (!user) return null;

  // Find the friend's real profile
  const friendsList = Array.isArray(friendsData) 
    ? friendsData 
    : (friendsData?.friends || friendsData?.data || []);
  const friendProfile = friendsList.find((f: any) => f.id === friendId);
  const realName = friendProfile?.name || "Unknown Friend";
  
  // Display name logic
  const initial = realName.charAt(0).toUpperCase();
  const displayName = nickname || realName; // Use nickname for UI labels if it exists

  // Safe Parsing for expenses
  const settlements = data?.activeSettlements ?? [];
  const rawHistory = data?.history ?? [];

  // Filter history
  const filteredHistory = rawHistory.filter((t: any) =>
    t.description?.toLowerCase().includes(historySearch.toLowerCase())
  );

  // Nickname Handlers
  const handleSaveNickname = () => {
    setNickname(tempNickname);
    localStorage.setItem(`nickname_${friendId}`, tempNickname);
    setIsEditingName(false);
  };

  const startEditing = () => {
    setTempNickname(nickname);
    setIsEditingName(true);
  };

  return (
    <div className="p-8 space-y-6">
      {/* --- Top Header & Breadcrumb --- */}
      <div className="mb-2">
        <Link 
          href="/friends" 
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-emerald-400 transition-colors mb-4"
        >
          <IconArrowLeft size={16} /> Back to Friends
        </Link>
      </div>

      {/* --- Friend Profile Card --- */}
      <div className="flex items-center gap-5 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold shadow-inner">
          {initial}
        </div>
        
        <div className="flex-1">
          {/* Main Title is now ALWAYS their Real Name */}
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {realName}
          </h1>

          {/* Subtitle Row for Nickname and ID */}
          <div className="flex items-center gap-2 mt-1.5 h-7">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveNickname()}
                  placeholder="Set a nickname..."
                  className="bg-neutral-950 border border-emerald-500 rounded text-sm px-3 py-1 text-white focus:outline-none w-48"
                />
                <button 
                  onClick={handleSaveNickname}
                  className="text-emerald-400 hover:text-emerald-300 transition"
                >
                  <IconCheck size={18} />
                </button>
                <button 
                  onClick={() => setIsEditingName(false)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <IconX size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <span>
                  Nickname: <span className="text-neutral-200 font-medium">{nickname || "None"}</span>
                </span>
                <button 
                  onClick={startEditing}
                  className="text-neutral-500 hover:text-emerald-400 transition ml-1"
                  title="Edit local nickname"
                >
                  <IconEdit size={14} />
                </button>
                
                <span className="text-neutral-700 mx-1">•</span>
                
                <span className="font-mono text-xs">
                  ID: {typeof friendId === 'string' ? friendId.slice(0, 8) : friendId}...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Left Column: Settlements --- */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 flex flex-col h-[600px]">
            <h2 className="text-lg font-bold text-white mb-4 shrink-0">Active Settlements</h2>

            {settlements.length === 0 ? (
              <p className="text-sm text-neutral-500 py-4 text-center border border-dashed border-neutral-800 rounded-xl">
                You and {displayName} are all settled up!
              </p>
            ) : (
              <ul className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {settlements.map((s: any, idx: number) => {
                  const amount = Number(s.amount) || 0;
                  const theyOweMe = s.from === friendId;

                  return (
                    <li key={idx} className="flex flex-col p-4 bg-neutral-800 rounded-xl border border-neutral-700 shrink-0">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm text-neutral-300 flex items-center gap-2">
                          {theyOweMe ? (
                            <><IconArrowUpRight size={16} className="text-emerald-400"/> They owe you</>
                          ) : (
                            <><IconArrowDownLeft size={16} className="text-red-400"/> You owe them</>
                          )}
                        </span>
                        <span className={`font-bold ${theyOweMe ? "text-emerald-400" : "text-red-400"}`}>
                          {formatCurrency(amount)}
                        </span>
                      </div>
                      <button
                        className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                          !theyOweMe
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-neutral-700 hover:bg-neutral-600 text-neutral-200"
                        }`}
                      >
                        {!theyOweMe ? "Settle Now" : "Mark as Paid"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* --- Right Column: History --- */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 flex flex-col h-[600px]">
            
            {/* Header & Search Bar */}
            <div className="shrink-0 mb-6">
              <h2 className="text-lg font-bold text-white mb-4">Transaction History</h2>
              <div className="relative">
                <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search history by description..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="flex-1 flex items-center justify-center border border-dashed border-neutral-800 rounded-xl">
                <p className="text-sm text-neutral-500 text-center px-4">
                  {historySearch ? `No results found for "${historySearch}"` : `No transaction history found with ${displayName}.`}
                </p>
              </div>
            ) : (
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {filteredHistory.map((t: any) => {
                  const iPaid = t.paidBy === user.id;

                  return (
                    <div key={t.billId} className="flex items-center justify-between bg-neutral-800/50 hover:bg-neutral-800 p-4 rounded-xl border border-neutral-800 transition shrink-0">
                      <div>
                        <p className="font-medium text-neutral-200">{t.description}</p>
                        <div className="flex gap-2 items-center mt-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                            iPaid ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-700 text-neutral-300"
                          }`}>
                            {iPaid ? "You paid" : `${displayName} paid`}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {t.date ? new Date(t.date).toLocaleDateString('en-IN', { 
                              month: 'short', day: 'numeric', year: 'numeric' 
                            }) : 'Unknown date'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`font-bold ${iPaid ? "text-emerald-400" : "text-red-400"}`}>
                          {iPaid ? "+" : "-"}{formatCurrency(Number(t.splitAmount) || 0)}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Total bill: {formatCurrency(Number(t.totalBillAmount) || 0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}