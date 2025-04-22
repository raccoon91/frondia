interface CurrencyRate {
  id?: number;
  date: string;
  code: string;
  rate: Record<string, number>;
}
