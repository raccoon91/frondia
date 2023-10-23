import { ChangeEvent, useEffect, useState } from "react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
import { Input } from "@chakra-ui/react";

export const TextEditor: ColumnDefTemplate<CellContext<any, any>> = props => {
  const { getValue, row, column, table } = props;
  const initialValue = getValue();

  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Input
      value={value}
      maxW={column?.getSize()}
      onChange={handleChangeInput}
      onBlur={onBlur}
      border="none"
      rounded="none"
    />
  );
};
