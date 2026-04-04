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

// --- Types ---
interface Participant {
  id: string;
  name: string;
}

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
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
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
    if (!chartData?.paidByMe) return { data: [], thisMonth: 0 };
    const merged: Record<string, any> = {};
    let currentMonthTotal = 0;
    chartData.paidByMe.forEach((item: any) => {
      merged[item.date] = { date: item.date, Paid: item.totalAmount / 100 };
      currentMonthTotal += item.totalAmount;
    });
    return {
      data: Object.values(merged).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      thisMonth: currentMonthTotal,
    };
  }, [chartData]);

  const yearlyTotal = useMemo(() => {
    return yearlyChartData?.paidByMe?.reduce((acc: number, item: any) => acc + item.totalAmount, 0) || 0;
  }, [yearlyChartData]);

  return (
    <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-black text-emerald-400 tracking-tighter">BATWARA</h1>
        <button
          onClick={() => setIsExpenseOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
        >
          <IconPlus size={20} />
          New Bill
        </button>
        <AddExpenseModal open={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} user={user} />
      </div>

      {/* --- Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Overall" amount={myBalance.balance} subtitle={myBalance.balance >= 0 ? "You're in the green" : "You're in debt"} type={myBalance.balance >= 0 ? "positive" : "negative"} />
        <SummaryCard title="Receivable" amount={myBalance.receives} subtitle={`From ${receivesFrom.length} friends`} type="positive" />
        <SummaryCard title="Payable" amount={myBalance.owes} subtitle={`To ${owesTo.length} friends`} type="negative" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Trends --- */}
        <Section title="Spending Trends" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-neutral-800/20 p-5 rounded-2xl border border-neutral-800/50">
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Monthly Total</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(formattedChartData.thisMonth)}</p>
            </div>
            <div className="bg-neutral-800/20 p-5 rounded-2xl border border-neutral-800/50">
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Annual Total</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(yearlyTotal)}</p>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedChartData.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                <XAxis dataKey="date" stroke="#444" tick={{ fontSize: 10, fontWeight: 600 }} dy={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#444" tick={{ fontSize: 10, fontWeight: 600 }} dx={-10} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#111" }} contentStyle={{ backgroundColor: "#000", border: "1px solid #333", borderRadius: "12px", fontSize: '12px' }} />
                <Bar dataKey="Paid" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* --- Settlements --- */}
        <Section title="Active Debts" className="lg:col-span-1">
          <div className="space-y-8 mt-4">
            <BalanceList title="Owed to you" items={receivesFrom} icon={<IconArrowUpRight size={18} />} color="text-emerald-400" />
            <div className="h-px bg-neutral-800 w-full" />
            <BalanceList title="You owe" items={owesTo} icon={<IconArrowDownLeft size={18} />} color="text-red-400" />
          </div>
        </Section>
      </div>
    </div>
  );
}

