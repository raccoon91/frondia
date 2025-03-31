interface Profile {
  id: number;
  name: string | null;
  user_id: string;
  created_at: string;
}

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  created_at: string;
}

interface TransactionType {
  id: number;
  name: string;
  created_at: string;
  order: Nullable<number>;
}

interface Category {
  id: number;
  user_id: string;
  type_id: number;
  name: string;
  created_at: string;
  order: Nullable<number>;
}

interface Transaction {
  id: number;
  user_id: string;
  currency_id: number;
  type_id: number;
  category_id: number;
  amount: number;
  date: Nullable<string>;
  memo: Nullable<string>;
  created_at: string;
  updated_at: string;

  currency?: Currency;
  transactionType?: TransactionType;
  category?: Category;
}

interface Macro {
  id: number;
  user_id: string;
  name: string;
  type_id: Nullable<number>;
  category_id: Nullable<number>;
  amount: Nullable<number>;
  currency_id: Nullable<number>;
  memo: Nullable<string>;
  created_at: string;
  day: Nullable<number>;
  hour: Nullable<number>;
  minute: Nullable<number>;
  active: boolean;
}

interface Goal {
  id: number;
  user_id: string;
  name: string;
  type_id: number;
  currency_id: number;
  amount: number;
  rule: string;
  period: number;
  start: string;
  end: string;
  status: string;
  date_unit: string;
  created_at: string;

  currency?: Currency;
  type?: TransactionType;
  map?: { id: number; category: Category }[];
}
