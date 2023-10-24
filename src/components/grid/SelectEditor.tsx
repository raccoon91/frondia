import { useEffect, useState } from "react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
import { Flex, Menu, MenuButton, MenuItem, MenuList, theme } from "@chakra-ui/react";

export const SelectEditor: ColumnDefTemplate<CellContext<any, any> & { value?: any; options: any[] }> = ({
  row,
  column,
  table,
  value,
  options,
}) => {
  const [cellData, setCellData] = useState(value);

  useEffect(() => {
    const option = options.find(option => option.id === value);

    setCellData(option);
  }, [value, options]);

  const handleChangeSelect = (option: any) => () => {
    table.options.meta?.updateData(row.index, column.id, option);
  };

  return (
    <Menu gutter={0} boundary="scrollParent">
      <MenuButton
        as={Flex}
        tabIndex={0}
        align="center"
        maxW={column?.getSize() - 1}
        h="full"
        px="16px"
        cursor="pointer"
        outline="none"
        _focus={{
          boxShadow: `0 0 0 2px ${theme.colors.yellow[500]}`,
        }}
      >
        {cellData?.name}
      </MenuButton>
      <MenuList minW={column?.getSize() - 1} maxH="240px" overflow="auto">
        {options.map(option => (
          <MenuItem key={option.id} as="li" onClick={handleChangeSelect(option)}>
            {option.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
