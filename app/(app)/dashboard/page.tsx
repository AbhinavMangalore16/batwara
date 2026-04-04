"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  IconBrandTabler,
  IconUser,
  IconUsers,
  IconReceipt,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconPlus,
  IconCheck,
  IconX,
  IconPercentage,
  IconCurrencyRupee,
  IconEqual,
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

import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount / 100);
};

export default function DashboardLayout() {
  const router = useRouter();
  const { data: user, isLoading } = useSWR("/api/users/me", apiFetch);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <HLoader />;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <MainDashboard user={user} />
    </div>
  );
}

function MainDashboard({ user }: { user: any }) {
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const { data: balances } = useSWR("/api/expenses/balances/me", apiFetch);
  const { data: settlementsData } = useSWR("/api/expenses/settlements/me", apiFetch);
  const { data: chartData } = useSWR("/api/expenses/chart?period=month", apiFetch);
  const { data: yearlyChartData } = useSWR("/api/expenses/chart?period=year", apiFetch);

  const myBalance = balances?.balance !== undefined
    ? balances
    : balances?.balances?.[user.id] || { balance: 0, owes: 0, receives: 0 };

  const { owesTo = [], receivesFrom = [] } = settlementsData?.settlements ?? {};

  const formattedChartData = useMemo(() => {
    if (!chartData) return { data: [], thisMonth: 0 };
    const merged: Record<string, any> = {};
    let currentMonthTotal = 0;
    chartData.paidByMe?.forEach((item: any) => {
      merged[item.date] = { date: item.date, Paid: item.totalAmount / 100 };
      currentMonthTotal += item.totalAmount;
    });
    return {
      data: Object.values(merged).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      thisMonth: currentMonthTotal,
    };
  }, [chartData]);

  const yearlyTotal = useMemo(() => {
    if (!yearlyChartData) return 0;
    return yearlyChartData.paidByMe?.reduce((acc: number, item: any) => acc + item.totalAmount, 0) || 0;
  }, [yearlyChartData]);

  return (
    <div className="flex-1 p-8 space-y-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-extrabold text-emerald-400 tracking-tight">Dashboard</h1>
        <button
          onClick={() => setIsExpenseOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <IconPlus size={18} />
          Add expense
        </button>
        <AddExpenseModal open={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} user={user} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Balance" amount={myBalance.balance} subtitle={myBalance.balance >= 0 ? "You are owed" : "You owe"} type={myBalance.balance >= 0 ? "positive" : "negative"} />
        <SummaryCard title="You are owed" amount={myBalance.receives} subtitle={`From ${receivesFrom.length} people`} type="positive" />
        <SummaryCard title="You owe" amount={myBalance.owes} subtitle={`To ${owesTo.length} people`} type="negative" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Section title="Expense Summary" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-800">
              <p className="text-sm text-neutral-400 mb-1">Total this month</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(formattedChartData.thisMonth)}</p>
            </div>
            <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-800">
              <p className="text-sm text-neutral-400 mb-1">Total this year</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(yearlyTotal)}</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedChartData.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 12 }} dy={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} dx={-10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#222" }} contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
                <Bar dataKey="Paid" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Balance Details" headerRight={<button className="text-sm text-neutral-400 hover:text-white transition">View all ›</button>} className="lg:col-span-1">
          <div className="space-y-6 mt-4">
            <BalanceList title="Owed to you" items={receivesFrom} icon={<IconArrowUpRight size={18} />} color="text-emerald-400" />
            <hr className="border-neutral-800" />
            <BalanceList title="You owe" items={owesTo} icon={<IconArrowDownLeft size={18} />} color="text-red-400" />
          </div>
        </Section>
      </div>
    </div>
  );
}

// --- Specialized Components ---

