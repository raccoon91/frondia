import { ChangeEvent, FC, useMemo } from "react";
import { Flex, Input, NumberInput, NumberInputField } from "@chakra-ui/react";
import { Dropdown, DropdownItem } from "..";

interface IScheduleProps {
  date: number;
  name: string;
  price: number;
  onChange?: (name: string, value: string | number) => void;
}

export const Schedule: FC<IScheduleProps> = ({ date, name, price, onChange }) => {
  const formattedValue = useMemo(() => price?.toLocaleString(), [price]);

  const handleChangeDate = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.("date", e.target.value);
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.("name", e.target.value);
  };

  const handleChangePrice = (value: string) => {
    if (!value) return;

    const numberValue = parseFloat(value.replace(/,/, ""));

    onChange?.("price", numberValue);
  };

  return (
    <Flex align="center" gap="16px">
      <Dropdown
        variant="flushed"
        w="80px"
        value={date}
        display={date ? `${date} 일` : null}
        placeholder="날짜"
        onChange={handleChangeDate}
      >
        {Array.from(Array(31), (_, i) => (
          <DropdownItem key={i} value={`${i + 1}`}>
            {i + 1} 일
          </DropdownItem>
        ))}
      </Dropdown>

      <Input variant="flushed" w="120px" value={name} placeholder="내역" onChange={handleChangeName} />

      <NumberInput variant="flushed" flex="1" name="price" value={formattedValue} onChange={handleChangePrice}>
        <NumberInputField placeholder="금액" />
      </NumberInput>
    </Flex>
  );
};
