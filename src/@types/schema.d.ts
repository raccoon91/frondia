interface IExpenseType {
  id: number;
  name: string;
  type: string;
}

interface IExpense {
  id: number;
  user_id: string;
  category_id: number;
  type_id: number;
  price: number;
  count?: number | null;
  note?: string | null;
}

interface ICategory {
  id: number;
  type: string;
  name: string;
}
