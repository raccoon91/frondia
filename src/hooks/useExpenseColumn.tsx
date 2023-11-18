import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Header, NumberEditor, SelectEditor, TextEditor } from "@/components";
import { Center, Checkbox } from "@chakra-ui/react";

const columnHelper = createColumnHelper<IExpense>();

export const useExpenseColumn = (expenseTypes: IExpenseType[], category: Record<IExpenseTypes, ICategory[]> | null) => {
  const columns = useMemo(
    () =>
      !expenseTypes.length || !category
        ? []
        : [
            columnHelper.accessor("types", {
              id: "select",
              cell: ({ row }) => (
                <Center w="40px" h="40px">
                  <Checkbox
                    size="lg"
                    bgColor="surface"
                    isChecked={row.getIsSelected()}
                    isDisabled={!row.getCanSelect()}
                    isIndeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                </Center>
              ),
              header: ({ table }) => (
                <Center w="40px" h="40px">
                  <Checkbox
                    size="lg"
                    bgColor="surface"
                    isChecked={table.getIsAllRowsSelected()}
                    isIndeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                </Center>
              ),
              size: 40,
            }),
            columnHelper.accessor("types", {
              cell: props => (
                <SelectEditor
                  {...props}
                  displayValue={(option?: IGridOption) => option?.name}
                  options={expenseTypes}
                  inputProps={{ value: props.row.original.types?.id }}
                />
              ),
              header: () => <Header name="Type" />,
              size: 140,
            }),
            columnHelper.accessor("categories", {
              cell: props => {
                const type = expenseTypes.find(expenseType => expenseType.type === props.row.original.types?.type)
                  ?.type;
                const options = type ? category?.[type] ?? [] : [];

                return (
                  <SelectEditor
                    {...props}
                    displayValue={(option?: IGridOption) => option?.name}
                    options={options}
                    inputProps={{ value: props.row.original.categories?.id }}
                  />
                );
              },
              header: () => <Header name="Category" />,
              size: 160,
            }),
            columnHelper.accessor("price", {
              cell: props => (
                <NumberEditor {...props} inputProps={{ value: props.row.original.price, textAlign: "right" }} />
              ),
              header: () => <Header name="Price" />,
              size: 200,
            }),
            columnHelper.accessor("note", {
              cell: props => <TextEditor {...props} inputProps={{ value: props.row.original.note }} />,
              header: () => <Header name="Note" />,
              size: 300,
            }),
          ],
    [expenseTypes, category]
  );

  return columns;
};
