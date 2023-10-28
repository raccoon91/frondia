import { useEffect, useMemo } from "react";
import { RowData, createColumnHelper } from "@tanstack/react-table";
import { Box, Button, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCategoryStore, useExpenseStore, useExpenseTypeStore } from "@/stores";
import { Card, DataGrid, SelectEditor, TextEditor } from "@/components";

const columnHelper = createColumnHelper<IExpense>();

export const TodayPage = () => {
  const { expenseTypes } = useExpenseTypeStore(state => ({ expenseTypes: state.expenseTypes }));
  const { incomeCategories, expenseCategories, savingCategories, investmentCategories } = useCategoryStore(state => ({
    incomeCategories: state.incomeCategories,
    expenseCategories: state.expenseCategories,
    savingCategories: state.savingCategories,
    investmentCategories: state.investmentCategories,
  }));
  const { expenses, getDailyExpense, setExpenses, addExpense } = useExpenseStore(state => ({
    expenses: state.expenses,
    getDailyExpense: state.getDailyExpense,
    setExpenses: state.setExpenses,
    addExpense: state.addExpense,
  }));

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
        size: 200,
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
    getDailyExpense();
  }, []);

  const handleAddIncome = () => {
    addExpense("incomes");
  };

  const handleAddExpense = () => {
    addExpense("expenses");
  };

  const handleAddSaving = () => {
    addExpense("savings");
  };

  const handleAddInvestment = () => {
    addExpense("investments");
  };

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
    <Flex w="full" h="full" p="50px" gap="60px">
      <Flex overflow="hidden" flex="1" maxW="842px" direction="column" gap="30px">
        <Flex align="center" justify="space-between" gap="16px">
          <Flex align="center" gap="16px">
            <IconButton aria-label="previous day" variant="ghost" icon={<Icon as={FaChevronLeft} />} />
            <Text fontSize="20px" fontWeight="bold">
              {dayjs().format("YYYY-MM-DD")}
            </Text>
            <IconButton aria-label="next day" variant="ghost" icon={<Icon as={FaChevronRight} />} />
          </Flex>

          <Button variant="outline" colorScheme="green">
            💾 저장
          </Button>
        </Flex>

        <Box overflow="auto" flex="1">
          <DataGrid data={expenses} columns={columns} onChangeRowData={handleChangeRowData} />
        </Box>
      </Flex>

      <Flex direction="column" gap="30px" w="300px" mt="70px">
        <Card cursor="pointer" onClick={handleAddIncome}>
          <Flex align="center" justify="center" gap="16px">
            <Text fontSize="30px">💵</Text>
            <Text>오늘의 수입</Text>
          </Flex>
        </Card>
        <Card cursor="pointer" onClick={handleAddExpense}>
          <Flex align="center" justify="center" gap="16px">
            <Text fontSize="30px">💳</Text>
            <Text>오늘의 지출</Text>
          </Flex>
        </Card>
        <Card cursor="pointer" onClick={handleAddSaving}>
          <Flex align="center" justify="center" gap="16px">
            <Text fontSize="30px">🐷</Text>
            <Text>오늘의 저축</Text>
          </Flex>
        </Card>
        <Card cursor="pointer" onClick={handleAddInvestment}>
          <Flex align="center" justify="center" gap="16px">
            <Text fontSize="30px">📈</Text>
            <Text>오늘의 투자</Text>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};
