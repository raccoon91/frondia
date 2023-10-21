import { chakra } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface ICardProps {
  title?: string;
  children?: ReactNode;
}

export const Card: FC<ICardProps> = ({ title, children }) => {
  return (
    <chakra.div border="1px solid" borderColor="border" rounded="md" shadow="md" bg="surface">
      {title ? (
        <chakra.div p="12px 24px" borderBottom="1px solid" borderColor="border" fontWeight="600">
          {title}
        </chakra.div>
      ) : null}

      <chakra.div p="12px 24px">{children}</chakra.div>
    </chakra.div>
  );
};
