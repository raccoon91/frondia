import { Flex, Highlight, Skeleton, Text } from "@chakra-ui/react";
import { isNil } from "lodash-es";
import { FC } from "react";

interface IPriceProps {
  label?: string;
  price?: number | null;
}

export const Price: FC<IPriceProps> = ({ label, price }) => {
  return (
    <Flex justify="space-between">
      <Text>{label}</Text>

      <Skeleton isLoaded={!isNil(price)}>
        <Text minW="120px" textAlign="right">
          <Highlight query={price?.toLocaleString() ?? ""} styles={{ mr: "8px", fontWeight: "bold" }}>
            {price?.toLocaleString() ?? "-"}
          </Highlight>
          원
        </Text>
      </Skeleton>
    </Flex>
  );
};
