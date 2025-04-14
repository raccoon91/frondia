import Dexie, { EntityTable } from "dexie";

const dexie = new Dexie("currency_rate") as Dexie & {
  currencies: EntityTable<CurrencyRate, "id">;
};

dexie.version(1).stores({
  currencies: "[date+code]",
});

export { dexie };
