import { ChangeEvent } from "react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
import { Input } from "@chakra-ui/react";

export const TextEditor: ColumnDefTemplate<CellContext<any, unknown> & { inputProps: IEditorProps }> = ({
  row,
  column,
  table,
  inputProps,
}) => {
  const { value, ...restProps } = inputProps;

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    table.options.meta?.updateData(row.index, column.id, value);
  };

  return (
    <Input
      w="full"
      minW="full"
      border="transparent"
      rounded="none"
      cursor="cell"
      _focusVisible={{
        border: "2px solid",
        borderColor: "primary",
      }}
      value={value ?? ""}
      onChange={handleChangeInput}
      {...restProps}
    />
  );
};
