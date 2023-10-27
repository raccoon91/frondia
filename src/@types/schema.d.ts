interface IExpenseType {
  id: number;
  name: string;
  type: string;
}

interface ICategory {
  id: number;
  type_id: number;
  types?: IExpenseType;
  name: string;
}

interface IExpense {
  id: number;
  user_id: string;
  type_id: number;
  category_id: number;
  types?: IExpenseType;
  categories?: ICategory;
  price: number;
  note?: string | null;
}
