import { ChangeEvent, useEffect, useState } from "react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
import { Dropdown, DropdownItem } from "..";

export const SelectEditor: ColumnDefTemplate<
  CellContext<any, any> & { value?: any; options: any[]; displayValue: (option: any) => string | undefined }
> = ({ row, column, table, value, options, displayValue }) => {
  const [cellData, setCellData] = useState(value);

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
      w={column?.getSize() - 1}
      border="none"
      value={cellData?.id}
      display={displayValue(cellData)}
      onChange={handleChangeSelect}
    >
      {options.map(option => (
        <DropdownItem key={option.id} value={option.id}>
          {option.name}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};
