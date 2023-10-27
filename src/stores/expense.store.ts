import dayjs from "dayjs";
import { sortBy } from "lodash-es";
import { create } from "zustand";
import { supabase } from "../db";
import { toast } from "../styles";

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
      const today = dayjs().format("YYYY-MM-DD");
      const { data: incomes } = await supabase
        .from("incomes")
        .select<string, IExpense>("*, types ( * ), categories ( * )")
        .eq("date", today);
      const { data: expenses } = await supabase
        .from("expenses")
        .select<string, IExpense>("*, types ( * ), categories ( * )")
        .eq("date", today);
      const { data: investments } = await supabase
        .from("investments")
        .select<string, IExpense>("*, types ( * ), categories ( * )")
        .eq("date", today);
      const { data: savings } = await supabase
        .from("savings")
        .select<string, IExpense>("*, types ( * ), categories ( * )")
        .eq("date", today);

      const data: IExpense[] = sortBy(
        [
          ...(incomes ?? []),
          ...(expenses ?? []),
          ...(investments ?? []),
          ...(savings ?? []),
          { id: null, type_id: null, category_id: null, price: "", note: "" },
          { id: null, type_id: null, category_id: null, price: "", note: "" },
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
