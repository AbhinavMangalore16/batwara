"use client";

import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { 
  IconScale, 
  IconGitPullRequest, 
  IconCheck, 
  IconArrowRight, 
  IconSparkles,
  IconShieldCheck,
  IconClock,
  IconArrowUpRight,
  IconArrowDownLeft
} from "@tabler/icons-react";
import { apiFetch } from "@/lib/api";

const formatCurrency = (amount: number = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount / 100);
};

export default function SettlementsPage() {
  const [isPersisting, setIsPersisting] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const { data: user } = useSWR("/api/users/me", apiFetch);
  const { data: settlementsData, mutate: mutateSettlements } = useSWR(
    "/api/expenses/settlements/me",
    apiFetch
  );
  const { data: optimizedData, mutate: mutateOptimized } = useSWR(
    "/api/expenses/settlements/optimized",
    apiFetch
  );
  const { data: balancesData, mutate: mutateBalances } = useSWR(
    "/api/expenses/balances/me",
    apiFetch
  );

  const { owesTo = [], receivesFrom = [] } = settlementsData?.settlements ?? {};
  const optimizedList = optimizedData?.optimized || [];

  const handlePersistOptimization = async () => {
    setIsPersisting(true);
    try {
      await apiFetch("/api/expenses/settlements/optimized/persist", {
        method: "POST",
      });
      mutateSettlements();
      mutateOptimized();
      mutateBalances();
      alert("Optimized settlements persisted successfully!");
    } catch (error) {
      console.error("Failed to persist optimization:", error);
      alert("Could not persist optimization. Please try again.");
    } finally {
      setIsPersisting(false);
    }
  };

  const handleMarkPaid = async (settlementId: string) => {
    setPayingId(settlementId);
    try {
      await apiFetch(`/api/expenses/settlements/${settlementId}/pay`, {
        method: "POST",
      });
      mutateSettlements();
      mutateOptimized();
      mutateBalances();
    } catch (error) {
      console.error("Failed to mark paid:", error);
      alert("Failed to update settlement status. Please try again.");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-emerald-400 tracking-tight flex items-center gap-3">
            <IconScale className="size-9" />
            Settlements & Debt Graph Optimization
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Neo4j graph algorithm minimizes cash flows and simplifies multi-person debts.
          </p>
        </div>

        <button
          onClick={handlePersistOptimization}
          disabled={isPersisting}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50"
        >
          <IconSparkles size={20} />
          {isPersisting ? "Simplifying Debt Graph..." : "Persist Neo4j Optimization"}
        </button>
      </div>

      {/* Neo4j Graph Optimization Hero Card */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-emerald-950/30 border border-emerald-500/20 p-6 rounded-3xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <IconGitPullRequest className="size-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Neo4j Minimal Cash Flow Engine</h2>
            <p className="text-xs text-neutral-400">
              Graph-based transitive debt cancellation (e.g. A owes B, B owes C → A pays C directly).
            </p>
          </div>
        </div>

        {optimizedList.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 border border-dashed border-neutral-800/80 rounded-2xl bg-neutral-950/40">
            No debt cycles to simplify. All debts are currently direct and optimal!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {optimizedList.map((opt: any, idx: number) => (
              <div key={idx} className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <span className="text-rose-400">{opt.fromName || opt.from}</span>
                  <IconArrowRight size={16} className="text-neutral-500" />
                  <span className="text-emerald-400">{opt.toName || opt.to}</span>
                </div>
                <span className="text-base font-extrabold text-white bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
                  {formatCurrency(opt.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active User Settlements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Receivables List */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <IconArrowUpRight className="text-emerald-400 size-5" />
              People Who Owe You
            </h2>
            <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              {receivesFrom.length} Pending
            </span>
          </div>

          {receivesFrom.length === 0 ? (
            <p className="text-neutral-500 py-6 text-center border border-dashed border-neutral-800 rounded-xl text-sm">
              All receivables settled!
            </p>
          ) : (
            <div className="space-y-3">
              {receivesFrom.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                      {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-200">{item.name}</p>
                      <p className="text-xs text-emerald-400/80 font-medium">To collect</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-extrabold text-emerald-400 text-lg">
                      {formatCurrency(item.amount)}
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Awaiting Payment</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payables List */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <IconArrowDownLeft className="text-rose-400 size-5" />
              People You Owe
            </h2>
            <span className="text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full">
              {owesTo.length} Pending
            </span>
          </div>

          {owesTo.length === 0 ? (
            <p className="text-neutral-500 py-6 text-center border border-dashed border-neutral-800 rounded-xl text-sm">
              You're completely settled up!
            </p>
          ) : (
            <div className="space-y-3">
              {owesTo.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
                      {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-200">{item.name}</p>
                      <p className="text-xs text-rose-400/80 font-medium">To pay</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-rose-400 text-lg">
                      {formatCurrency(item.amount)}
                    </span>
                    {item.id && (
                      <button
                        onClick={() => handleMarkPaid(item.id)}
                        disabled={payingId === item.id}
                        className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <IconCheck size={14} />
                        {payingId === item.id ? "Settling..." : "Settle Up"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
