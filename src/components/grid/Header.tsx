import { FC } from "react";
import { Text } from "@chakra-ui/react";

interface IHeaderProps {
  name: string;
}

export const Header: FC<IHeaderProps> = ({ name }) => {
  return (
    <Text px="16px" fontWeight="bold">
      {name}
    </Text>
  );
};
