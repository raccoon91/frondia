import { FC } from "react";
import { IconType } from "react-icons";
import { Box, Icon, Tooltip } from "@chakra-ui/react";

interface IMenuProps {
  icon: IconType;
  name: string;
}

export const Menu: FC<IMenuProps> = ({ icon, name }) => {
  return (
    <Tooltip label={name} placement="right" bg="surface" color="primary">
      <Box
        w="20px"
        h="20px"
        cursor="pointer"
        _hover={{ width: "30px", height: "30px" }}
        transition="width 0.1s linear, height 0.1s linear"
      >
        <Icon as={icon} color="primary" boxSize="full" />
      </Box>
    </Tooltip>
  );
};
