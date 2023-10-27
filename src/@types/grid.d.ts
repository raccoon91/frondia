type IGridData = {
  id: number | null;
  type: IExpenseType | null;
  category: ICategory | null;
  price: string | null;
  note: string | null;
  count: number | null;
};

type IGridText = string | number | null | undefined;

type IGridOption = {
  id: number;
  [key: string]: any;
};

type IEditorProps = { value: IGridText } & Omit<InputProps, "value" | "display">;

type IEditorDisplayValueFunc = (option?: IGridOption) => string | undefined;
