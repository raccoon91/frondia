type StatisticsType = {
  type: TransactionType;
  totalAmount: number;
  totalCount: number;
  category: Record<number, StatisticsCategory>;
};

type StatisticsCategory = {
  category: Category;
  transaction: StatisticsTransaction;
};

type StatisticsTransaction = {
  amount: number;
  count: number;
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
