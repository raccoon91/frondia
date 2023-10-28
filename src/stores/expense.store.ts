import { create } from "zustand";
import { cloneDeep, differenceWith, isEqual, isNil, sortBy } from "lodash-es";
import dayjs from "dayjs";
import { expenseApi } from "@/api";
import { toast } from "@/styles";
import { createEmptyExpense } from "@/utils";
import { useAuthStore, useExpenseTypeStore } from ".";

interface IExpenseStore {
  date: string;
  originExpenses: IExpense[];
  expenses: IExpense[];
  isEnableSave: boolean;
  getDailyExpense: (today: string) => Promise<void>;
  moveDate: (type: "prev" | "next") => void;
  setExpenses: (expenses: IExpense[]) => void;
  addExpense: (type: IExpenseTypes) => void;
  saveExpenses: () => Promise<void>;
}

export const useExpenseStore = create<IExpenseStore>((set, get) => ({
  date: dayjs().format("YYYY-MM-DD"),
  originExpenses: [],
  expenses: [],
  isEnableSave: false,
  getDailyExpense: async (today: string) => {
    try {
      const query = "*, types ( * ), categories ( * )";
      const date = { eq: today };

      const expenses = await expenseApi.gets({ query, date });

      const data: IExpense[] = sortBy(
        [
          ...expenses,
          createEmptyExpense(),
          createEmptyExpense(),
          createEmptyExpense(),
          createEmptyExpense(),
          createEmptyExpense(),
        ],
        "date"
      );

      set({ originExpenses: cloneDeep(data), expenses: data, isEnableSave: false });
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
    const originExpenses = get().originExpenses;

    set({ expenses, isEnableSave: !isEqual(originExpenses, expenses) });
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
  saveExpenses: async () => {
    try {
      const user = useAuthStore.getState().user;

      if (!user) {
        throw new Error("Unauthorized");
      }

      const originExpenses = get().originExpenses;
      const expenses = get().expenses;
      const date = get().date;

      const differenceExpenses = differenceWith(expenses, originExpenses, isEqual);

      const filteredExpenses = differenceExpenses?.filter(
        expense => expense.types?.id && expense.categories?.id && expense.price
      );

      console.log(differenceExpenses);
      console.log(filteredExpenses);

      await expenseApi.upsert(user, date, filteredExpenses);

      const getDailyExpense = get().getDailyExpense;

      await getDailyExpense(date);
    } catch (error) {
      toast.error(error as string);
    }
  },
}));
