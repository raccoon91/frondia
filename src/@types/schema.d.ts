interface IExpenseType {
  id: number;
  name: string;
  type: string;
}

interface ICategory {
  id: number;
  user_id: string;
  category_id: number;
  type_id: number;
  price: number;
  count?: number | null;
  note?: string | null;
}
