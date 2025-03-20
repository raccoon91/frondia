import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import dayjs from "dayjs";

import { STORE_NAME } from "@/constants/store";
import { TRANSACTION_STATUS } from "@/constants/status";
import { supabase } from "@/lib/supabase/client";
import { useTransactionOptionStore } from "./transaction-option.store";
import { useLocalStore } from "./local.store";

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
            const selectedTransactionTypeId = useTransactionOptionStore.getState().selectedTransactionTypeId;
            const selectedCategoryId = useTransactionOptionStore.getState().selectedCategoryId;
            const selectedCurrencyId = useTransactionOptionStore.getState().selectedCurrencyId;

            let builder = supabase
              .from("transactions")
              .select("*, currency: currency_id (*), transactionType: type_id (*), category: category_id (*)");

            if (selectedTransactionTypeId) {
              builder = builder.eq("type_id", Number(selectedTransactionTypeId));
            }

            if (selectedCategoryId) {
              builder = builder.eq("category_id", Number(selectedCategoryId));
            }

            if (selectedCurrencyId) {
              builder = builder.eq("currency_id", Number(selectedCurrencyId));
            }

            const { data, error } = await builder.order("date", { ascending: false });

            if (error) throw error;

            const datasets =
              data?.map((transaction) => ({
                id: transaction.id,
                status: TRANSACTION_STATUS.DONE,
                checked: false,
                date: transaction.date ? dayjs(transaction.date).format("YYYY-MM-DD HH:mm") : "",
                memo: transaction.memo,
                amount: transaction.amount,

                transactionType: transaction.transactionType,
                category: transaction.category,
                currency: transaction.currency,
              })) ?? [];

            set({ transactionDatasets: datasets }, false, "getTransactions");
          } catch (error) {
            console.error(error);
          }
        },

        addTransaction: () => {
          const currencies = useTransactionOptionStore.getState().currencies;
          const transactionTypes = useTransactionOptionStore.getState().transactionTypes;
          let categories = useTransactionOptionStore.getState().categories;

          const localTransactionType = useLocalStore.getState().localTransactionType;
          const localCurrency = useLocalStore.getState().localCurrency;

          if (localTransactionType) {
            categories = categories.filter((category) => category.type_id === localTransactionType.id);
          }

          const datasets = [
            {
              id: dayjs().valueOf(),
              status: TRANSACTION_STATUS.NEW,
              checked: false,
              date: dayjs().format("YYYY-MM-DD HH:mm"),
              amount: 0,
              memo: null,

              transactionType: localTransactionType,
              category: undefined,
              currency: localCurrency,

              transactionTypes,
              categories,
              currencies,
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
                if (cur.status === TRANSACTION_STATUS.NEW && cur.checked) return acc;

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
              status: TRANSACTION_STATUS.EDIT,
              checked: dataset.checked,
              date: dataset.date,
              amount: dataset.amount,
              memo: dataset.memo,

              transactionType: dataset.transactionType,
              category: dataset.category,
              currency: dataset.currency,

              transactionTypes,
              categories,
              currencies,
            };
          });

          set({ transactionDatasets: datasets, editableTransaction }, false, "editTransaction");
        },
        cancelEditTransaction: (rowId: number) => {
          const transactionDatasets = get().transactionDatasets;

          const targetDataset = transactionDatasets.find((dataset) => dataset.id === rowId);

          if (!targetDataset) return;

          if (targetDataset.status === TRANSACTION_STATUS.NEW) {
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
                status: TRANSACTION_STATUS.DONE,
                checked: originDataset.checked,
                date: originDataset.date,
                amount: originDataset.amount,
                memo: originDataset.memo,

                transactionType: originDataset.transactionType,
                category: originDataset.category,
                currency: originDataset.currency,
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
                id: dataset.status === TRANSACTION_STATUS.NEW ? undefined : dataset.id,
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

            useLocalStore.getState().setLocalStore({
              localTransactionType: newTransaction.transactionType,
              localCurrency: newTransaction.currency,
            });

            const datasets = transactionDatasets.map((dataset) => {
              if (dataset.id !== rowId) return dataset;

              return {
                id: newTransaction.id,
                status: TRANSACTION_STATUS.DONE,
                checked: false,
                date: dayjs(newTransaction.date).format("YYYY-MM-DD HH:mm"),
                memo: newTransaction.memo,
                amount: newTransaction.amount,

                transactionType: newTransaction.transactionType,
                category: newTransaction.category,
                currency: newTransaction.currency,
              };
            });

            set({ transactionDatasets: datasets }, false, "upsertTransaction");
          } catch (error) {
            console.error(error);
          }
        },
      }),
      {
        name: STORE_NAME.TRANSACTION,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          transactionDatasets: state.transactionDatasets,
        }),
      },
    ),
  ),
);
