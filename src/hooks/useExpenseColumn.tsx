import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { NumberEditor, SelectEditor, TextEditor } from "@/components";

const columnHelper = createColumnHelper<IExpense>();

export const useExpenseColumn = (expenseTypes: IExpenseType[], category: Record<IExpenseTypes, ICategory[]> | null) => {
  const columns = useMemo(
    () =>
      !expenseTypes.length || !category
        ? []
        : [
            columnHelper.accessor("types", {
              cell: props => (
                <SelectEditor
                  {...props}
                  displayValue={(option?: IGridOption) => option?.name}
                  options={expenseTypes}
                  inputProps={{ value: props.row.original.types?.id }}
                />
              ),
              header: "Type",
              size: 140,
            }),
            columnHelper.accessor("categories", {
              cell: props => (
                <SelectEditor
                  {...props}
                  displayValue={(option?: IGridOption) => option?.name}
                  options={
                    props.row.original.types?.id === 7
                      ? category.incomes
                      : props.row.original.types?.id === 8
                      ? category.expenses
                      : props.row.original.types?.id === 9
                      ? category.savings
                      : props.row.original.types?.id === 10
                      ? category.investments
                      : []
                  }
                  inputProps={{ value: props.row.original.categories?.id }}
                />
              ),
              header: "Category",
              size: 200,
            }),
            columnHelper.accessor("price", {
              cell: props => (
                <NumberEditor {...props} inputProps={{ value: props.row.original.price, textAlign: "right" }} />
              ),
              header: "Price",
              size: 200,
            }),
            columnHelper.accessor("note", {
              cell: props => <TextEditor {...props} inputProps={{ value: props.row.original.note }} />,
              header: "Note",
              size: 300,
            }),
          ],
    [expenseTypes, category]
  );

  return columns;
};
