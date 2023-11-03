import { MouseEvent, useEffect, useMemo, useRef } from "react";
import { Center, Flex, Text, VStack } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Doughnut, getElementAtEvent } from "react-chartjs-2";
import { useAnnualStore } from "@/stores";
import { Card } from "@/components";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const options = {
  plugins: {
    title: {
      display: true,
      text: "Annual Expense",
    },
  },
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  scales: {
    x: { stacked: true },
    y: { stacked: true },
  },
};

export const ExpensePage = () => {
  const chartRef = useRef<ChartJS<"bar", (number | null)[], string>>();
  const { date, labels, price, category, getAnualExpense, setDate } = useAnnualStore(state => ({
    date: state.date,
    labels: state.labels,
    price: state.price,
    category: state.category,
    getAnualExpense: state.getAnualExpense,
    setDate: state.setDate,
  }));

  const annualExpenseData = useMemo(() => {
    if (!labels || !price)
      return {
        labels: [],
        datasets: [],
      };

    const data = {
      labels,
      datasets: [
        {
          label: "Income",
          data: price.incomes.map(income => income.price),
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          stack: "Stack 0",
        },
        {
          label: "Saving",
          data: price.savings.map(saving => saving.price),
          backgroundColor: "rgba(255, 159, 64, 0.7)",
          stack: "Stack 1",
        },
        {
          label: "Investment",
          data: price.investments.map(investment => investment.price),
          backgroundColor: "rgba(153, 102, 255, 0.7)",
          stack: "Stack 1",
        },
        {
          label: "Expense",
          data: price.expenses.map(expense => expense.price),
          backgroundColor: "rgba(255, 206, 86, 0.7)",
          stack: "Stack 2",
        },
      ],
    };

    return data;
  }, [labels, price]);

  const categoryData = useMemo(() => {
    if (!date || !category)
      return {
        labels: [],
        datasets: [],
      };

    const data = {
      labels: Object.keys(category[date] ?? {}),
      datasets: [
        {
          label: "Category",
          data: Object.values(category[date] ?? {}).map(data => data.value),
          backgroundColor: Object.values(category[date] ?? {}).map(data => data.color ?? ""),
        },
      ],
    };

    return data;
  }, [date, category]);

  useEffect(() => {
    getAnualExpense();
  }, []);

  const handleClickExpenseChart = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;

    const [element] = getElementAtEvent(chartRef.current, e);

    if (!element) return;

    const label = labels?.[element.index];

    if (!label) return;

    setDate(label);
  };

  return (
    <VStack align="stretch" spacing="30px" p="50px">
      <Card h="400px">
        <Bar ref={chartRef} options={options} data={annualExpenseData} onClick={handleClickExpenseChart} />
      </Card>

      <Card>
        {date ? (
          <Flex align="stretch" gap="8px">
            <Doughnut data={categoryData} />
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
  );
};
