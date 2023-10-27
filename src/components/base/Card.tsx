import { BoxProps, chakra } from "@chakra-ui/react";
import { FC } from "react";

interface ICardProps extends BoxProps {
  title?: string;
}

export const Card: FC<ICardProps> = ({ title, children, ...props }) => {
  return (
    <chakra.div border="1px solid" borderColor="border" rounded="md" shadow="md" bg="surface" {...props}>
      {title ? (
        <chakra.div p="12px 24px" borderBottom="1px solid" borderColor="border" fontWeight="600">
          {title}
        </chakra.div>
      ) : null}

      <chakra.div p="12px 24px">{children}</chakra.div>
    </chakra.div>
  );
};
