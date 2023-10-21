import { VStack } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { Menu } from "./Menu";

export const Sidebar = () => {
  return (
    <VStack justify="center" spacing="24px" w="60px">
      <Menu to="/" name="Home" icon={AiFillHome} />
    </VStack>
  );
};