function BalanceList({ title, items, icon, color }: any) {
  return (
    <div>
      <div className={cn("flex items-center gap-2 mb-4", color)}>
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-500 pl-6">No pending items.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((s: any, idx: number) => (
            <li key={idx} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-white border border-neutral-700">
                  {s.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-neutral-200">{s.name}</span>
              </div>
              <span className={cn("font-bold", color)}>{formatCurrency(s.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AddExpenseModal({ open, onClose, user }: { open: boolean; onClose: () => void; user: any }) {
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "exact" | "percentage">("equal");
  const [includeSelf, setIncludeSelf] = useState(true);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: friendsData } = useSWR("/api/users/friends", apiFetch);
  const friends = friendsData?.friends || friendsData?.data || [];

  const participants = useMemo(() => {
    const list = friends.filter((f: any) => selectedFriends.includes(f.id));
    if (includeSelf) return [{ id: user.id, name: "You" }, ...list];
    return list;
  }, [selectedFriends, includeSelf, friends, user.id]);

  const validation = useMemo(() => {
    const totalPaise = Number(totalAmount) * 100;
    if (splitType === "equal") return { valid: participants.length > 0, diff: 0 };
    
    const sum = Object.values(customValues).reduce((acc, v) => acc + Number(v), 0);
    if (splitType === "exact") return { valid: Math.abs((sum * 100) - totalPaise) < 1, diff: totalPaise - (sum * 100) };
    if (splitType === "percentage") return { valid: Math.abs(sum - 100) < 0.1, diff: 100 - sum };
    return { valid: false, diff: 0 };
  }, [splitType, customValues, totalAmount, participants]);

  const handleSubmit = async () => {
    if (!description || !totalAmount || !validation.valid) return;
    setIsSubmitting(true);

    const splitData = {
      splitType,
      data: participants.map((p) => ({
        userId: p.id,
        ...(splitType === "exact" && { amount: Number(customValues[p.id] || 0) * 100 }),
        ...(splitType === "percentage" && { percentage: Number(customValues[p.id] || 0) }),
        ...(splitType === "equal" && { splitAmount: 0 }),
      })),
    };

    try {
      await apiFetch("/api/expenses/makeBill", {
        method: "POST",
        body: JSON.stringify({ description, totalAmount: Number(totalAmount) * 100, splitData }),
      });

      mutate("/api/expenses/balances/me");
      mutate("/api/expenses/settlements/me");
      mutate("/api/expenses/chart?period=month");
      onClose();
      // Reset logic...
    } catch (error) {
      alert("Failed to create bill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f0f0f] w-full max-w-lg p-8 rounded-[2.5rem] border border-neutral-800 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Add Expense</h2>
          <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white transition-colors"><IconX size={24} /></button>
        </div>

        <div className="space-y-6">
          {/* Top Inputs */}
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-neutral-900 border border-neutral-800 rounded-2xl focus:border-emerald-500 outline-none transition-all"
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full p-4 pl-10 bg-neutral-900 border border-neutral-800 rounded-2xl focus:border-emerald-500 outline-none transition-all text-xl font-bold"
              />
            </div>
          </div>

          {/* Split Type Tabs */}
          <div className="flex bg-neutral-900 p-1 rounded-xl gap-1">
            {[
              { id: "equal", label: "Equally", icon: <IconEqual size={16} /> },
              { id: "exact", label: "Amounts", icon: <IconCurrencyRupee size={16} /> },
              { id: "percentage", label: "Percentages", icon: <IconPercentage size={16} /> }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSplitType(t.id as any)}
                className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all", 
                  splitType === t.id ? "bg-neutral-800 text-emerald-400 shadow-sm" : "text-neutral-500 hover:text-neutral-300")}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Include Self Toggle */}
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div 
              onClick={() => setIncludeSelf(!includeSelf)}
              className={cn("w-10 h-5 rounded-full transition-all relative", includeSelf ? "bg-emerald-500" : "bg-neutral-700")}
            >
              <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", includeSelf ? "left-6" : "left-1")} />
            </div>
            <span className="text-sm font-medium text-neutral-300">Include myself in the split</span>
          </label>

          {/* Friend Selector */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Split With</p>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {friends.map((friend: any) => (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriends(prev => prev.includes(friend.id) ? prev.filter(i => i !== friend.id) : [...prev, friend.id])}
                  className={cn("p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3", 
                    selectedFriends.includes(friend.id) ? "bg-emerald-500/10 border-emerald-500/50" : "bg-neutral-900 border-transparent hover:border-neutral-800")}
                >
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold", 
                    selectedFriends.includes(friend.id) ? "bg-emerald-500 text-black" : "bg-neutral-800 text-neutral-400")}>
                    {friend.name?.charAt(0)}
                  </div>
                  <span className="text-xs truncate">{friend.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Inputs per Participant (for Exact/Percentage) */}
          {splitType !== "equal" && (
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-neutral-400 truncate">{p.name}</span>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 text-xs">
                      {splitType === "exact" ? "₹" : "%"}
                    </span>
                    <input
                      type="number"
                      value={customValues[p.id] || ""}
                      onChange={(e) => setCustomValues({ ...customValues, [p.id]: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2 pl-6 rounded-lg text-sm text-right focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              ))}
              {!validation.valid && participants.length > 0 && (
                <p className="text-xs text-rose-400 text-right font-medium">
                  Remaining: {splitType === "exact" ? formatCurrency(validation.diff) : `${validation.diff.toFixed(1)}%`}
                </p>
              )}
            </div>
          )}

          {/* Human-Readable Summary */}
          {participants.length > 0 && (
            <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20">
              <p className="text-xs text-emerald-400 leading-relaxed italic">
                {splitType === "equal" 
                  ? `Each of the ${participants.length} people will pay ${formatCurrency((Number(totalAmount) * 100) / participants.length)}.`
                  : `You're splitting ${formatCurrency(Number(totalAmount) * 100)} manually between ${participants.length} people.`
                }
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !description || !totalAmount || !validation.valid}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Save Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, amount, subtitle, type }: any) {
  const isPos = type === "positive";
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex flex-col justify-between h-36">
      <h3 className="text-neutral-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
      <p className={cn("text-3xl font-black", isPos ? "text-emerald-400" : "text-red-400")}>
        {isPos && amount > 0 ? "+" : ""}{formatCurrency(amount)}
      </p>
      <p className="text-[10px] text-neutral-600 font-medium">{subtitle}</p>
    </div>
  );
}

function Section({ title, children, className, headerRight }: any) {
  return (
    <div className={cn("bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-800", className)}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        {headerRight}
      </div>
      {children}
    </div>
  );
}