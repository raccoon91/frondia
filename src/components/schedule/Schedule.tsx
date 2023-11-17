import { ChangeEvent, FC, useMemo } from "react";
import { Flex, Input, NumberInput, NumberInputField } from "@chakra-ui/react";
import { Dropdown, DropdownItem } from "..";

interface IScheduleProps {
  date: number;
  name: string;
  price: number;
  categoryId?: number | null;
  categories?: ICategory[];
  onChange?: (name: string, value: string | number | ICategory) => void;
}

export const Schedule: FC<IScheduleProps> = ({ date, name, price, categoryId, categories, onChange }) => {
  const selectedCategory = useMemo(
    () => categories?.find(category => category?.id?.toString() === categoryId?.toString()),
    [categoryId, categories]
  );

  const formattedPrice = useMemo(() => price?.toLocaleString(), [price]);

  const handleChangeDate = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.("date", e.target.value);
  };

  const handleChangeCategory = (e: ChangeEvent<HTMLInputElement>) => {
    const category = categories?.find(category => category?.id?.toString() === e.target.value);

    if (!category) return;

    onChange?.("category_id", category.id);
    onChange?.("categories", category);
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
        w="80px"
        variant="flushed"
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

      <Dropdown
        w="120px"
        variant="flushed"
        display={selectedCategory?.name}
        placeholder="카테고리"
        onChange={handleChangeCategory}
      >
        {categories?.map(category => (
          <DropdownItem key={category.id} value={category.id.toString()}>
            {category.name}
          </DropdownItem>
        ))}
      </Dropdown>

      <Input variant="flushed" w="120px" value={name} placeholder="내역" onChange={handleChangeName} />

      <NumberInput variant="flushed" flex="1" name="price" value={formattedPrice} onChange={handleChangePrice}>
        <NumberInputField placeholder="금액" />
      </NumberInput>
    </Flex>
  );
};
