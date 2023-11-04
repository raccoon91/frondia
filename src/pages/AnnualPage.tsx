import { useEffect, useMemo } from "react";
import { Box, Center, Text, VStack } from "@chakra-ui/react";
import { Bar } from "recharts";
import { BarChart, BarChartEvent, Card, PieChart } from "@/components";
import { useAnnualStore } from "@/stores";

export const AnnualPage = () => {
  const { date, annual, category, getAnnualExpense, setDate } = useAnnualStore(state => ({
    date: state.date,
    annual: state.annual,
    category: state.category,
    getAnnualExpense: state.getAnnualExpense,
    setDate: state.setDate,
  }));

  const annualExpenseData = useMemo(() => {
    if (!annual) return;

    return Object.entries(annual).map(([date, data]) => ({
      name: date,
      ...data,
    }));
  }, [annual]);

  const categoryData = useMemo(() => {
    if (!date || !category) return;

    return Object.entries(category[date]).map(([type, data]) => ({
      name: type,
      value: data.value,
      color: data.color,
    }));
  }, [date, category]);

  useEffect(() => {
    getAnnualExpense();
  }, []);

  const handleClickExpenseChart = (e: BarChartEvent) => {
    if (!e.activeLabel) return;

    setDate(e.activeLabel);
  };

  return (
    <VStack align="stretch" spacing="30px" p="50px">
      <Card title="연간 소비">
        <BarChart width="100%" height="400px" data={annualExpenseData} onClick={handleClickExpenseChart}>
          <Bar dataKey="incomes" fill="rgba(255, 99, 132, 0.7)" />
          <Bar dataKey="savings" stackId="group" fill="rgba(255, 159, 64, 0.7)" />
          <Bar dataKey="investments" stackId="group" fill="rgba(153, 102, 255, 0.7)" />
          <Bar dataKey="expenses" fill="rgba(255, 206, 86, 0.7)" />
        </BarChart>
      </Card>

      <Card title="월간 소비 카테고리">
        {date ? (
          <Box w="600px">
            <PieChart width="100%" height="400px" data={categoryData} />
          </Box>
        ) : (
          <Center h="200px">
            <Text fontSize="14px" fontWeight="semibold">
              연간 소비 차트를 클릭해주세요
            </Text>
          </Center>
        )}
      </Card>
    </VStack>
  );
};
