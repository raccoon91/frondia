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
  transactionType?: TransactionType;
  category?: Category;
  currency?: Currency;
  memo: Nullable<string>;
  amount: number;

  transactionTypes?: TransactionType[];
  categories?: Category[];
  currencies?: Currency[];
}
