import dayjs from "dayjs";
import { sortBy } from "lodash-es";
import { create } from "zustand";
import { expenseApi } from "@/api";
import { toast } from "@/styles";

interface IExpenseStore {
  expenses: IExpense[];
  getExpenses: () => Promise<void>;
  setExpenses: (expenses: IExpense[]) => void;
  addIncome: () => void;
  addExpense: () => void;
  addSaving: () => void;
  addInvestment: () => void;
}

export const useExpenseStore = create<IExpenseStore>((set, get) => ({
  expenses: [],
  getExpenses: async () => {
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
          { id: null, type_id: null, category_id: null, price: "", note: "" },
          { id: null, type_id: null, category_id: null, price: "", note: "" },
          { id: null, type_id: null, category_id: null, price: "", note: "" },
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
  addIncome: () => {
    const expenses = get().expenses;

    set({
      expenses: [
        ...expenses.filter(expense => expense.id !== null || expense.type_id !== null || expense.category_id !== null),
        {
          id: null,
          type_id: 7,
          types: { id: 7, name: "수입", type: "income" },
          category_id: null,
          price: "",
          note: "",
        },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
      ],
    });
  },
  addExpense: () => {
    const expenses = get().expenses;

    set({
      expenses: [
        ...expenses.filter(expense => expense.id !== null || expense.type_id !== null || expense.category_id !== null),
        {
          id: null,
          type_id: 8,
          types: { id: 8, name: "지출", type: "expense" },
          category_id: null,
          price: "",
          note: "",
        },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
      ],
    });
  },
  addSaving: () => {
    const expenses = get().expenses;

    set({
      expenses: [
        ...expenses.filter(expense => expense.id !== null || expense.type_id !== null || expense.category_id !== null),
        {
          id: null,
          type_id: 9,
          types: { id: 9, name: "저축", type: "saving" },
          category_id: null,
          price: "",
          note: "",
        },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
      ],
    });
  },
  addInvestment: () => {
    const expenses = get().expenses;

    set({
      expenses: [
        ...expenses.filter(expense => expense.id !== null || expense.type_id !== null || expense.category_id !== null),
        {
          id: null,
          type_id: 10,
          types: { id: 10, name: "투자", type: "investment" },
          category_id: null,
          price: "",
          note: "",
        },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
        { id: null, type_id: null, category_id: null, price: "", note: "" },
      ],
    });
  },
}));
