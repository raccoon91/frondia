import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useCategoryStore, useExpenseTypeStore } from "@/stores";
import { ToastContainer, theme } from "@/styles";
import { Layout } from "@/layouts";
import { DailyPage, ExpensePage, HomePage, LoginPage } from "@/pages";

export const App = () => {
  const { getExpenseTypes } = useExpenseTypeStore(state => ({ getExpenseTypes: state.getExpenseTypes }));
  const { getCategories } = useCategoryStore(state => ({ getCategories: state.getCategories }));

  useEffect(() => {
    getExpenseTypes();
    getCategories();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <ToastContainer />

      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="daily" element={<DailyPage />} />
            {/* <Route path="schedule" element={<SchedulePage />} /> */}
            <Route path="expenses" element={<ExpensePage />} />
          </Route>

          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};
