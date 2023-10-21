import { FC } from "react";
import { IconType } from "react-icons";
import { Icon, Tooltip } from "@chakra-ui/react";

interface IMenuProps {
  icon: IconType;
  name: string;
}

export const Menu: FC<IMenuProps> = ({ icon, name }) => {
  return (
    <Tooltip label={name} placement="right" bg="brand.100" color="brand.500">
      <span>
        <Icon
          as={icon}
          color="brand.500"
          boxSize="20px"
          _hover={{ boxSize: "30px" }}
          transition="width 0.1s linear, height 0.1s linear"
        />
      </span>
    </Tooltip>
  );
};
