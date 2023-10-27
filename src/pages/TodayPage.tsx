import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { RowData, createColumnHelper } from "@tanstack/react-table";
import { Box, Button, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCategoryStore, useExpenseStore, useExpenseTypeStore } from "../stores";
import { DataGrid, SelectEditor, TextEditor, UnEditable } from "../components";

const columnHelper = createColumnHelper<IExpense>();

export const TodayPage = () => {
  const { expenseTypes } = useExpenseTypeStore(state => ({ expenseTypes: state.expenseTypes }));
  const { categories } = useCategoryStore(state => ({ categories: state.categories }));
  const { expenses, getExpenses, setExpenses } = useExpenseStore(state => ({
    expenses: state.expenses,
    getExpenses: state.getExpenses,
    setExpenses: state.setExpenses,
  }));

  const columns = useMemo(
    () => [
      columnHelper.accessor("expense_types", {
        cell: props => (
          <SelectEditor
            {...props}
            displayValue={(option?: IGridOption) => option?.name}
            options={expenseTypes}
            inputProps={{ value: props.row.original.expense_types?.id }}
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
            options={categories}
            inputProps={{ value: props.row.original.categories?.id }}
          />
        ),
        header: "Category",
        size: 160,
      }),
      columnHelper.accessor("price", {
        cell: props => <TextEditor {...props} inputProps={{ value: props.row.original.price, textAlign: "right" }} />,
        header: "Price",
        size: 200,
      }),
      columnHelper.accessor("count", {
        cell: props =>
          props.row.original.expense_types?.type !== "investment" ? (
            <UnEditable {...props} />
          ) : (
            <TextEditor {...props} inputProps={{ value: props.row.original.count, textAlign: "right" }} />
          ),
        header: "Count",
        size: 140,
      }),
      columnHelper.accessor("note", {
        cell: props => <TextEditor {...props} inputProps={{ value: props.row.original.note }} />,
        header: "Note",
        size: 300,
      }),
    ],
    [expenseTypes, categories]
  );

  useEffect(() => {
    getExpenses();
  }, []);

  const handleChangeRowData = (rowIndex: number, columnId: string, value: RowData) => {
    const newExpense = expenses.map((column, index) => {
      if (index === rowIndex) {
        return { ...column, [columnId]: value };
      }

      return column;
    });

    setExpenses(newExpense);
  };

  return (
    <Flex direction="column" w="full" h="full" p="50px">
      <Flex justify="space-between">
        <Flex align="center" gap="16px">
          <IconButton aria-label="previous day" variant="ghost" icon={<Icon as={FaChevronLeft} />} />
          <Text fontSize="20px" fontWeight="bold">
            {dayjs().format("YYYY-MM-DD")}
          </Text>
          <IconButton aria-label="next day" variant="ghost" icon={<Icon as={FaChevronRight} />} />
        </Flex>

        <Flex gap="8px">
          <Button>💰 수입</Button>
          <Button>💵 지출</Button>
          <Button colorScheme="green">💾 저장</Button>
        </Flex>
      </Flex>

      <Box overflow="auto" flex="1" mt="30px">
        <DataGrid data={expenses} columns={columns} onChangeRowData={handleChangeRowData} />
      </Box>
    </Flex>
  );
};
