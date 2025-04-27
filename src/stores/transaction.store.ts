import dayjs from "dayjs";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { STORE_NAME } from "@/constants/store";
import { TRANSACTION_STATUS } from "@/constants/transaction";
import { supabase } from "@/lib/supabase/client";
import { useLocalStore } from "./common/local.store";
import { useSessionStore } from "./common/session.store";
import { useCurrencyRateStore } from "./currency-rate.store";
import { useTransactionOptionStore } from "./transaction-option.store";

interface TransactionStore {
  isLoading: boolean;

  transactionDatasets: TransactionData[];
  editableTransaction: Record<number, TransactionData>;

  getTransactions: () => Promise<void>;

  movePrevMonth: (date: string) => void;
  moveNextMonth: (date: string) => void;

  addTransaction: () => void;
  saveAllTransaction: () => Promise<void>;
  cancelAllTransaction: () => void;
  deleteTransaction: () => Promise<void>;
  macroTransaction: (macro: Macro) => void;

  editTransaction: (rowId: number) => void;
  cancelEditTransaction: (rowId: number) => void;
  checkTransaction: (rowId: number, value: boolean) => void;
  changeTransaction: (rowId: number, columnName: string, value: number | string) => void;
  saveTransaction: (rowId: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>()(
  devtools(
    persist(
      (set, get) => ({
        isLoading: false,

        transactionDatasets: [],
        editableTransaction: {},

        getTransactions: async () => {
          try {
            set({ isLoading: true }, false, "getTransactions");

            const sessionDate = useSessionStore.getState().sessionDate;

            const selectedTransactionTypeId = useTransactionOptionStore.getState().selectedTransactionTypeId;
            const selectedCategoryId = useTransactionOptionStore.getState().selectedCategoryId;
            const selectedCurrencyId = useTransactionOptionStore.getState().selectedCurrencyId;

            const startOfMonth = dayjs(sessionDate).startOf("month").format("YYYY-MM-DD HH:mm");
            const endOfMonth = dayjs(sessionDate).endOf("month").format("YYYY-MM-DD HH:mm");

            let builder = supabase.from("transactions").select(
              `
                *,
                currency: currency_id (*),
                transactionType: type_id (*),
                category: category_id (*)
              `,
            );

            if (selectedTransactionTypeId) {
              builder = builder.eq("type_id", Number(selectedTransactionTypeId));
            }

            if (selectedCategoryId) {
              builder = builder.eq("category_id", Number(selectedCategoryId));
            }

            if (selectedCurrencyId) {
              builder = builder.eq("currency_id", Number(selectedCurrencyId));
            }

            const { data, error } = await builder
              .gte("date", startOfMonth)
              .lte("date", endOfMonth)
              .order("date", { ascending: false })
              .order("created_at", { ascending: true });

            if (error) throw error;

            const datasets =
              data?.map((transaction) => ({
                id: transaction.id,
                status: TRANSACTION_STATUS.DONE,
                checked: false,
                date: transaction.date ? dayjs(transaction.date).format("YYYY-MM-DD HH:mm") : "",
                memo: transaction.memo,
                amount: transaction.amount,
                usd_rate: transaction.usd_rate,

                transactionType: transaction.transactionType,
                category: transaction.category,
                currency: transaction.currency,
              })) ?? [];

            set({ isLoading: false, transactionDatasets: datasets }, false, "getTransactions");
          } catch (error) {
            console.error(error);

            set({ isLoading: false }, false, "getTransactions");
          }
        },

        movePrevMonth: (date: string) => {
          useSessionStore.getState().setSessionDate(dayjs(date).subtract(1, "month").format("YYYY-MM"));
        },
        moveNextMonth: (date: string) => {
          useSessionStore.getState().setSessionDate(dayjs(date).add(1, "month").format("YYYY-MM"));
        },

        addTransaction: () => {
          const currencies = useTransactionOptionStore.getState().currencies;
          const transactionTypes = useTransactionOptionStore.getState().transactionTypes;
          let categories = useTransactionOptionStore.getState().categories;

          const localTransactionType = useLocalStore.getState().localTransactionType;
          const localCurrency = useLocalStore.getState().localCurrency;

          const transactionDatasets = get().transactionDatasets;
          const editableTransaction = get().editableTransaction;

          if (localTransactionType) {
            categories = categories.filter((category) => category.type_id === localTransactionType.id);
          }

          const newTransaction: TransactionData = {
            id: dayjs().valueOf(),
            status: TRANSACTION_STATUS.NEW,
            checked: false,
            date: dayjs().format("YYYY-MM-DD HH:mm:00"),
            amount: 0,
            memo: null,
            usd_rate: 0,

            transactionType: localTransactionType,
            category: undefined,
            currency: localCurrency,

            transactionTypes,
            categories,
            currencies,
          };

          editableTransaction[newTransaction.id] = newTransaction;

          const datasets = [newTransaction].concat(transactionDatasets);

          set({ transactionDatasets: datasets, editableTransaction }, false, "addTransaction");
        },
        saveAllTransaction: async () => {
          try {
            set({ isLoading: true }, false, "saveAllTransaction");

            const transactionDatasets = get().transactionDatasets;
            const editableTransaction = get().editableTransaction;

            const inserts: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">[] = [];
            const upserts: Omit<Transaction, "user_id" | "created_at" | "updated_at">[] = [];

            for (const dataset of transactionDatasets) {
              if (!editableTransaction[dataset.id]) continue;
              if (!dataset.date || !dataset.transactionType || !dataset.category || !dataset.currency) continue;

              const currencyRate = await useCurrencyRateStore
                .getState()
                .getCurrencyRate(dataset.date, dataset.currency);

              if (dataset.status === TRANSACTION_STATUS.NEW) {
                inserts.push({
                  date: dataset.date,
                  type_id: dataset.transactionType.id,
                  category_id: dataset.category.id,
                  currency_id: dataset.currency.id,
                  memo: dataset.memo,
                  amount: dataset.amount,
                  usd_rate: currencyRate?.rate?.usd,
                });
              } else if (dataset.status === TRANSACTION_STATUS.EDIT) {
                upserts.push({
                  id: dataset.id,
                  date: dataset.date,
                  type_id: dataset.transactionType.id,
                  category_id: dataset.category.id,
                  currency_id: dataset.currency.id,
                  memo: dataset.memo,
                  amount: dataset.amount,
                  usd_rate: currencyRate?.rate?.usd,
                });
              }

              delete editableTransaction[dataset.id];
            }

            const { error: insertError } = await supabase.from("transactions").insert(inserts);

            const { error: upsertError } = await supabase.from("transactions").upsert(upserts);

            if (insertError) throw insertError;

            if (upsertError) throw upsertError;

            set({ editableTransaction }, false, "saveAllTransaction");

            get().getTransactions();
          } catch (error) {
            console.error(error);

            set({ isLoading: false }, false, "saveAllTransaction");
          }
        },
        cancelAllTransaction: () => {
          const transactionDatasets = get().transactionDatasets;
          const editableTransaction = get().editableTransaction;

          const datasets = transactionDatasets.reduce<TransactionData[]>((datasets, dataset) => {
            if (dataset.status === TRANSACTION_STATUS.NEW) return datasets;

            if (dataset.status === TRANSACTION_STATUS.EDIT) {
              const originDataset = editableTransaction[dataset.id];

              if (!originDataset) return datasets;

              datasets.push({
                id: originDataset.id,
                status: TRANSACTION_STATUS.DONE,
                checked: originDataset.checked,
                date: originDataset.date,
                amount: originDataset.amount,
                memo: originDataset.memo,
                usd_rate: originDataset.usd_rate,

                transactionType: originDataset.transactionType,
                category: originDataset.category,
                currency: originDataset.currency,
              });

              delete editableTransaction[dataset.id];
            } else {
              datasets.push(dataset);
            }

            return datasets;
          }, []);

          set({ transactionDatasets: datasets, editableTransaction }, false, "cancelAllTransaction");
        },
        deleteTransaction: async () => {
          try {
            const datasets = get().transactionDatasets;

            const { filtered, deleteIds } = datasets.reduce<{ filtered: TransactionData[]; deleteIds: number[] }>(
              (acc, dataset) => {
                if (dataset.status === TRANSACTION_STATUS.NEW && dataset.checked) return acc;

                if (dataset.checked) {
                  acc.deleteIds.push(dataset.id);
                } else {
                  acc.filtered.push(dataset);
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
        macroTransaction: (macro: Macro) => {
          const currencies = useTransactionOptionStore.getState().currencies;
          const transactionTypes = useTransactionOptionStore.getState().transactionTypes;
          let categories = useTransactionOptionStore.getState().categories;

          const transactionType = transactionTypes.find((type) => type.id === macro.type_id);
          const category = categories.find((category) => category.id === macro.category_id);
          const currency = currencies.find((currency) => currency.id === macro.currency_id);

          const transactionDatasets = get().transactionDatasets;
          const editableTransaction = get().editableTransaction;

          if (transactionType) {
            categories = categories.filter((category) => category.type_id === transactionType.id);
          }

          let date = dayjs();

          if (macro.day !== null) date = date.set("date", macro.day);
          if (macro.hour !== null) date = date.set("hour", macro.hour);
          if (macro.minute !== null) date = date.set("minute", macro.minute);

          const newTransaction: TransactionData = {
            id: dayjs().valueOf(),
            status: TRANSACTION_STATUS.NEW,
            checked: false,
            date: date.format("YYYY-MM-DD HH:mm:00"),
            amount: macro.amount ?? 0,
            memo: macro.memo,
            usd_rate: 0,

            transactionType,
            category,
            currency,

            transactionTypes,
            categories,
            currencies,
          };

          editableTransaction[newTransaction.id] = newTransaction;

          const datasets = [newTransaction].concat(transactionDatasets);

          set({ transactionDatasets: datasets }, false, "macroTransaction");
        },

        editTransaction: (rowId: number) => {
          const currencies = useTransactionOptionStore.getState().currencies;
          const transactionTypes = useTransactionOptionStore.getState().transactionTypes;
          let categories = useTransactionOptionStore.getState().categories;

          const transactionDatasets = get().transactionDatasets;
          const editableTransaction = get().editableTransaction;

          const datasets = transactionDatasets.map((dataset) => {
            if (dataset.id !== rowId) return dataset;

            editableTransaction[dataset.id] = dataset;

            if (dataset.transactionType?.id) {
              categories = categories.filter((category) => category.type_id === dataset.transactionType?.id);
            }

            return {
              id: dataset.id,
              status: TRANSACTION_STATUS.EDIT,
              checked: dataset.checked,
              date: dataset.date,
              amount: dataset.amount,
              memo: dataset.memo,
              usd_rate: dataset.usd_rate,

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
          const editableTransaction = get().editableTransaction;

          const targetDataset = transactionDatasets.find((dataset) => dataset.id === rowId);

          if (!targetDataset) return;

          if (targetDataset.status === TRANSACTION_STATUS.NEW) {
            const filtered = transactionDatasets.filter((dataset) => dataset.id !== rowId);

            delete editableTransaction[rowId];

            set({ transactionDatasets: filtered, editableTransaction }, false, "cancelEditTransaction");
          } else if (targetDataset.status === TRANSACTION_STATUS.EDIT) {
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
                usd_rate: originDataset.usd_rate,

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
              const transactionType = transactionTypes?.find((type) => type.id.toString() === value.toString()) ?? null;
              const filteredCategories = categories.filter((category) => category.type_id === transactionType?.id);

              dataset.transactionType = transactionType;
              dataset.category = undefined;
              dataset.categories = filteredCategories;

              useLocalStore.getState().setTransactionOption(transactionType);
            } else if (columnName === "category") {
              const category = categories?.find((category) => category.id.toString() === value.toString()) ?? null;

              dataset.category = category;
            } else if (columnName === "currency") {
              const currency = currencies?.find((currency) => currency.id.toString() === value.toString()) ?? null;

              dataset.currency = currency;

              useLocalStore.getState().setCurrencyOption(currency);
            } else {
              dataset = { ...dataset, [columnName]: value };
            }

            return dataset;
          });

          set({ transactionDatasets: datasets }, false, "changeTransaction");
        },
        saveTransaction: async (rowId: number) => {
          try {
            set({ isLoading: true }, false, "saveTransaction");

            const transactionDatasets = get().transactionDatasets;
            const editableTransaction = get().editableTransaction;

            const dataset = transactionDatasets.find((dataset) => dataset.id === rowId);

            if (!dataset || !dataset.date || !dataset.transactionType || !dataset.category || !dataset.currency) return;

            const currencyRate = await useCurrencyRateStore.getState().getCurrencyRate(dataset.date, dataset.currency);

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
                usd_rate: currencyRate?.rate?.usd,
              })
              .select(
                `
                  *,
                  currency: currency_id (*),
                  transactionType: type_id (*),
                  category: category_id (*)
                `,
              )
              .maybeSingle();

            if (!newTransaction) return;

            delete editableTransaction[rowId];

            const datasets = transactionDatasets.map((dataset) => {
              if (dataset.id !== rowId) return dataset;

              return {
                id: newTransaction.id,
                status: TRANSACTION_STATUS.DONE,
                checked: false,
                date: dayjs(newTransaction.date).format("YYYY-MM-DD HH:mm"),
                memo: newTransaction.memo,
                amount: newTransaction.amount,
                usd_rate: newTransaction.usd_rate,

                transactionType: newTransaction.transactionType,
                category: newTransaction.category,
                currency: newTransaction.currency,
              };
            });

            set({ isLoading: false, transactionDatasets: datasets, editableTransaction }, false, "saveTransaction");
          } catch (error) {
            console.error(error);

            set({ isLoading: false }, false, "saveTransaction");
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
