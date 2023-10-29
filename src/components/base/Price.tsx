import { Flex, Highlight, Skeleton, Text } from "@chakra-ui/react";
import { FC } from "react";

interface IPriceProps {
  isLoaded?: boolean;
  label?: string;
  price?: number | null;
}

export const Price: FC<IPriceProps> = ({ isLoaded, label, price }) => {
  return (
    <Flex justify="space-between">
      <Text>{label}</Text>

      {!isLoaded ? (
        <Skeleton w="120px" h="16px" />
      ) : (
        <Text minW="120px" textAlign="right">
          <Highlight query={price?.toLocaleString() ?? ""} styles={{ mr: "8px", fontWeight: "bold" }}>
            {price?.toLocaleString() ?? "-"}
          </Highlight>
          원
        </Text>
      )}
    </Flex>
  );
};
