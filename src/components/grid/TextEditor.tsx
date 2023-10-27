import { ChangeEvent, useState } from "react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
import { Input } from "@chakra-ui/react";

export const TextEditor: ColumnDefTemplate<CellContext<any, any> & { value?: string | number }> = ({
  row,
  column,
  table,
  value,
}) => {
  const [cellData, setCellData] = useState(value);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, cellData);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCellData(e.target.value);
  };

  return (
    <Input
      w={column.getSize()}
      minW={column.getSize()}
      border="transparent"
      rounded="none"
      cursor="cell"
      _focusVisible={{
        border: "2px solid",
        borderColor: "primary",
      }}
      value={cellData ?? ""}
      onChange={handleChangeInput}
      onBlur={onBlur}
    />
  );
};
