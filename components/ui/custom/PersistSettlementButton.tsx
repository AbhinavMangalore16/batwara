// src/components/batwara/PersistSettlementButton.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function PersistSettlementButton({
  onDone,
}: {
  onDone?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handlePersist = async () => {
    try {
      setLoading(true);
      await api.persistOptimizedSettlements();
      toast.success("Optimized settlements persisted!");
      onDone?.();
    } catch (err: any) {
      toast.error(err?.message || "Failed to persist settlements.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePersist}
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white"
    >
      <Zap className="mr-2 h-4 w-4" />
      {loading ? "Persisting..." : "Persist Optimized"}
    </Button>
  );
}
