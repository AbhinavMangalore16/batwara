"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  IconBrandTabler,
  IconUser,
  IconSettings,
  IconLogout,
  IconUsers,
  IconReceipt,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconPlus,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import HLoader from "@/modules/extras/loader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

// Helper to format currency (assuming backend sends paise/cents)
const formatCurrency = (amount: number = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount / 100);
};

export default function DashboardLayout() {
  const router = useRouter();
  const [open, setOpen] = useState(true);


  // 🔐 Auth check
  const { data: user, isLoading } = useSWR("/api/users/me", apiFetch);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <IconBrandTabler /> },
    { label: "Friends", href: "/friends", icon: <IconUsers /> },
    { label: "Bills", href: "/bills", icon: <IconReceipt /> },
    { label: "Landing", href: "/", icon: <IconUser /> },
    // { label: "Profile", href: "/profile", icon: <IconUser /> },
    // { label: "Settings", href: "/settings", icon: <IconSettings /> },
    { label: "Logout", href: "/login", icon: <IconLogout /> },
  ];

  if (isLoading) return <HLoader />;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Main Dashboard Content */}
      <MainDashboard user={user} />
    </div>
  );
}

function MainDashboard({ user }: { user: any }) {
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  // 1. Fetching data
  const { data: balances } = useSWR("/api/expenses/balances/me", apiFetch);
  const { data: settlementsData } = useSWR("/api/expenses/settlements/me", apiFetch);
  const { data: chartData } = useSWR("/api/expenses/chart?period=month", apiFetch);
  const { data: yearlyChartData } = useSWR(
    "/api/expenses/chart?period=year",
    apiFetch
  );

  // 2. Parse balances safely
  const myBalance = balances?.balance !== undefined
    ? balances
    : balances?.balances?.[user.id] || { balance: 0, owes: 0, receives: 0 };

  // 3. Parse settlements (Separated as per your backend schema)
  const { owesTo = [], receivesFrom = [] } = settlementsData?.settlements ?? {};

  // 4. Process chart data
  // derive chart-friendly structure; always return the same shape
  const formattedChartData = useMemo<{
    data: any[];
    thisMonth: number;
  }>(() => {
    if (!chartData) {
      return { data: [], thisMonth: 0 };
    }

    const merged: Record<string, any> = {};
    let currentMonthTotal = 0;

    chartData.paidByMe?.forEach((item: any) => {
      merged[item.date] = {
        date: item.date,
        Paid: item.totalAmount / 100,
      };
      currentMonthTotal += item.totalAmount;
    });

    return {
      data: Object.values(merged).sort(
        (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
      thisMonth: currentMonthTotal,
    };
  }, [chartData]);
  const { yearlyTotal } = useMemo(() => {
    if (!yearlyChartData) return { yearlyTotal: 0 };

    let total = 0;

    yearlyChartData.paidByMe?.forEach((item: any) => {
      total += item.totalAmount;
    });

    return { yearlyTotal: total };
  }, [yearlyChartData]);

  return (
    <div className="flex-1 p-8 space-y-6 overflow-y-auto">
      {/* Header aligned with image */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-extrabold text-emerald-400 tracking-tight">
          Dashboard
        </h1>
    <button
      onClick={() => setIsExpenseOpen(true)}
      className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 ..."
    >
      <IconPlus size={18} />
      Add expense
    </button>
        <AddExpenseModal
      open={isExpenseOpen}
      onClose={() => setIsExpenseOpen(false)}
      user={user}
    />
      </div>

      {/* --- Top Summary Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Balance"
          amount={myBalance.balance}
          subtitle={myBalance.balance >= 0 ? "You are owed money" : "You owe money"}
          type={myBalance.balance >= 0 ? "positive" : "negative"}
        />
        <SummaryCard
          title="You are owed"
          amount={myBalance.receives}
          subtitle={`From ${receivesFrom.length} people`}
          type="positive"
        />
        <SummaryCard
          title="You owe"
          amount={myBalance.owes}
          subtitle={`To ${owesTo.length} people`}
          type="negative"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Left Column: Expense Summary (Chart) --- */}
        <Section title="Expense Summary" className="lg:col-span-2">
          
          {/* Chart Summary Blocks */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-800">
              <p className="text-sm text-neutral-400 mb-1">Total this month</p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(formattedChartData.thisMonth || 0)}
              </p>
            </div>
            <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-800">
              <p className="text-sm text-neutral-400 mb-1">Total this year</p>
              {/* Note: Placeholder until you fetch yearly data from backend */}
              <p className="text-3xl font-bold text-white">
                {formatCurrency((yearlyTotal || 0))} 
              </p>
            </div>
          </div>

          <div className="h-[300px] w-full mt-4">
            {!chartData ? (
              <p className="text-neutral-500 animate-pulse">Loading chart...</p>
            ) : formattedChartData.data.length === 0 ? (
              <p className="text-neutral-500">No spending data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedChartData.data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#888" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12 }} 
                    dy={10} 
                  />
                  <YAxis 
                    stroke="#888" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12 }} 
                    dx={-10}
                  />
                  <Tooltip
                    cursor={{ fill: "#222" }}
                    contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                  />
                  <Bar dataKey="Paid" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Section>

        {/* --- Right Column: Balance Details --- */}
        <Section 
          title="Balance Details" 
          headerRight={<button className="text-sm text-neutral-400 hover:text-white transition">View all ›</button>}
          className="lg:col-span-1"
        >
          <div className="space-y-6 mt-4">
            
            {/* Owed to you section */}
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-4">
                <IconArrowUpRight size={18} />
                <h3 className="text-sm font-medium">Owed to you</h3>
              </div>
              
              {receivesFrom.length === 0 ? (
                <p className="text-sm text-neutral-500 pl-6">No pending receivables.</p>
              ) : (
                <ul className="space-y-4">
                  {receivesFrom.map((s: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                          {s.name ? s.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <span className="text-sm font-medium text-neutral-200">{s.name}</span>
                      </div>
                      <span className="font-bold text-emerald-400">
                        {formatCurrency(s.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <hr className="border-neutral-800" />

            {/* You owe section */}
            <div>
              <div className="flex items-center gap-2 text-red-400 mb-4">
                <IconArrowDownLeft size={18} />
                <h3 className="text-sm font-medium">You owe</h3>
              </div>

              {owesTo.length === 0 ? (
                <p className="text-sm text-neutral-500 pl-6">You owe nothing.</p>
              ) : (
                <ul className="space-y-4">
                  {owesTo.map((s: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-xs font-bold text-white">
                          {s.name ? s.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <span className="text-sm font-medium text-neutral-200">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-red-400">
                          {formatCurrency(s.amount)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </Section>
      </div>
    </div>
  );
}

// --- Reusable UI Components ---

function SummaryCard({
  title,
  amount,
  subtitle,
  type,
}: {
  title: string;
  amount: number;
  subtitle: string;
  type: "positive" | "negative" | "neutral";
}) {
  const isPositive = type === "positive";
  const colorClass = isPositive ? "text-emerald-400" : type === "negative" ? "text-red-400" : "text-white";

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between h-36 shadow-sm">
      <h3 className="text-neutral-400 text-sm font-medium">{title}</h3>
      <div className="my-2">
        <p className={`text-3xl font-bold ${colorClass}`}>
          {isPositive && amount > 0 ? "+" : ""}
          {formatCurrency(amount)}
        </p>
      </div>
      <p className="text-xs text-neutral-500">{subtitle}</p>
    </div>
  );
}

function Section({
  title,
  children,
  className = "",
  headerRight
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}) {
  return (
    <div className={cn("bg-neutral-900 p-6 rounded-2xl border border-neutral-800 flex flex-col", className)}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {headerRight}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function AddExpenseModal({
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch friends
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

  const handleSubmit = async () => {
    if (!user || !user.id) {
      alert("User not loaded yet");
      return;
    }
    if (!description || !totalAmount || selectedFriends.length === 0) return;
    setIsSubmitting(true);

    try {
      console.log({
          description,
          totalAmount,
          paidBy: user.id,
          splitData: {
            splitType: "equal",
            data: [user.id, ...selectedFriends].map((id) => ({
              userId: id
            })),
          },
        });
      // Note: Changed from /create to /makeBill to match your backend router
      await apiFetch("/api/expenses/makeBill", {
        method: "POST",
        body: JSON.stringify({
          description,
          totalAmount: Number(totalAmount) * 100,
          splitData: {
            splitType: "equal",
            data: [user.id, ...selectedFriends].map((id) => ({
              userId: id,
            })),
          },
        }),
      });

      // Tell SWR to re-fetch dashboard data so UI updates instantly!
      mutate("/api/expenses/balances/me");
      mutate("/api/expenses/settlements/me");
      mutate("/api/expenses/chart?period=month");
      mutate("/api/expenses/chart?period=year");

      // Reset & Close
      setDescription("");
      setTotalAmount("");
      setSelectedFriends([]);
      onClose();
    } catch (error) {
      console.error("Failed to create bill:", error);
      alert("Failed to create expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div 
        className="bg-[#0f0f0f] w-full max-w-md p-6 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing modal
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Add Expense</h2>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">
              What was this for?
            </label>
            <input
              type="text"
              placeholder="e.g. Dinner at generic restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1.5 ml-1">
              Total Amount
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

          {/* Friend Selection */}
          <div>
            <div className="flex items-center justify-between mb-2 ml-1">
              <label className="text-sm font-medium text-neutral-400">
                Split equally with...
              </label>
              <span className="text-xs text-neutral-500 font-medium bg-neutral-900 px-2 py-1 rounded-md">
                {selectedFriends.length} selected
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {friends.length === 0 ? (
                <p className="text-sm text-neutral-500 p-4 text-center border border-dashed border-neutral-800 rounded-xl">
                  No friends found. Add some friends first!
                </p>
              ) : (
                friends.map((friend: any) => {
                  const isSelected = selectedFriends.includes(friend.id);
                  return (
                    <div
                      key={friend.id}
                      onClick={() => toggleFriend(friend.id)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? "bg-emerald-500/10 border-emerald-500/50"
                          : "bg-neutral-900 border-transparent hover:border-neutral-700"
                      }`}
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
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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
            {isSubmitting ? "Saving..." : "Create Bill"}
          </button>
        </div>
      </div>
    </div>
  );
}