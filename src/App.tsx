import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardPage, HomePage, LoginPage } from "./pages";
import { Layout } from "./layouts";
import { theme } from "./styles";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};
