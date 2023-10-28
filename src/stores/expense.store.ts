import { create } from "zustand";
import { isNil, sortBy } from "lodash-es";
import dayjs from "dayjs";
import { expenseApi } from "@/api";
import { toast } from "@/styles";
import { createEmptyExpense } from "@/utils";
import { useExpenseTypeStore } from ".";

interface IExpenseStore {
  date: string;
  expenses: IExpense[];
  getDailyExpense: (today: string) => Promise<void>;
  moveDate: (type: "prev" | "next") => void;
  setExpenses: (expenses: IExpense[]) => void;
  addExpense: (type: IExpenseTypes) => void;
}

export const useExpenseStore = create<IExpenseStore>((set, get) => ({
  date: dayjs().format("YYYY-MM-DD"),
  expenses: [],
  getDailyExpense: async (today: string) => {
    try {
      const query = "*, types ( * ), categories ( * )";
      const date = { eq: today };

      const incomes = await expenseApi.gets("incomes", { query, date });
      const savings = await expenseApi.gets("savings", { query, date });
      const investments = await expenseApi.gets("investments", { query, date });
      const expenses = await expenseApi.gets("expenses", { query, date });

      const data: IExpense[] = sortBy(
        [
          ...(incomes ?? []),
          ...(savings ?? []),
          ...(investments ?? []),
          ...(expenses ?? []),
          createEmptyExpense(),
          createEmptyExpense(),
          createEmptyExpense(),
          createEmptyExpense(),
          createEmptyExpense(),
        ],
        "date"
      );

      set({ expenses: data ?? [] });
    } catch (error) {
      toast.error(error as string);
    }
  },
  moveDate: type => {
    const date = get().date;

    if (type === "prev") {
      set({ date: dayjs(date).subtract(1, "day").format("YYYY-MM-DD") });
    } else {
      set({ date: dayjs(date).add(1, "day").format("YYYY-MM-DD") });
    }
  },
  setExpenses: (expenses: IExpense[]) => {
    set({ expenses });
  },
  addExpense: (type: IExpenseTypes) => {
    const expenses = get().expenses;
    const expenseTypes = useExpenseTypeStore.getState().expenseTypes;
    const expenseType = expenseTypes.find(expenseType => expenseType.type === type);

    set({
      expenses: [
        ...expenses.filter(
          expense => !isNil(expense.id) || !isNil(expense.types?.id) || !isNil(expense.categories?.id)
        ),
        createEmptyExpense(expenseType),
        createEmptyExpense(),
        createEmptyExpense(),
        createEmptyExpense(),
        createEmptyExpense(),
        createEmptyExpense(),
      ],
    });
  },
}));
