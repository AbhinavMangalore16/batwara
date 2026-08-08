"use client";

import React, { useState, useMemo } from "react";
import useSWR, { mutate } from "swr";
import { 
  IconReceipt, 
  IconPlus, 
  IconCheck, 
  IconX, 
  IconSearch,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconUsers,
  IconCalculator
} from "@tabler/icons-react";
import { apiFetch } from "@/lib/api";

const formatCurrency = (amount: number = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount / 100);
};

export default function BillsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  const { data: user } = useSWR("/api/users/me", apiFetch);
  const { data: settlementsData } = useSWR("/api/expenses/settlements/me", apiFetch);
  const { data: chartData } = useSWR("/api/expenses/chart?period=year", apiFetch);

  const { owesTo = [], receivesFrom = [] } = settlementsData?.settlements ?? {};

  const totalOwedToYou = useMemo(() => {
    return receivesFrom.reduce((acc: number, item: any) => acc + (item.amount || 0), 0);
  }, [receivesFrom]);

  const totalYouOwe = useMemo(() => {
    return owesTo.reduce((acc: number, item: any) => acc + (item.amount || 0), 0);
  }, [owesTo]);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-emerald-400 tracking-tight flex items-center gap-3">
            <IconReceipt className="size-9" />
            Bills & Expenses
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Manage your shared expenses, split calculations, and track bill history.
          </p>
        </div>
        <button
          onClick={() => setIsExpenseOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10"
        >
          <IconPlus size={20} />
          Create New Bill
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-sm font-medium">Pending Receivables</span>
            <IconArrowUpRight className="text-emerald-400 size-5" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">
            {formatCurrency(totalOwedToYou)}
          </p>
          <p className="text-xs text-neutral-500 mt-2">
            From {receivesFrom.length} friend{receivesFrom.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-sm font-medium">Pending Payables</span>
            <IconArrowDownLeft className="text-rose-400 size-5" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400">
            {formatCurrency(totalYouOwe)}
          </p>
          <p className="text-xs text-neutral-500 mt-2">
            To {owesTo.length} friend{owesTo.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-sm font-medium">Split Types Supported</span>
            <IconCalculator className="text-blue-400 size-5" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">Equal</span>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">Exact</span>
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">Percentage</span>
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            Real-time Drizzle SQL & Neo4j graph processing
          </p>
        </div>
      </div>

      {/* Active Settlements Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Receivables */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <IconArrowUpRight className="text-emerald-400 size-5" />
            Owed To You
          </h2>
          {receivesFrom.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
              No one owes you money right now.
            </div>
          ) : (
            <div className="space-y-3">
              {receivesFrom.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                      {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-200">{item.name || "Friend"}</p>
                      <p className="text-xs text-neutral-500">Pending settlement</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400 text-lg">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payables */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <IconArrowDownLeft className="text-rose-400 size-5" />
            You Owe
          </h2>
          {owesTo.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
              You don't owe anyone right now.
            </div>
          ) : (
            <div className="space-y-3">
              {owesTo.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
                      {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-200">{item.name || "Friend"}</p>
                      <p className="text-xs text-neutral-500">Pending settlement</p>
                    </div>
                  </div>
                  <span className="font-bold text-rose-400 text-lg">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CreateBillModal
        open={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        user={user}
      />
    </div>
  );
}

function CreateBillModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: any;
}) {
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<"equal" | "exact" | "percentage">("equal");
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: friendsData } = useSWR("/api/users/friends", apiFetch);

  const friends = useMemo(() => {
    if (!friendsData) return [];
    if (Array.isArray(friendsData)) return friendsData;
    if (Array.isArray(friendsData.friends)) return friendsData.friends;
    if (Array.isArray(friendsData.data)) return friendsData.data;
    return [];
  }, [friendsData]);

  if (!open) return null;

  const toggleFriend = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleCustomAmountChange = (id: string, val: string) => {
    setCustomAmounts((prev) => ({ ...prev, [id]: val }));
  };

  const handleSubmit = async () => {
    if (!user || !user.id) return;
    if (!description || !totalAmount || selectedFriends.length === 0) return;
    setIsSubmitting(true);

    try {
      const amountInPaise = Math.round(Number(totalAmount) * 100);
      const totalParticipants = selectedFriends.length + 1;

      let splitsData: Array<{ slave: string; splitAmount: number }> = [];

      if (splitType === "equal") {
        const perPerson = Math.floor(amountInPaise / totalParticipants);
        splitsData = selectedFriends.map((friendId) => ({
          slave: friendId,
          splitAmount: perPerson,
        }));
      } else if (splitType === "exact") {
        splitsData = selectedFriends.map((friendId) => ({
          slave: friendId,
          splitAmount: Math.round(Number(customAmounts[friendId] || 0) * 100),
        }));
      } else if (splitType === "percentage") {
        splitsData = selectedFriends.map((friendId) => {
          const pct = Number(customAmounts[friendId] || 0);
          return {
            slave: friendId,
            splitAmount: Math.round((amountInPaise * pct) / 100),
          };
        });
      }

      await apiFetch("/api/expenses/makeBill", {
        method: "POST",
        body: JSON.stringify({
          description,
          totalAmount: amountInPaise,
          splitType,
          splits: splitsData,
        }),
      });

      mutate("/api/expenses/balances/me");
      mutate("/api/expenses/settlements/me");
      mutate("/api/expenses/chart?period=month");

      setDescription("");
      setTotalAmount("");
      setSelectedFriends([]);
      setCustomAmounts({});
      onClose();
    } catch (error) {
      console.error("Failed to create bill:", error);
      alert("Failed to create bill. Please verify split values and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div 
        className="bg-[#0f0f0f] w-full max-w-lg p-6 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Create New Bill</h2>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">
              Description / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Goa Trip Hotel Booking"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">
              Total Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">₹</span>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full p-3.5 pl-8 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2 ml-1">
              Split Strategy
            </label>
            <div className="grid grid-cols-3 gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              {(["equal", "exact", "percentage"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSplitType(type)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold capitalize transition-all ${
                    splitType === type
                      ? "bg-emerald-500 text-neutral-950 shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 ml-1">
              <label className="text-sm font-medium text-neutral-400">
                Split with Friends
              </label>
              <span className="text-xs text-neutral-500 font-medium bg-neutral-900 px-2 py-1 rounded-md">
                {selectedFriends.length} selected
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {friends.length === 0 ? (
                <p className="text-sm text-neutral-500 p-4 text-center border border-dashed border-neutral-800 rounded-xl">
                  No friends added yet. Go to Friends tab to add friends!
                </p>
              ) : (
                friends.map((friend: any) => {
                  const isSelected = selectedFriends.includes(friend.id);
                  return (
                    <div
                      key={friend.id}
                      className={`p-3 rounded-xl transition-all border ${
                        isSelected
                          ? "bg-emerald-500/10 border-emerald-500/50"
                          : "bg-neutral-900 border-transparent hover:border-neutral-700"
                      }`}
                    >
                      <div 
                        onClick={() => toggleFriend(friend.id)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected ? "bg-emerald-600 text-white" : "bg-neutral-700 text-neutral-300"
                          }`}>
                            {friend.name ? friend.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-neutral-300"}`}>
                            {friend.name}
                          </span>
                        </div>
                        
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? "bg-emerald-500 border-emerald-500" : "border-neutral-600"
                        }`}>
                          {isSelected && <IconCheck size={14} className="text-neutral-950 stroke-[3]" />}
                        </div>
                      </div>

                      {isSelected && splitType !== "equal" && (
                        <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center gap-2">
                          <span className="text-xs text-neutral-400">
                            {splitType === "exact" ? "Amount (₹):" : "Percentage (%):"}
                          </span>
                          <input
                            type="number"
                            placeholder="0"
                            value={customAmounts[friend.id] || ""}
                            onChange={(e) => handleCustomAmountChange(friend.id, e.target.value)}
                            className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 w-28"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-transparent text-neutral-400 font-medium rounded-xl hover:bg-neutral-900 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !description || !totalAmount || selectedFriends.length === 0}
            className="flex-1 py-3 bg-emerald-500 text-neutral-950 font-bold rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Make Bill"}
          </button>
        </div>
      </div>
    </div>
  );
}
