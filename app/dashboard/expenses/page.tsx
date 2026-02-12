// "use client";

// import { useEffect, useState } from "react";
// import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { ExpensesTable } from "@/components/dashboard/expenses-table";
// import { api } from "@/lib/api";
// import { BillPayload } from "@/types";
// import { toast } from "sonner";
// import { Separator } from "@/components/ui/separator";

// export default function ExpensesPage() {
//   const [bills, setBills] = useState<Bill[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch bill history
//     api.getBillHistory()
//        .then((res) => setBills(res.bills))
//        .catch(() => toast.error("Could not load expenses"))
//        .finally(() => setLoading(false));
//   }, []);

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800 bg-[#0D1117] px-4">
//            <SidebarTrigger className="-ml-1 text-slate-200" />
//            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-700" />
//            <h1 className="text-base font-medium text-white">My Expenses</h1>
//         </header>

//         <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#0D1117]">
//           <div className="py-6">
//              {loading ? (
//                  <div className="text-slate-500">Loading history...</div>
//              ) : (
//                  <ExpensesTable data={bills} />
//              )}
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }