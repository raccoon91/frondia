import { create } from "zustand";
import dayjs from "dayjs";
import { expenseApi } from "@/api";
import { toast } from "@/styles";

interface IAnnualStore {
  isFetched: boolean;
  isLoaded: boolean;
  date: string | null;
  annual: Record<string, Record<string, number>> | null;
  category: Record<string, Record<string, { value: number; color: string | null }>> | null;
  getAnualExpense: () => Promise<void>;
  setDate: (date: string | null) => void;
}

export const useAnnualStore = create<IAnnualStore>(set => ({
  isFetched: false,
  isLoaded: false,
  date: null,
  annual: null,
  category: null,
  getAnualExpense: async () => {
    try {
      set({ isLoaded: false });

      const date = {
        from: dayjs().startOf("year").format("YYYY-MM-DD"),
        to: dayjs().endOf("year").format("YYYY-MM-DD"),
      };

      const expenses = await expenseApi.gets({ query: "*, types ( * ), categories ( * )", date });

      const { annual, category } = expenses.reduce(
        (acc, cur) => {
          if (!cur.price) return acc;

          if (!cur.types?.name || !cur.categories?.name) return acc;

          const date = dayjs(cur.date).format("YYYY-MM");

          if (!acc.annual[date]) acc.annual[date] = { incomes: 0, expenses: 0, savings: 0, investments: 0 };

          if (!acc.category?.[date]) acc.category[date] = {};

          if (cur.types?.name === "수입") {
            acc.annual[date].incomes += cur.price;
          } else if (cur.types?.name === "지출") {
            acc.annual[date].expenses += cur.price;
          } else if (cur.types?.name === "저축") {
            acc.annual[date].savings += cur.price;
          } else if (cur.types?.name === "투자") {
            acc.annual[date].investments += cur.price;
          }

          if (!acc.category[date][cur.categories.name])
            acc.category[date][cur.categories.name] = { value: 0, color: cur.categories.color };

          acc.category[date][cur.categories.name].value += cur.price;

          return acc;
        },
        {
          annual: {} as Record<string, Record<string, number>>,
          category: {} as Record<string, Record<string, { value: number; color: string | null }>>,
        }
      );

      set({ isFetched: true, isLoaded: true, annual, category });
    } catch (error) {
      toast.error(error);
    }
  },
  setDate(date) {
    set({ date });
  },
}));
