import { chakra } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface ICardProps {
  title?: string;
  children?: ReactNode;
}

export const Card: FC<ICardProps> = ({ title, children }) => {
  return (
    <chakra.div border="1px solid" borderColor="gray.200" rounded="md" shadow="md">
      {title ? (
        <chakra.div p="8px 16px" borderBottom="1px solid" borderColor="gray.200" fontWeight="600">
          {title}
        </chakra.div>
      ) : null}

      <chakra.div p="8px 16px">{children}</chakra.div>
    </chakra.div>
  );
};
