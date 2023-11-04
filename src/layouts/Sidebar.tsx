import { VStack } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { TbMoneybag } from "react-icons/tb";
import { FaChartSimple, FaEarthAsia } from "react-icons/fa6";
import { Menu } from "./Menu";

export const Sidebar = () => {
  return (
    <VStack justify="center" spacing="24px" w="60px">
      <Menu to="/" name="Home" icon={AiFillHome} />
      <Menu to="/daily" name="Daily" icon={TbMoneybag} />
      {/* <Menu to="/schedule" name="Schedule" icon={AiFillBook} /> */}
      <Menu to="/annual" name="Annual" icon={FaChartSimple} />
      <Menu to="/goal" name="Goal" icon={FaEarthAsia} />
    </VStack>
  );
};
