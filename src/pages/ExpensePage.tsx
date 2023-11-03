import { useEffect, useMemo } from "react";
import { Center, Flex, Text, VStack } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { Card } from "@/components";
import { useAnnualStore } from "@/stores";

export const ExpensePage = () => {
  const { date, annual, category, getAnualExpense, setDate } = useAnnualStore(state => ({
    date: state.date,
    annual: state.annual,
    category: state.category,
    getAnualExpense: state.getAnualExpense,
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
    }));
  }, [date, category]);

  useEffect(() => {
    getAnualExpense();
  }, []);

  const handleClickExpenseChart = (state: { activeLabel?: string }) => {
    if (!state.activeLabel) return;

    setDate(state.activeLabel);
  };

  return (
    <ResponsiveContainer>
      <VStack align="stretch" spacing="30px" p="50px">
        <Card h="400px">
          <BarChart
            width={500}
            height={300}
            data={annualExpenseData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onClick={handleClickExpenseChart}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="incomes" fill="rgba(255, 99, 132, 0.7)" />
            <Bar dataKey="savings" stackId="group" fill="rgba(255, 159, 64, 0.7)" />
            <Bar dataKey="investments" stackId="group" fill="rgba(153, 102, 255, 0.7)" />
            <Bar dataKey="expenses" fill="rgba(255, 206, 86, 0.7)" />
          </BarChart>
        </Card>

        <Card>
          {date ? (
            <Flex align="stretch" gap="8px">
              <PieChart width={400} height={400}>
                <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" />
              </PieChart>
            </Flex>
          ) : (
            <Center h="200px">
              <Text fontSize="14px" fontWeight="semibold">
                월간 소비 차트를 클릭해주세요
              </Text>
            </Center>
          )}
        </Card>
      </VStack>
    </ResponsiveContainer>
  );
};
