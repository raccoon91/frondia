import { useEffect, useState } from "react";
import { RowData } from "@tanstack/react-table";
import { Box, Button, Flex, Icon, IconButton, Text, Wrap } from "@chakra-ui/react";
import dayjs from "dayjs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCategoryStore, useExpenseStore, useExpenseTypeStore } from "@/stores";
import { Card, DataGrid } from "@/components";
import { useExpenseColumn } from "@/hooks";

export const DailyPage = () => {
  const { expenseTypes } = useExpenseTypeStore(state => ({ expenseTypes: state.expenseTypes }));
  const { category } = useCategoryStore(state => ({ category: state.category }));
  const {
    date,
    expenses,
    isEnableSave,
    getDailyExpense,
    moveDate,
    setExpenses,
    addExpense,
    saveExpenses,
    deleteExpenses,
  } = useExpenseStore(state => ({
    date: state.date,
    expenses: state.expenses,
    isEnableSave: state.isEnableSave,
    getDailyExpense: state.getDailyExpense,
    moveDate: state.moveDate,
    setExpenses: state.setExpenses,
    addExpense: state.addExpense,
    saveExpenses: state.saveExpenses,
    deleteExpenses: state.deleteExpenses,
  }));
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});

  const columns = useExpenseColumn(expenseTypes, category);

  useEffect(() => {
    getDailyExpense(date);
  }, [date]);

  const handleMovePrevDay = () => {
    moveDate("prev");
  };

  const handleMoveNextDay = () => {
    moveDate("next");
  };

  const handleDeleteExpenses = async () => {
    await deleteExpenses(selectedRows);

    setSelectedRows({});
  };

  const handleSaveExpenses = () => {
    saveExpenses();
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

  return (
    <Flex w="full" h="full" p="50px" gap="60px">
      <Flex overflow="hidden" flex="1" maxW="846px" direction="column" gap="30px" m="-16px" p="16px">
        <Wrap align="center" spacing="16px">
          <Flex align="center" gap="16px">
            <IconButton
              aria-label="previous day"
              variant="ghost"
              icon={<Icon as={FaChevronLeft} />}
              onClick={handleMovePrevDay}
            />
            <Text fontSize="20px" fontWeight="bold">
              {dayjs(date).format("YYYY년 MM월 DD일")}
            </Text>
            <IconButton
              aria-label="next day"
              variant="ghost"
              icon={<Icon as={FaChevronRight} />}
              isDisabled={dayjs().isSame(date, "day")}
              onClick={handleMoveNextDay}
            />
          </Flex>

          <Flex justify="space-between" gap="8px" ml="auto">
            <Button
              variant="outline"
              colorScheme="red"
              isDisabled={!Object.entries(selectedRows).length}
              onClick={handleDeleteExpenses}
            >
              🗑️ 삭제
            </Button>
            <Button variant="outline" colorScheme="green" isDisabled={!isEnableSave} onClick={handleSaveExpenses}>
              💾 저장
            </Button>
          </Flex>
        </Wrap>

        <Box flex="1" minH="300px">
          <DataGrid
            data={expenses}
            columns={columns}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onChangeRowData={handleChangeRowData}
          />
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
