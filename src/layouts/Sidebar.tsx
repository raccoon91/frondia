import { VStack } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineMoney } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import { BsCreditCardFill } from "react-icons/bs";
import { FaEarthAsia } from "react-icons/fa6";
import { Menu } from "./Menu";

export const Sidebar = () => {
  return (
    <VStack justify="center" spacing="24px" w="60px">
      <Menu to="/" name="Home" icon={AiFillHome} />
      <Menu to="/today" name="Today" icon={TbMoneybag} />
      <Menu to="/incomes" name="Income" icon={MdOutlineMoney} />
      <Menu to="/expenses" name="Expense" icon={BsCreditCardFill} />
      <Menu to="/goal" name="Goal" icon={FaEarthAsia} />
    </VStack>
  );
};
