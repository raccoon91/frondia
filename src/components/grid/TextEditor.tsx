import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Column, GridApi } from "ag-grid-community";
import { Input } from "@chakra-ui/react";
import { grid } from "../../styles";

type EditorParams = {
  api: GridApi;
  column: Column;
  value: any;
};

export const TextEditor = forwardRef((params: EditorParams, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(params?.value ?? "");

  useEffect(() => {
    const focused = params.api.getFocusedCell();

    focused?.column.getInstanceId();

    if (focused?.column.getInstanceId() === params?.column.getInstanceId()) {
      inputRef.current?.focus();
    }
  }, []);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      },

      focusIn() {
        inputRef.current?.focus();

        return false;
      },
    };
  });

  const handleChangeCellInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={handleChangeCellInput}
      sx={{
        rounded: "none",
        border: "none",
        backgroundColor: grid.backgroundColor,
        _focusVisible: {
          border: "none",
        },
      }}
    />
  );
});
