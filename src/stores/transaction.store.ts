import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import dayjs from "dayjs";

import { supabase } from "@/lib/supabase/client";
import { useTransactionOptionStore } from "./transaction-option.store";

interface TransactionStore {
  transactionDatasets: TransactionData[];
  editableTransaction: Record<number, TransactionData>;

  getTransactions: () => Promise<void>;

  addTransaction: () => void;
  deleteTransaction: () => Promise<void>;

  editTransaction: (rowId: number) => void;
  cancelEditTransaction: (rowId: number) => void;
  checkTransaction: (rowId: number, value: boolean) => void;
  changeTransaction: (rowId: number, columnName: string, value: number | string) => void;
  upsertTransaction: (rowId: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>()(
  devtools(
    persist(
      (set, get) => ({
        transactionDatasets: [],
        editableTransaction: {},

        getTransactions: async () => {
          try {
            const { data, error } = await supabase
              .from("transactions")
              .select("*, currency: currency_id (*), transactionType: type_id (*), category: category_id (*)")
              .order("date", { ascending: false });

            if (error) throw error;

            const datasets =
              data?.map((transaction) => ({
                id: transaction.id,
                status: "done",
                checked: false,
                date: transaction.date ? dayjs(transaction.date).format("YYYY-MM-DD HH:mm") : "",
                memo: transaction.memo,
                amount: transaction.amount,

                currency: transaction.currency,
                transactionType: transaction.transactionType,
                category: transaction.category,
              })) ?? [];

            set({ transactionDatasets: datasets }, false, "getTransactions");
          } catch (error) {
            console.error(error);
          }
        },

        addTransaction: () => {
          const currencies = useTransactionOptionStore.getState().currencies;
          const transactionTypes = useTransactionOptionStore.getState().transactionTypes;
          const categories = useTransactionOptionStore.getState().categories;

          const datasets = [
            {
              id: dayjs().unix(),
              status: "new",
              checked: false,
              date: dayjs().format("YYYY-MM-DD HH:mm"),
              amount: 0,
              memo: null,

              currency: undefined,
              transactionType: undefined,
              category: undefined,

              currencies,
              transactionTypes,
              categories,
            },
            ...(get().transactionDatasets ?? []),
          ];

          set({ transactionDatasets: datasets }, false, "addTransaction");
        },
        deleteTransaction: async () => {
          try {
            const datasets = get().transactionDatasets;

            const { filtered, deleteIds } = datasets.reduce<{ filtered: TransactionData[]; deleteIds: number[] }>(
              (acc, cur) => {
                if (cur.status === "new" && cur.checked) return acc;

                if (cur.checked) {
                  acc.deleteIds.push(cur.id);
                } else {
                  acc.filtered.push(cur);
                }

                return acc;
              },
              { filtered: [], deleteIds: [] },
            );

            if (deleteIds.length) {
              await supabase.from("transactions").delete().in("id", deleteIds);
            }

            set({ transactionDatasets: filtered }, false, "deleteTransaction");
          } catch (error) {
            console.error(error);
          }
        },

        editTransaction: (rowId: number) => {
          const currencies = useTransactionOptionStore.getState().currencies;
          const transactionTypes = useTransactionOptionStore.getState().transactionTypes;
          const categories = useTransactionOptionStore.getState().categories;

          const transactionDatasets = get().transactionDatasets;
          const editableTransaction = get().editableTransaction;

          const datasets = transactionDatasets.map((dataset) => {
            if (dataset.id !== rowId) return dataset;

            editableTransaction[dataset.id] = dataset;

            return {
              id: dataset.id,
              status: "edit",
              checked: dataset.checked,
              date: dataset.date,
              amount: dataset.amount,
              memo: dataset.memo,

              currency: dataset.currency,
              transactionType: dataset.transactionType,
              category: dataset.category,

              currencies,
              transactionTypes,
              categories,
            };
          });

          set({ transactionDatasets: datasets, editableTransaction }, false, "editTransaction");
        },
        cancelEditTransaction: (rowId: number) => {
          const transactionDatasets = get().transactionDatasets;

          const targetDataset = transactionDatasets.find((dataset) => dataset.id === rowId);

          if (!targetDataset) return;

          if (targetDataset.status === "new") {
            const filtered = transactionDatasets.filter((dataset) => dataset.id !== rowId);

            set({ transactionDatasets: filtered }, false, "cancelEditTransaction");
          } else {
            const editableTransaction = get().editableTransaction;

            const originDataset = editableTransaction[rowId];

            if (!originDataset) return;

            const datasets = transactionDatasets.map((dataset) => {
              if (dataset.id !== rowId) return dataset;

              delete editableTransaction[rowId];

              return {
                id: originDataset.id,
                status: "done",
                checked: originDataset.checked,
                date: originDataset.date,
                amount: originDataset.amount,
                memo: originDataset.memo,

                currency: originDataset.currency,
                transactionType: originDataset.transactionType,
                category: originDataset.category,
              };
            });

            set({ transactionDatasets: datasets, editableTransaction }, false, "cancelEditTransaction");
          }
        },
        checkTransaction: (rowId: number, value: boolean) => {
          const datasets = get().transactionDatasets.map((dataset) => {
            if (dataset.id !== rowId) return dataset;

            return { ...dataset, checked: value };
          });

          set({ transactionDatasets: datasets }, false, "checkTransaction");
        },
        changeTransaction: (rowId: number, columnName: string, value: number | string) => {
          const currencies = useTransactionOptionStore.getState().currencies;
          const transactionTypes = useTransactionOptionStore.getState().transactionTypes;
          const categories = useTransactionOptionStore.getState().categories;

          const datasets = get().transactionDatasets.map((dataset) => {
            if (dataset.id !== rowId) return dataset;

            if (columnName === "transactionType") {
              const transactionType = transactionTypes?.find((type) => type.id.toString() === value.toString());
              const filteredCategories = categories.filter((category) => category.type_id === transactionType?.id);

              return { ...dataset, transactionType, category: undefined, categories: filteredCategories };
            } else if (columnName === "category") {
              const category = categories.find((category) => category.id.toString() === value.toString());

              return { ...dataset, category };
            } else if (columnName === "currency") {
              const currency = currencies.find((currency) => currency.id.toString() === value.toString());

              return { ...dataset, currency };
            }

            return { ...dataset, [columnName]: value };
          });

          set({ transactionDatasets: datasets }, false, "changeTransaction");
        },
        upsertTransaction: async (rowId: number) => {
          try {
            const transactionDatasets = get().transactionDatasets;

            const dataset = transactionDatasets.find((dataset) => dataset.id === rowId);

            if (!dataset || !dataset.date || !dataset.transactionType || !dataset.category || !dataset.currency) return;

            const { data: newTransaction } = await supabase
              .from("transactions")
              .upsert({
                id: dataset.status === "new" ? undefined : dataset.id,
                date: dataset.date,
                type_id: dataset.transactionType.id,
                category_id: dataset.category.id,
                currency_id: dataset.currency.id,
                memo: dataset.memo,
                amount: dataset.amount,
              })
              .select("*, currency: currency_id (*), transactionType: type_id (*), category: category_id (*)")
              .maybeSingle();

            if (!newTransaction) return;

            const datasets = transactionDatasets.map((dataset) => {
              if (dataset.id !== rowId) return dataset;

              return {
                id: newTransaction.id,
                status: "done",
                checked: false,
                date: newTransaction.date,
                transactionType: newTransaction.transactionType,
                category: newTransaction.category,
                currency: newTransaction.currency,
                memo: newTransaction.memo,
                amount: newTransaction.amount,
              };
            });

            set({ transactionDatasets: datasets }, false, "upsertTransaction");
          } catch (error) {
            console.error(error);
          }
        },
      }),
      {
        name: "transaction-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          transactionDatasets: state.transactionDatasets,
        }),
      },
    ),
  ),
);
