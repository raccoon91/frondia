import { VStack } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { SiHackthebox } from "react-icons/si";
import { Menu } from "./Menu";

export const Sidebar = () => {
  return (
    <VStack justify="center" spacing="20px" w="60px">
      <Menu name="Home" icon={AiFillHome} />
      <Menu name="menu" icon={SiHackthebox} />
      <Menu name="menu" icon={SiHackthebox} />
      <Menu name="menu" icon={SiHackthebox} />
    </VStack>
  );
};
