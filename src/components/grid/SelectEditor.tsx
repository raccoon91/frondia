import { ChangeEvent, useEffect, useState } from "react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
import { Dropdown, DropdownItem } from "..";
import { InputProps } from "@chakra-ui/react";

export const SelectEditor: ColumnDefTemplate<
  CellContext<any, any> & {
    options: any[];
    displayValue: (option: any) => string | undefined;
    inputProps: Omit<InputProps, "display">;
  }
> = ({ row, column, table, inputProps, options, displayValue }) => {
  const { value, ...restProps } = inputProps;
  const [cellData, setCellData] = useState<any>(value);

  useEffect(() => {
    const option = options.find(option => option.id === value);

    setCellData(option);
  }, [value, options]);

  const handleChangeSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const option = options.find(option => option.id?.toString() === e.target.value);

    table.options.meta?.updateData(row.index, column.id, option);
  };

  return (
    <Dropdown
      w={column.getSize()}
      minW={column.getSize()}
      border="transparent"
      rounded="none"
      cursor="cell"
      _focusVisible={{
        border: "2px solid",
        borderColor: "primary",
      }}
      value={cellData?.id}
      display={displayValue(cellData)}
      onChange={handleChangeSelect}
      {...restProps}
    >
      {options.map(option => (
        <DropdownItem key={option.id} value={option.id}>
          {option.name}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};
