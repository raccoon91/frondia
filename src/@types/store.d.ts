interface StatisticsTransaction {
  amount: number;
  count: number;
}

interface StatisticsCategory {
  category: Category;
  transaction: StatisticsTransaction;
}

interface StatisticsType {
  type: TransactionType;
  totalAmount: number;
  totalCount: number;
  categoryMap?: Record<number, StatisticsCategory>;
  categories?: StatisticsCategory[];
}

type StatisticsMap = Record<number, StatisticsType>;

type Statistics = StatisticsType[];

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

  transactionType?: Nullable<TransactionType>;
  category?: Category;
  currency?: Nullable<Currency>;

  transactionTypes?: TransactionType[];
  categories?: Category[];
  currencies?: Currency[];
}
