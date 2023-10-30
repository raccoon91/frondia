import { FC } from "react";
import { Box, Flex, Skeleton, Text, VStack } from "@chakra-ui/react";
import { IStatisticsCategory } from "@/stores";

interface IExpenseProgressProps {
  isLoaded?: boolean;
  expenses?: IStatisticsCategory;
  totalPrice?: number;
}

export const ExpenseProgress: FC<IExpenseProgressProps> = ({ isLoaded, expenses, totalPrice }) => {
  return (
    <VStack align="stretch">
      {!isLoaded ? (
        <Skeleton w="full" h="16px" />
      ) : (
        Object.entries(expenses ?? {}).map(([name, category], index) => (
          <Flex key={index} align="center" gap="16px">
            <Text color="sub">{name}</Text>
            <Box
              position="relative"
              flex="1"
              h="12px"
              rounded="md"
              bg="border"
              _after={{
                content: '""',
                position: "absolute",
                top: "0",
                left: "0",
                width: `${totalPrice ? `${(category.value / totalPrice) * 100}%` : "unset"}`,
                height: "full",
                bg: category.color ?? "primary",
                rounded: "md",
              }}
            />
          </Flex>
        ))
      )}
    </VStack>
  );
};