// --- Logic Components ---

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

  // Derived: List of people involved in the split
  const participants = useMemo<Participant[]>(() => {
    const list = friends
      .filter((f: any) => selectedFriends.includes(f.id))
      .map((f: any) => ({ id: f.id, name: f.name }));
    if (includeSelf) return [{ id: user.id, name: "You" }, ...list];
    return list;
  }, [selectedFriends, includeSelf, friends, user.id]);

  // Validation: Ensure manual splits equal the total
  const validation = useMemo(() => {
    const totalPaise = Math.round(Number(totalAmount) * 100);
    if (splitType === "equal") return { valid: participants.length > 0, diff: 0 };
    
    const sum = Object.values(customValues).reduce((acc, v) => acc + (Number(v) || 0), 0);
    if (splitType === "exact") {
        const sumPaise = Math.round(sum * 100);
        return { valid: sumPaise === totalPaise && participants.length > 0, diff: totalPaise - sumPaise };
    }
    if (splitType === "percentage") {
        return { valid: Math.abs(sum - 100) < 0.01 && participants.length > 0, diff: 100 - sum };
    }
    return { valid: false, diff: 0 };
  }, [splitType, customValues, totalAmount, participants]);

  const handleSubmit = async () => {
    if (!description || !totalAmount || !validation.valid) return;
    setIsSubmitting(true);

    const payload = {
      description,
      totalAmount: Math.round(Number(totalAmount) * 100),
      splitData: {
        splitType,
        data: participants.map((p: Participant) => ({
          userId: p.id,
          ...(splitType === "exact" && { amount: Math.round(Number(customValues[p.id] || 0) * 100) }),
          ...(splitType === "percentage" && { percentage: Number(customValues[p.id] || 0) }),
          ...(splitType === "equal" && { splitAmount: 0 }),
        })),
      },
    };

    try {
      await apiFetch("/api/expenses/makeBill", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Clear state and refresh
      mutate("/api/expenses/balances/me");
      mutate("/api/expenses/settlements/me");
      mutate("/api/expenses/chart?period=month");
      
      setDescription("");
      setTotalAmount("");
      setCustomValues({});
      setSelectedFriends([]);
      onClose();
    } catch (error) {
      alert("Failed to create bill. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-[#0c0c0c] w-full max-w-lg p-8 rounded-[2.5rem] border border-neutral-800 shadow-2xl overflow-y-auto max-h-[92vh] custom-scrollbar">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Add Expense</h2>
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">New Transaction</p>
          </div>
          <button onClick={onClose} className="p-2 bg-neutral-900 text-neutral-500 hover:text-white rounded-full transition-colors"><IconX size={20} /></button>
        </div>

        <div className="space-y-6">
          {/* Main Inputs */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Description (e.g. Dinner, Rafting)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl focus:border-emerald-500/50 outline-none transition-all placeholder:text-neutral-700 font-medium"
            />
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full p-5 pl-10 bg-neutral-900/50 border border-neutral-800 rounded-2xl focus:border-emerald-500 outline-none transition-all text-2xl font-black tabular-nums"
              />
            </div>
          </div>

          {/* Split Mode Selector */}
          <div className="flex bg-neutral-900 p-1.5 rounded-2xl gap-1 border border-neutral-800/50">
            {[
              { id: "equal", label: "Equally", icon: <IconEqual size={14} /> },
              { id: "exact", label: "Exact", icon: <IconCurrencyRupee size={14} /> },
              { id: "percentage", label: "Percent", icon: <IconPercentage size={14} /> }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setSplitType(t.id as any); setCustomValues({}); }}
                className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", 
                  splitType === t.id ? "bg-emerald-500 text-black shadow-lg" : "text-neutral-500 hover:bg-neutral-800")}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* User Options */}
          <div className="flex items-center justify-between px-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                onClick={() => setIncludeSelf(!includeSelf)}
                className={cn("w-9 h-5 rounded-full transition-all relative", includeSelf ? "bg-emerald-500" : "bg-neutral-800 border border-neutral-700")}
              >
                <div className={cn("absolute top-1 w-3 h-3 rounded-full transition-all", includeSelf ? "left-5 bg-black" : "left-1 bg-neutral-600")} />
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Include Myself</span>
            </label>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md">
                {participants.length} Active
            </span>
          </div>

          {/* Friend Grid */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
              {friends.map((friend: any) => (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriends(prev => prev.includes(friend.id) ? prev.filter(i => i !== friend.id) : [...prev, friend.id])}
                  className={cn("p-3 rounded-2xl border transition-all flex items-center gap-3 group cursor-pointer", 
                    selectedFriends.includes(friend.id) ? "bg-emerald-500/5 border-emerald-500/40" : "bg-neutral-900/30 border-transparent hover:border-neutral-700")}
                >
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all", 
                    selectedFriends.includes(friend.id) ? "bg-emerald-500 text-black" : "bg-neutral-800 text-neutral-500 group-hover:bg-neutral-700")}>
                    {friend.name?.charAt(0)}
                  </div>
                  <span className="text-xs font-bold truncate text-neutral-300">{friend.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Input List */}
          {splitType !== "equal" && participants.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-neutral-800 animate-in fade-in slide-in-from-top-2">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 bg-neutral-900/40 p-3 rounded-2xl border border-neutral-800/50">
                  <span className="text-xs font-bold text-neutral-400 truncate">{p.name}</span>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 text-[10px] font-bold">
                      {splitType === "exact" ? "₹" : "%"}
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={customValues[p.id] || ""}
                      onChange={(e) => setCustomValues({ ...customValues, [p.id]: e.target.value })}
                      className="w-full bg-black border border-neutral-800 p-2 pl-7 rounded-xl text-xs font-black text-right focus:border-emerald-500 outline-none tabular-nums"
                    />
                  </div>
                </div>
              ))}
              {!validation.valid && (
                <div className="flex justify-between items-center px-2 py-1">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic">Correction Needed</p>
                    <p className="text-xs font-black text-rose-500">
                      Remaining: {splitType === "exact" ? formatCurrency(validation.diff) : `${validation.diff.toFixed(1)}%`}
                    </p>
                </div>
              )}
            </div>
          )}

          {/* Human Readable Box */}
          {participants.length > 0 && (
            <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
              <p className="text-[10px] font-bold text-emerald-500 leading-relaxed uppercase tracking-tighter italic">
                {splitType === "equal" 
                  ? `Each person pays ${formatCurrency(Math.round((Number(totalAmount) * 100) / participants.length))}`
                  : `Manual ${splitType} split across ${participants.length} members`
                }
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !description || !totalAmount || !validation.valid}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl transition-all shadow-2xl shadow-emerald-500/20 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed uppercase tracking-widest text-xs"
          >
            {isSubmitting ? "Syncing..." : "Confirm Batwara"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- UI Atoms ---

function BalanceList({ title, items, icon, color }: any) {
  return (
    <div>
      <div className={cn("flex items-center gap-2 mb-5 px-1", color)}>
        {icon}
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest pl-7">No active debt</p>
      ) : (
        <ul className="space-y-4">
          {items.map((s: any, idx: number) => (
            <li key={idx} className="flex items-center justify-between group bg-neutral-900/20 p-3 rounded-2xl border border-transparent hover:border-neutral-800 transition-all hover:bg-neutral-900/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-black text-neutral-400 border border-neutral-700 group-hover:border-emerald-500/50">
                  {s.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-neutral-200">{s.name}</span>
              </div>
              <span className={cn("text-sm font-black tabular-nums", color)}>{formatCurrency(s.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SummaryCard({ title, amount, subtitle, type }: { title: string, amount: number, subtitle: string, type: "positive" | "negative" }) {
  const isPos = type === "positive";
  return (
    <div className="bg-[#0c0c0c] border border-neutral-800 p-7 rounded-[2rem] flex flex-col justify-between h-40 group hover:border-neutral-700 transition-all">
      <h3 className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
      <p className={cn("text-3xl font-black tracking-tighter tabular-nums", isPos ? "text-emerald-400" : "text-rose-400")}>
        {isPos && amount > 0 ? "+" : ""}{formatCurrency(amount)}
      </p>
      <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">{subtitle}</p>
    </div>
  );
}

function Section({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-[#0c0c0c] p-8 rounded-[2.5rem] border border-neutral-800", className)}>
      <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-neutral-500">{title}</h2>
      {children}
    </div>
  );
}