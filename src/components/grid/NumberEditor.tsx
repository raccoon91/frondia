import { useMemo, useState } from "react";
import { CellContext, ColumnDefTemplate } from "@tanstack/react-table";
import { NumberInput, NumberInputField } from "@chakra-ui/react";

export const NumberEditor: ColumnDefTemplate<CellContext<any, unknown> & { inputProps: IEditorProps }> = ({
  row,
  column,
  table,
  inputProps,
}) => {
  const { value, ...restProps } = inputProps;
  const [cellData, setCellData] = useState<IGridText>(value);

  const formattedValue = useMemo(() => cellData?.toLocaleString(), [cellData]);

  // const onBlur = () => {
  //   table.options.meta?.updateData(row.index, column.id, cellData);
  // };

  const handleChangeInput = (value: string) => {
    if (!value) {
      setCellData(0);

      return;
    }

    const numberValue = parseFloat(value.replace(/,/, ""));

    setCellData(numberValue);
    table.options.meta?.updateData(row.index, column.id, numberValue);
  };

  return (
    <NumberInput value={formattedValue ?? ""} onChange={handleChangeInput}>
      <NumberInputField
        w={column.getSize()}
        minW={column.getSize()}
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
