import { create } from "zustand";
import dayjs from "dayjs";
import { expenseApi } from "@/api";
import { toast } from "@/styles";

interface IAnnualStore {
  isFetched: boolean;
  isLoaded: boolean;
  date: string | null;
  labels: string[] | null;
  price: { incomes: IExpense[]; expenses: IExpense[]; savings: IExpense[]; investments: IExpense[] } | null;
  category: Record<string, Record<string, { value: number; color: string | null }>> | null;
  getAnualExpense: () => Promise<void>;
  setDate: (date: string | null) => void;
}

export const useAnnualStore = create<IAnnualStore>(set => ({
  isFetched: false,
  isLoaded: false,
  date: null,
  labels: null,
  price: null,
  category: null,
  getAnualExpense: async () => {
    try {
      set({ isLoaded: false });

      const date = {
        from: dayjs().startOf("year").format("YYYY-MM-DD"),
        to: dayjs().endOf("year").format("YYYY-MM-DD"),
      };

      const expenses = await expenseApi.gets({ query: "*, types ( * ), categories ( * )", date });

      const { labels, price, category } = expenses.reduce(
        (acc, cur) => {
          if (!cur.price) return acc;

          if (!cur.types?.name || !cur.categories?.name) return acc;

          const date = dayjs(cur.date).format("YYYY-MM");

          acc.labels.add(date);

          if (!acc.category?.[date]) acc.category[date] = {};

          if (cur.types?.name === "수입") {
            acc.price.incomes.push(cur);
          } else if (cur.types?.name === "지출") {
            acc.price.expenses.push(cur);
          } else if (cur.types?.name === "저축") {
            acc.price.savings.push(cur);
          } else if (cur.types?.name === "투자") {
            acc.price.investments.push(cur);
          }

          if (!acc.category[date][cur.categories.name])
            acc.category[date][cur.categories.name] = { value: 0, color: cur.categories.color };

          acc.category[date][cur.categories.name].value += cur.price;

          return acc;
        },
        {
          labels: new Set() as Set<string>,
          price: { incomes: [], expenses: [], savings: [], investments: [] } as {
            incomes: IExpense[];
            expenses: IExpense[];
            savings: IExpense[];
            investments: IExpense[];
          },
          category: {} as Record<string, Record<string, { value: number; color: string | null }>>,
        }
      );

      set({ isFetched: true, isLoaded: true, labels: [...labels], price, category });
    } catch (error) {
      toast.error(error);
    }
  },
  setDate(date) {
    set({ date });
  },
}));
