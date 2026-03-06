import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowRightLeft, Users } from "lucide-react";

interface OverviewProps {
  balance: number;
  settlementCount: number;
  loading: boolean;
}

export function OverviewCards({ balance, settlementCount, loading }: OverviewProps) {
  if (loading) return <div className="grid gap-4 md:grid-cols-3 h-32 animate-pulse bg-slate-800/50 rounded-xl" />;

  const isPositive = balance >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Card 1: Net Balance */}
      <Card className="bg-[#161B22] border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Net Position</CardTitle>
          <Wallet className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? "+" : ""}₹{Math.abs(balance).toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isPositive ? "You are owed in total" : "You owe in total"}
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Pending Settlements */}
      <Card className="bg-[#161B22] border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Pending Actions</CardTitle>
          <ArrowRightLeft className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{settlementCount}</div>
          <p className="text-xs text-slate-500 mt-1">Settlements waiting for payment</p>
        </CardContent>
      </Card>

      {/* Card 3: Static for now (or Friends count later) */}
      <Card className="bg-[#161B22] border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Total Groups</CardTitle>
          <Users className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">3</div>
          <p className="text-xs text-slate-500 mt-1">Active expense groups</p>
        </CardContent>
      </Card>
    </div>
  );
}