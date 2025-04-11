type StatisticsMap = {
  [typeId: number]: {
    type: TransactionType;
    summaryMap: {
      [currencyId: number]: {
        currency: Currency;
        totalCount: number;
        totalAmount: number;
      };
    };
    categoryMap: {
      [categoryId: number]: {
        category: Category;
        currencyMap: {
          [currencyId: number]: {
            currency: Currency;
            transaction: {
              count: number;
              amount: number;
            };
          };
        };
      };
    };
  };
};

type Statistics = {
  type: TransactionType;
  summaries: {
    currency: Currency;
    totalCount: number;
    totalAmount: number;
  }[];
  categories: {
    category: Category;
    currencies: {
      currency: Currency;
      summary: {
        totalCount: number;
        totalAmount: number;
      };
      transaction: {
        count: number;
        amount: number;
      };
    }[];
  }[];
}[];

type CalendarMap = Record<number, { type: TransactionType; count: number }>;

type CalendarStatisticsMap = Record<string, CalendarMap>;

type CalendarStatisticsByTypeMap = Record<number, { type: TransactionType; count: number; amount: number }>;

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
  usd_rate: Nullable<number>;

  transactionType?: Nullable<TransactionType>;
  category?: Category;
  currency?: Nullable<Currency>;

  transactionTypes?: TransactionType[];
  categories?: Category[];
  currencies?: Currency[];
}
