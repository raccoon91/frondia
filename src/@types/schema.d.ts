type IExpenseTypes = "incomes" | "expenses" | "savings" | "investments";

interface IExpenseType {
  id: number;
  name: string;
  type: IExpenseTypes;
}

interface ICategory {
  id: number;
  type_id: number;
  types?: IExpenseType;
  name: string;
}

interface IExpense {
  id?: number | null;
  user_id?: string;
  type_id: number | null;
  category_id: number | null;
  types?: IExpenseType;
  categories?: ICategory;
  price: number;
  note?: string | null;
  date: string;
}
