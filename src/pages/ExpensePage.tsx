import { useEffect, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAnnualStore } from "@/stores";
import { Card } from "@/components";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const { labels, price, getAnualExpense } = useAnnualStore(state => ({
    labels: state.labels,
    price: state.price,
    getAnualExpense: state.getAnualExpense,
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
          backgroundColor: "#DE542C",
          stack: "Stack 0",
        },
        {
          label: "Saving",
          data: price.savings.map(saving => saving.price),
          backgroundColor: "#EA7369",
          stack: "Stack 1",
        },
        {
          label: "Investment",
          data: price.investments.map(investment => investment.price),
          backgroundColor: "#19AADE",
          stack: "Stack 1",
        },
        {
          label: "Expense",
          data: price.expenses.map(expense => expense.price),
          backgroundColor: "#EABD38",
          stack: "Stack 2",
        },
      ],
    };

    return data;
  }, [labels, price]);

  useEffect(() => {
    getAnualExpense();
  }, []);

  return (
    <Box p="50px">
      <Card>
        <Bar options={options} data={annualExpenseData} />
      </Card>
    </Box>
  );
};
