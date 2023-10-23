import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage, LoginPage, TodayPage } from "./pages";
import { Layout } from "./layouts";
import { theme } from "./styles";
import { useCategoryStore } from "./stores";

export const App = () => {
  const { getCategories } = useCategoryStore(state => ({ getCategories: state.getCategories }));

  useEffect(() => {
    getCategories();
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
