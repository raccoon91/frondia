type StatisticsSummary = {
  currency: Currency;
  totalCount: number;
  totalAmount: number;
};

type StatisticsCurrency = {
  currency: Currency;
  transaction: StatisticsTransaction;
};

type StatisticsTransaction = {
  usd: number;
  count: number;
  amount: number;
};

type StatisticsMap = {
  [typeId: number]: {
    type: TransactionType;
    totalUsd: number;
    totalSummaryMap: {
      [currencyId: number]: StatisticsSummary;
    };
    categoryMap: {
      [categoryId: number]: {
        category: Category;
        currencyMap: {
          [currencyId: number]: StatisticsCurrency;
        };
      };
    };
  };
};

type Statistics = {
  type: TransactionType;
  totalUsd: number;
  totalSummaries: StatisticsSummary[];
  categories: {
    category: Category;
    currencies: StatisticsCurrency[];
  }[];
}[];

type CalendarMap = Record<number, { type: TransactionType; count: number; amount: number }>;

type CalendarStatisticsMap = Record<string, CalendarMap>;

type CalendarCountByTypeMap = Record<number, { type: TransactionType; count: number }>;

interface GoalInProgress {
  id: number;
  name: string;
  rule?: GoalRule;
  result: "success" | "failure";
  value: number;
  remain: number;
}

interface TransactionData {
  id: number;
  status: string;
  checked: boolean;
  date: Nullable<string>;
  memo: Nullable<string>;
  amount: number;
  usd_rate: number;

  transactionType?: Nullable<TransactionType>;
  category?: Nullable<Category>;
  currency?: Nullable<Currency>;

  transactionTypes?: TransactionType[];
  categories?: Category[];
  currencies?: Currency[];
}
