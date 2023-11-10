import { FC, ReactNode } from "react";
import { BoxProps, chakra } from "@chakra-ui/react";

interface ICardProps extends BoxProps {
  title?: string;
  rightAction?: ReactNode;
}

export const Card: FC<ICardProps> = ({ title, children, rightAction, ...props }) => {
  return (
    <chakra.div border="1px solid" borderColor="border" rounded="md" shadow="md" bg="surface" {...props}>
      {title || rightAction ? (
        <chakra.div display="flex" alignItems="center" p="12px 16px" borderBottom="1px solid" borderColor="border">
          {title && <chakra.p fontWeight="600">{title}</chakra.p>}

          {rightAction && <chakra.div ml="auto">{rightAction}</chakra.div>}
        </chakra.div>
      ) : null}

      <chakra.div p="12px 24px">{children}</chakra.div>
    </chakra.div>
  );
};
