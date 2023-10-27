import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage, LoginPage, TodayPage } from "./pages";
import { Layout } from "./layouts";
import { theme } from "./styles";
import { useCategoryStore, useExpenseTypeStore } from "./stores";

export const App = () => {
  const { getExpenseTypes } = useExpenseTypeStore(state => ({ getExpenseTypes: state.getExpenseTypes }));
  const { getIncomeCategories, getExpenseCategories, getSavingCategories, getInvestmentCategories } = useCategoryStore(
    state => ({
      getIncomeCategories: state.getIncomeCategories,
      getExpenseCategories: state.getExpenseCategories,
      getSavingCategories: state.getSavingCategories,
      getInvestmentCategories: state.getInvestmentCategories,
    })
  );

  useEffect(() => {
    getExpenseTypes();
    getIncomeCategories();
    getExpenseCategories();
    getSavingCategories();
    getInvestmentCategories();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="today" element={<TodayPage />} />
          </Route>

          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};
