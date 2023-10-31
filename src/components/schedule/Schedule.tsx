import { FC } from "react";
import { Flex, Input } from "@chakra-ui/react";
import { Dropdown, DropdownItem } from "..";

interface IScheduleProps {
  date: number;
  name: string;
  price: number;
}

export const Schedule: FC<IScheduleProps> = ({ date, name, price }) => {
  return (
    <Flex align="center" gap="16px">
      <Dropdown variant="flushed" w="80px" value={date} display={`${date} 일`}>
        {Array.from(Array(31), (_, i) => (
          <DropdownItem key={i} value={`${i + 1}`}>
            {i + 1} 일
          </DropdownItem>
        ))}
      </Dropdown>
      <Input variant="flushed" w="80px" value={name} />
      <Input variant="flushed" w="120px" value={price} />
    </Flex>
  );
};
