import { create } from "zustand";
import { devtools } from "zustand/middleware";
import dayjs from "dayjs";

import { dexie } from "@/lib/dexie";

interface CurrencyRateStore {
  getCurrencyRate: (date: string, currency: Currency) => Promise<CurrencyRate>;
}

export const useCurrencyRateStore = create<CurrencyRateStore>()(
  devtools(() => ({
    getCurrencyRate: async (date: string, currency: Currency) => {
      try {
        if (!date || !currency.code) return;

        const formatedDate = dayjs(date).format("YYYY-MM-DD");
        const code = currency.code.toLocaleLowerCase();

        let currencyRate = await dexie.currencies.where("[date+code]").equals([formatedDate, code]).first();

        if (!currencyRate) {
          const res = await fetch(
            `${import.meta.env.VITE_CURRENCY_RATE_URL}@${formatedDate}/v1/currencies/${code}.json`,
          );

          const data = await res.json();

          const rate = data[code];

          currencyRate = { date: formatedDate, code, rate };

          await dexie.currencies.put(currencyRate);
        }

        return currencyRate;
      } catch (error) {
        console.error(error);
      }
    },
  })),
);
