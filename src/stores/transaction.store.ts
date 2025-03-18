import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";

interface TransactionState {
  currencies: Currency[];
  transactionTypes: TransactionType[];
  categories: Category[];

  transactionDatasets: TransactionData[];

  getCurrencies: () => Promise<void>;
  getTransactionTypes: () => Promise<void>;
  getCategories: () => Promise<void>;

  getTransactions: () => Promise<void>;

  addTransaction: () => void;
  changeTransaction: (rowIndex: number, columnName: string, value: number | string) => void;

  createTransaction: (rowIndex: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>()(
  devtools((set, get) => ({
    currencies: [],
    transactionTypes: [],
    categories: [],

    transactionDatasets: [],

    getCurrencies: async () => {
      try {
        const { data } = await supabase.from("currencies").select("*");

        set({ currencies: data ?? [] }, false, "getCurrencies");
      } catch (error) {
        console.error(error);
      }
    },
    getTransactionTypes: async () => {
      try {
        const { data } = await supabase.from("transaction_types").select("*");

        set({ transactionTypes: data ?? [] }, false, "getTransactionTypes");
      } catch (error) {
        console.error(error);
      }
    },
    getCategories: async () => {
      try {
        const { data } = await supabase.from("categories").select("*");

        set({ categories: data ?? [] }, false, "getCategories");
      } catch (error) {
        console.error(error);
      }
    },

    getTransactions: async () => {
      try {
        const { data } = await supabase
          .from("transactions")
          .select("*, currency: currency_id (*), transactionType: type_id (*), category: category_id (*)");

        const transactionDatasets =
          data?.map((transaction) => ({
            id: transaction.id,
            status: "done",
            date: transaction.date,
            transactionType: transaction.transactionType,
            category: transaction.category,
            currency: transaction.currency,
            memo: transaction.memo,
            amount: transaction.amount,
          })) ?? [];

        set({ transactionDatasets }, false, "getTransactions");
      } catch (error) {
        console.error(error);
      }
    },

    addTransaction: () => {
      const currencies = get().currencies;
      const transactionTypes = get().transactionTypes;
      const categories = get().categories;
      const transactionDatasets = get().transactionDatasets;

      set(
        {
          transactionDatasets: [
            {
              id: dayjs().unix(),
              status: "new",
              date: dayjs().format("YYYY-MM-DD HH:mm"),
              amount: 0,
              memo: null,

              currencies,
              transactionTypes,
              categories,
            },
            ...transactionDatasets,
          ],
        },
        false,
        "addTransaction",
      );
    },

    changeTransaction: (rowIndex: number, columnName: string, value: number | string) => {
      set(
        (prev) => ({
          transactionDatasets: prev.transactionDatasets.map((data, dataIndex) => {
            if (dataIndex !== rowIndex) return data;

            if (columnName === "transactionType") {
              const transactionType = get().transactionTypes?.find(
                (transactionType) => transactionType.id.toString() === value.toString(),
              );
              const categories = get().categories.filter((category) => category.type_id === transactionType?.id);

              return { ...data, transactionType, category: undefined, categories };
            } else if (columnName === "category") {
              const category = get().categories.find((category) => category.id.toString() === value.toString());

              return { ...data, category };
            } else if (columnName === "currency") {
              const currency = get().currencies.find((currency) => currency.id.toString() === value.toString());

              return { ...data, currency };
            }

            return { ...data, [columnName]: value };
          }),
        }),
        false,
        "changeTransaction",
      );
    },

    createTransaction: async (rowIndex: number) => {
      try {
        const transaction = get().transactionDatasets?.[rowIndex];

        if (!transaction) return;

        if (!transaction.date || !transaction.transactionType || !transaction.category || !transaction.currency) return;

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: newTransaction } = await supabase
          .from("transactions")
          .insert({
            date: transaction.date,
            type_id: transaction.transactionType.id,
            category_id: transaction.category.id,
            currency_id: transaction.currency.id,
            memo: transaction.memo,
            amount: transaction.amount,
          })
          .select("*, currency: currency_id (*), transactionType: type_id (*), category: category_id (*)")
          .maybeSingle();

        if (!newTransaction) return;

        set((prev) => ({
          transactionDatasets: prev.transactionDatasets.map((data, index) => {
            if (rowIndex === index) {
              return {
                id: newTransaction.id,
                status: "done",
                date: newTransaction.date,
                transactionType: newTransaction.transactionType,
                category: newTransaction.category,
                currency: newTransaction.currency,
                memo: newTransaction.memo,
                amount: newTransaction.amount,
              };
            }

            return data;
          }),
        }));
      } catch (error) {
        console.error(error);
      }
    },
  })),
);
