import { create } from "zustand";
import { isNil, sortBy } from "lodash-es";
import dayjs from "dayjs";
import { expenseApi } from "@/api";
import { toast } from "@/styles";
import { createEmptyExpense } from "@/utils";
import { useExpenseTypeStore } from ".";

interface IExpenseStore {
  expenses: IExpense[];
  getDailyExpense: () => Promise<void>;
  setExpenses: (expenses: IExpense[]) => void;
  addExpense: (type: IExpenseTeyps) => void;
}

export const useExpenseStore = create<IExpenseStore>((set, get) => ({
  expenses: [],
  getDailyExpense: async () => {
    try {
      const query = "*, types ( * ), categories ( * )";
      const date = { eq: dayjs().format("YYYY-MM-DD") };

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
  setExpenses: (expenses: IExpense[]) => {
    set({ expenses });
  },
  addExpense: (type: IExpenseTeyps) => {
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
