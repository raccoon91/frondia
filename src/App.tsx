import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./styles";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <p>home</p>
    </ChakraProvider>
  );
};
