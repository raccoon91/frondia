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
