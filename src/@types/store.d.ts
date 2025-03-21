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

interface CalendarTypePosition {
  name: string;
  color: string;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

type CalendarMap = Record<number, { type: TransactionType; position: CalendarTypePosition; count: number }>;

type CalendarStatisticsMap = Record<string, CalendarMap>;

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
