import { TRANSACTION_STATUS } from "@/constants/transaction";
import { supabase } from "@/lib/supabase/client";
import { currencyAPI } from "./currency.api";

export const transactionAPI = {
  gets: async ({
    start,
    end,
  }: {
    start: Nullish<string>;
    end: Nullish<string>;
  }) => {
    let builder = supabase.from("transactions").select("*");

    if (start) builder = builder.gte("date", start);
    if (end) builder = builder.lte("date", end);

    const { data, error } = await builder.order("date", { ascending: false }).order("created_at", { ascending: true });

    if (error) throw error;

    return data;
  },

  getsWithJoin: async ({
    typeId,
    categoryId,
    currencyId,
    start,
    end,
  }: {
    typeId: Nullish<string>;
    categoryId: Nullish<string>;
    currencyId: Nullish<string>;
    start: Nullish<string>;
    end: Nullish<string>;
  }) => {
    let builder = supabase
      .from("transactions")
      .select("*, currency: currency_id (*), transactionType: type_id (*), category: category_id (*)");

    if (typeId) builder = builder.eq("type_id", Number(typeId));
    if (categoryId) builder = builder.eq("category_id", Number(categoryId));
    if (currencyId) builder = builder.eq("currency_id", Number(currencyId));
    if (start) builder = builder.gte("date", start);
    if (end) builder = builder.lte("date", end);

    const { data, error } = await builder.order("date", { ascending: false }).order("created_at", { ascending: true });

    if (error) throw error;

    return data;
  },

  upsert: async (dataset?: TransactionData) => {
    if (!dataset || !dataset.date || !dataset.transactionType || !dataset.category || !dataset.currency) return null;

    const currencyRate = await currencyAPI.rate({
      date: dataset.date,
      code: dataset.currency.code.toLocaleLowerCase(),
    });

    if (currencyRate === null) return null;

    const { data, error } = await supabase
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
      .select("*, currency: currency_id (*), transactionType: type_id (*), category: category_id (*)")
      .maybeSingle();

    if (error) throw error;

    return data;
  },

  bulkCreate: async (datasets: TransactionData[]) => {
    const body: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">[] = [];

    for (const dataset of datasets) {
      if (!dataset.date || !dataset.transactionType || !dataset.category || !dataset.currency) continue;

      const currencyRate = await currencyAPI.rate({
        date: dataset.date,
        code: dataset.currency.code.toLocaleLowerCase(),
      });

      if (currencyRate === null) continue;

      body.push({
        date: dataset.date,
        type_id: dataset.transactionType.id,
        category_id: dataset.category.id,
        currency_id: dataset.currency.id,
        memo: dataset.memo,
        amount: dataset.amount,
        usd_rate: currencyRate?.rate?.usd,
      });
    }

    if (!body.length) return null;

    const { data, error } = await supabase.from("transactions").insert(body);

    if (error) throw error;

    return data;
  },

  bulkUpdate: async (datasets: TransactionData[]) => {
    const body: Omit<Transaction, "user_id" | "created_at" | "updated_at">[] = [];

    for (const dataset of datasets) {
      if (!dataset.date || !dataset.transactionType || !dataset.category || !dataset.currency) continue;

      const currencyRate = await currencyAPI.rate({
        date: dataset.date,
        code: dataset.currency.code.toLocaleLowerCase(),
      });

      if (currencyRate === null) continue;

      body.push({
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

    if (!body.length) return null;

    const { data, error } = await supabase.from("transactions").upsert(body);

    if (error) throw error;

    return data;
  },

  bulkDelete: async (transactions: TransactionData[]) => {
    const body = transactions.map((transaction) => transaction.id);

    if (!body.length) return null;

    const { data, error } = await supabase.from("transactions").delete().in("id", body);

    if (error) throw error;

    return data;
  },
};
