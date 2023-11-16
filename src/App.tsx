import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useCategoryStore, useExpenseTypeStore, useScheduleStore } from "@/stores";
import { ToastContainer, theme } from "@/styles";
import { Layout } from "@/layouts";
import { AnnualPage, DailyPage, GoalPage, HomePage, LoginPage, SchedulePage } from "@/pages";

export const App = () => {
  const { getExpenseTypes } = useExpenseTypeStore(state => ({ getExpenseTypes: state.getExpenseTypes }));
  const { getCategories } = useCategoryStore(state => ({ getCategories: state.getCategories }));
  const { getTodaySchedule } = useScheduleStore(state => ({ getTodaySchedule: state.getTodaySchedule }));

  useEffect(() => {
    getExpenseTypes();
    getCategories();
    getTodaySchedule();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <ToastContainer />

      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="daily" element={<DailyPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="annual" element={<AnnualPage />} />
            <Route path="goal" element={<GoalPage />} />
          </Route>

          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};
