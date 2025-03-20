type StatisticsTransaction = {
  amount: number;
  count: number;
};

type StatisticsCategory = {
  category: Category;
  transaction: StatisticsTransaction;
};

type StatisticsType = {
  type: TransactionType;
  category: Record<number, StatisticsCategory>;
};

type Statistics = Record<number, StatisticsType>;

interface TransactionData {
  id: number;
  status: string;
  checked: boolean;
  date: Nullable<string>;
  memo: Nullable<string>;
  amount: number;

  transactionType?: Nullable<TransactionType>;
  category?: Category;
  currency?: Nullable<Currency>;

  transactionTypes?: TransactionType[];
  categories?: Category[];
  currencies?: Currency[];
}
