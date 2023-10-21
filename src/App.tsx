import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages";
import { theme } from "./styles";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route index element={<HomePage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};
