interface IExpenseType {
  id: number;
  name: string;
  type: string;
}

interface ICategory {
  id: number;
  type: string;
  name: string;
}

interface IExpense {
  id: number;
  user_id: string;
  category_id: number;
  type_id: number;
  expense_types?: IExpenseType;
  categories?: ICategory;
  price: number;
  count?: number | null;
  note?: string | null;
}
