import dayjs from "dayjs";

import { dexie } from "@/lib/dexie";
import { supabase } from "@/lib/supabase/client";

export const currencyAPI = {
  gets: async () => {
    const { data, error } = await supabase.from("currencies").select("*");

    if (error) throw error;

    return data;
  },

  rate: async ({ date, code }: { date: string; code: string }) => {
    if (!date || !code) return null;

    const formatedDate = dayjs(date).format("YYYY-MM-DD");

    let currencyRate = await dexie.currencies.where("[date+code]").equals([formatedDate, code]).first();

    if (!currencyRate) {
      const res = await fetch(`${import.meta.env.VITE_CURRENCY_RATE_URL}@${formatedDate}/v1/currencies/${code}.json`);

      const data = await res.json();

      const rate = data[code];

      currencyRate = { date: formatedDate, code, rate };

      await dexie.currencies.put(currencyRate);
    }

    return currencyRate;
  },
};
