"use client";

import React from "react";
import Link from "next/link";
import { InlineMath, BlockMath } from 'react-katex';
import {
  IconArrowLeft,
  IconBrandGithub,
  IconTerminal2,
  IconMathFunction,
  IconDatabase,
  IconTournament,
  IconHierarchy2,
  IconUserCircle,
  IconArrowsMinimize,
} from "@tabler/icons-react";

export default function EngineeringBlogPage() {
  return (
    /* Layout Fix: 
      1. Removed h-screen/h-full to prevent conflicting scroll containers.
      2. Set bg-transparent so it inherits the #0a0a0a from AppLayout main.
      3. pb-20 ensures the content doesn't hit the very bottom of the main scroll area.
    */
    <div className="bg-transparent text-neutral-300 font-sans px-6 py-12 selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-blue-400 transition-colors group"
        >
          <IconArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Engineering Index
        </Link>

        {/* Header */}
        <header className="space-y-8 border-b border-neutral-800 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500 text-xs font-mono tracking-widest uppercase">
              <IconTerminal2 size={18} />
              <span>Technical Brief // 001</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tighter text-balance">
              The Mathematics of Debt Simplification: <span className="text-neutral-500 text-3xl md:text-5xl block mt-2">Graph Theory & Greedy Heaps</span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-xl text-neutral-400 max-w-xl leading-relaxed">
              An analysis of Batwara’s settlement engine: Reducing complex financial webs into <InlineMath math="N-1" /> optimal transactions.
            </p>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/5 border border-blue-500/20 rounded-full w-fit">
              <IconUserCircle size={20} className="text-blue-400" />
              <div className="text-xs font-mono">
                <span className="text-neutral-500 block uppercase tracking-tighter text-[11px]">Lead Engineer</span>
                <span className="text-blue-400 font-bold">Abhinav Mangalore</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <article className="space-y-16 leading-relaxed text-neutral-300">
          
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-blue-400">
              <IconHierarchy2 size={24} />
              <h2 className="text-2xl font-bold text-white tracking-tight">1. Modeling State as a Directed Graph</h2>
            </div>
            <p>
              In peer-to-peer finance, debt complexity scales poorly. We treat the group as a <strong>Directed Weighted Graph</strong> <InlineMath math="G = (V, E)" /> where money flow is unidirectional and measurable.
            </p>

            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono italic text-center">
              <div className="p-4 border border-neutral-800 rounded-lg bg-blue-950/10">
                <span className="text-blue-400 block mb-1 underline decoration-blue-900 underline-offset-4">Vertices (V)</span>
                Participants
              </div>
              <div className="p-4 border border-neutral-800 rounded-lg bg-blue-950/10">
                <span className="text-blue-400 block mb-1 underline decoration-blue-900 underline-offset-4">Edges (E)</span>
                Capital Flow
              </div>
              <div className="p-4 border border-neutral-800 rounded-lg bg-blue-950/10">
                <span className="text-blue-400 block mb-1 underline decoration-blue-900 underline-offset-4">Weights (w)</span>
                Debt Value
              </div>
            </div>
          </section>

          {/* New Section: The 5-Node Example */}
          <section className="space-y-8 p-8 border border-neutral-800 rounded-3xl bg-neutral-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <IconArrowsMinimize size={120} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-blue-500">Case Study:</span> The N-1 Reduction
              </h2>
              <p className="text-sm text-neutral-400">Scaling the logic from a 3-user trivial case to a 5-user complex mesh.</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest font-mono">Initial State: 8 Transactions</p>
              <div className="text-xs grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-neutral-500">
                <div className="p-2 border border-neutral-800 rounded bg-black/40">Alice pays Bob $50, pays Charlie $20</div>
                <div className="p-2 border border-neutral-800 rounded bg-black/40">Bob pays Dan $30, pays Eve $10</div>
                <div className="p-2 border border-neutral-800 rounded bg-black/40">Charlie pays Alice $15, pays Dan $40</div>
                <div className="p-2 border border-neutral-800 rounded bg-black/40">Eve pays Charlie $60, pays Alice $10</div>
              </div>

              <div className="flex justify-center py-4">
                <div className="h-8 w-px bg-gradient-to-b from-blue-500 to-transparent"></div>
              </div>

              <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest font-mono text-center">Batwara Compression: 4 Transactions</p>
              <p className="text-sm">We compute the Net Balance <InlineMath math="B_i" /> for <InlineMath math="N=5" /> nodes:</p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs text-center">
                <div className="p-3 border border-neutral-800 rounded-xl bg-blue-500/5">
                   <p className="text-neutral-500 mb-1">Alice</p>
                   <p className="text-blue-400 font-bold">+$40</p>
                </div>
                <div className="p-3 border border-neutral-800 rounded-xl bg-blue-500/5">
                   <p className="text-neutral-500 mb-1">Bob</p>
                   <p className="text-blue-400 font-bold">+$10</p>
                </div>
                <div className="p-3 border border-neutral-800 rounded-xl bg-blue-500/5">
                   <p className="text-neutral-500 mb-1">Charlie</p>
                   <p className="text-blue-400 font-bold">+$25</p>
                </div>
                <div className="p-3 border border-neutral-800 rounded-xl bg-red-500/5 border-red-950/20">
                   <p className="text-neutral-500 mb-1">Dan</p>
                   <p className="text-red-400 font-bold">-$70</p>
                </div>
                <div className="p-3 border border-neutral-800 rounded-xl bg-red-500/5 border-red-950/20">
                   <p className="text-neutral-500 mb-1">Eve</p>
                   <p className="text-red-400 font-bold">-$5</p>
                </div>
              </div>

              <div className="bg-black/40 p-5 rounded-2xl border border-blue-500/20 space-y-2">
                <p className="text-xs text-neutral-500 font-mono mb-2">RESULTING OPTIMAL PATHS:</p>
                <ol className="text-sm space-y-1 font-mono list-decimal list-inside">
                  <li>Dan <span className="text-blue-400">→</span> Alice : <span className="text-white">$40</span></li>
                  <li>Dan <span className="text-blue-400">→</span> Charlie : <span className="text-white">$25</span></li>
                  <li>Dan <span className="text-blue-400">→</span> Bob : <span className="text-white">$5</span></li>
                  <li>Eve <span className="text-blue-400">→</span> Bob : <span className="text-white">$5</span></li>
                </ol>
                <div className="pt-4 text-[10px] text-blue-500/50 uppercase tracking-tighter">
                  Total Transactions: 4 (Exactly <InlineMath math="N-1" />)
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 text-blue-400">
              <IconTournament size={24} />
              <h2 className="text-2xl font-bold text-white tracking-tight">2. Net Balance Abstraction</h2>
            </div>
            <p>
              The system operates as a <strong>closed-loop zero-sum game</strong>. For any ledger to be valid, the net sum of individual balances must resolve to zero:
            </p>
            <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 flex justify-center items-center shadow-inner">
              <BlockMath math="\sum_{i=1}^{n} B_i = 0" />
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 text-blue-400">
              <IconMathFunction size={24} />
              <h2 className="text-2xl font-bold text-white tracking-tight">3. Settlement via Greedy Max-Heaps</h2>
            </div>
            <p>
              To achieve transaction minimality, we pair the <strong>greatest creditor</strong> with the <strong>greatest debtor</strong> iteratively using two priority queues.
            </p>

            

            <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
              <div className="bg-neutral-800/50 px-4 py-2 text-[10px] font-mono text-neutral-500 flex justify-between uppercase tracking-widest">
                <span>Algorithm Implementation</span>
                <span className="text-blue-500">TypeScript / Priority Queues</span>
              </div>
              <pre className="bg-[#050505] p-6 overflow-x-auto text-sm font-mono leading-relaxed text-neutral-400">
{`while (creditors.isNotEmpty() && debtors.isNotEmpty()) {
  const gainer = creditors.pop(); 
  const loser = debtors.pop();   

  const amount = Math.min(gainer.val, Math.abs(loser.val));
  executeTransfer(loser.id, gainer.id, amount);

  if (gainer.val > amount) {
    creditors.push({ id: gainer.id, val: gainer.val - amount });
  } else if (Math.abs(loser.val) > amount) {
    debtors.push({ id: loser.id, val: loser.val + amount });
  }
}`}
              </pre>
            </div>
          </section>

          <section className="space-y-6 pb-20">
            <div className="flex items-center gap-3 text-blue-400">
              <IconDatabase size={24} />
              <h2 className="text-2xl font-bold text-white tracking-tight">4. Dual-Store Persistence Architecture</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-neutral-800 bg-neutral-900/30 rounded-2xl space-y-3 hover:border-blue-500/30 transition-all group">
                <h4 className="font-bold text-white flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 group-hover:shadow-[0_0_8px_rgba(14,165,233,0.8)] transition-all"></span>
                  PostgreSQL
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  The <strong>Immutable Ledger</strong>. Stores raw transactional data with ACID guarantees for total audit integrity.
                </p>
              </div>
              <div className="p-6 border border-neutral-800 bg-neutral-900/30 rounded-2xl space-y-3 hover:border-blue-500/30 transition-all group">
                <h4 className="font-bold text-white flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all"></span>
                  Neo4j
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  The <strong>Computation Layer</strong>. Facilitates sub-millisecond graph traversals and optimal path-finding.
                </p>
              </div>
            </div>
          </section>
        </article>

        <footer className="pt-16 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-600 text-[10px] font-mono uppercase tracking-[0.2em] pb-12">
          <div className="flex items-center gap-4">
            <IconBrandGithub size={18} className="hover:text-blue-400 transition-colors cursor-pointer" />
            <span>Open Source Protocol</span>
          </div>
          <p>© 2026 Batwara Engineering Lab // Lead Engineer Signature</p>
        </footer>
      </div>
    </div>
  );
}