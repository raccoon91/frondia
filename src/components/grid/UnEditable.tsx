import { Flex, Text } from "@chakra-ui/react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";

export const UnEditable: ColumnDefTemplate<CellContext<any, unknown> & { inputProps?: IEditorProps }> = ({
  inputProps,
}) => {
  return (
    <Flex align="center" w="full" h="full" px="16px" bg="blackAlpha.50" cursor="not-allowed">
      {inputProps?.value ? (
        <Text fontSize="14px" color="gray.400">
          {inputProps.value}
        </Text>
      ) : null}
    </Flex>
  );
};
