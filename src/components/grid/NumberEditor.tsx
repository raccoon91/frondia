import { useMemo } from "react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
import { NumberInput, NumberInputField } from "@chakra-ui/react";

export const NumberEditor: ColumnDefTemplate<CellContext<any, unknown> & { inputProps: IEditorProps }> = ({
  row,
  column,
  table,
  inputProps,
}) => {
  const { value, ...restProps } = inputProps;

  const formattedValue = useMemo(() => value?.toLocaleString(), [value]);

  const handleChangeInput = (value: string) => {
    if (!value) {
      table.options.meta?.updateData(row.index, column.id, 0);

      return;
    }

    const numberValue = parseFloat(value.replace(/,/, ""));

    table.options.meta?.updateData(row.index, column.id, numberValue);
  };

  return (
    <NumberInput value={formattedValue ?? ""} onChange={handleChangeInput}>
      <NumberInputField
        w="full"
        minW="full"
        border="transparent"
        rounded="none"
        cursor="cell"
        _focusVisible={{
          border: "2px solid",
          borderColor: "primary",
        }}
        {...restProps}
      />
    </NumberInput>
  );
};
