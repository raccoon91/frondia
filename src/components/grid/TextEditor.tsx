import { ChangeEvent, useState } from "react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
import { Input, InputProps } from "@chakra-ui/react";

export const TextEditor: ColumnDefTemplate<CellContext<any, any> & { inputProps: InputProps }> = ({
  row,
  column,
  table,
  inputProps,
}) => {
  const { value, ...restProps } = inputProps;
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
      {...restProps}
    />
  );
};
