import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { supabase } from "@/lib/supabase";

interface TransactionState {
  transactions: any[];

  getTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>()(
  devtools((set) => ({
    transactions: [],

    getTransactions: async () => {
      try {
        const { data } = await supabase.from("transactions").select("*");

        set({ transactions: data ?? [] }, false, "getTransactions");
      } catch (error) {
        console.error(error);
      }
    },
  })),
);
