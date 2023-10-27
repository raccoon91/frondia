import { FC } from "react";
import { IconType } from "react-icons";
import { Icon, Link, Tooltip } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

interface IMenuProps {
  to: string;
  name: string;
  icon: IconType;
}

export const Menu: FC<IMenuProps> = ({ to, name, icon }) => {
  return (
    <Tooltip label={name} placement="right" bg="surface" color="primary">
      <Link
        to={to}
        as={NavLink}
        w="20px"
        h="20px"
        cursor="pointer"
        _activeLink={{
          width: "36px",
          height: "36px",
        }}
        _hover={{ width: "36px", height: "36px" }}
        transition="width 0.1s linear, height 0.1s linear"
      >
        <Icon as={icon} color="primary" boxSize="full" />
      </Link>
    </Tooltip>
  );
};
