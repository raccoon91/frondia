import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const Layout = () => {
  return (
    <Flex align="stretch" w="100vw" h="100vh" bg="brand.50">
      <Sidebar />

      <Box overflow="hidden" flex="1">
        <Outlet />
      </Box>
    </Flex>
  );
};
