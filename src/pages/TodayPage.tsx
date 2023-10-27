import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { RowData, createColumnHelper } from "@tanstack/react-table";
import { Box, Button, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCategoryStore, useExpenseStore, useExpenseTypeStore } from "../stores";
import { DataGrid, SelectEditor, TextEditor } from "../components";

const columnHelper = createColumnHelper<IExpense>();

export const TodayPage = () => {
  const { expenseTypes } = useExpenseTypeStore(state => ({ expenseTypes: state.expenseTypes }));
  const { incomeCategories, expenseCategories, savingCategories, investmentCategories } = useCategoryStore(state => ({
    incomeCategories: state.incomeCategories,
    expenseCategories: state.expenseCategories,
    savingCategories: state.savingCategories,
    investmentCategories: state.investmentCategories,
  }));
  const { expenses, getExpenses, setExpenses, addIncome, addExpense, addSaving, addInvestment } = useExpenseStore(
    state => ({
      expenses: state.expenses,
      getExpenses: state.getExpenses,
      setExpenses: state.setExpenses,
      addIncome: state.addIncome,
      addExpense: state.addExpense,
      addSaving: state.addSaving,
      addInvestment: state.addInvestment,
    })
  );

  const columns = useMemo(
    () => [
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
                ? incomeCategories
                : props.row.original.types?.id === 8
                ? expenseCategories
                : props.row.original.types?.id === 9
                ? savingCategories
                : props.row.original.types?.id === 10
                ? investmentCategories
                : []
            }
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
      columnHelper.accessor("note", {
        cell: props => <TextEditor {...props} inputProps={{ value: props.row.original.note }} />,
        header: "Note",
        size: 300,
      }),
    ],
    [expenseTypes, incomeCategories, expenseCategories, savingCategories, investmentCategories]
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
          <Button variant="outline" onClick={addIncome}>
            💵 수입
          </Button>
          <Button variant="outline" onClick={addExpense}>
            💳 지출
          </Button>
          <Button variant="outline" onClick={addSaving}>
            🐷 저축
          </Button>
          <Button variant="outline" onClick={addInvestment}>
            📈 투자
          </Button>
          <Button variant="outline" colorScheme="green">
            💾 저장
          </Button>
        </Flex>
      </Flex>

      <Box overflow="auto" flex="1" mt="30px">
        <DataGrid data={expenses} columns={columns} onChangeRowData={handleChangeRowData} />
      </Box>
    </Flex>
  );
};
