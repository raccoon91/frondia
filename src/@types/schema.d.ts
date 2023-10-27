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
  id: number | null;
  user_id?: string;
  type_id: number | null;
  category_id: number | null;
  types?: IExpenseType;
  categories?: ICategory;
  price: number | string;
  note?: string | null;
}
