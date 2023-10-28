import { ChangeEvent, useState } from "react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
import { Input } from "@chakra-ui/react";

export const TextEditor: ColumnDefTemplate<CellContext<any, unknown> & { inputProps: IEditorProps }> = ({
  row,
  column,
  table,
  inputProps,
}) => {
  const { value, ...restProps } = inputProps;
  const [cellData, setCellData] = useState<IGridText>(value);

  // const onBlur = () => {
  //   table.options.meta?.updateData(row.index, column.id, cellData);
  // };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setCellData(value);
    table.options.meta?.updateData(row.index, column.id, value);
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
      {...restProps}
    />
  );
};
