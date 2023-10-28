export const createEmptyExpense = (type?: IExpenseType): IExpense => {
  return {
    id: null,
    type_id: type?.id ?? null,
    types: type,
    category_id: null,
    price: null,
    note: "",
  };
};
