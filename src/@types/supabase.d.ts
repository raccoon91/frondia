interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  created_at: string;
}

interface TransactionType {
  id: number;
  user_id: string;
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
