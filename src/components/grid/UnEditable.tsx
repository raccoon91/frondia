import { Box } from "@chakra-ui/react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";

export const UnEditable: ColumnDefTemplate<CellContext<any, any>> = () => {
  return <Box w="full" h="full" bg="blackAlpha.50" cursor="not-allowed" />;
};
