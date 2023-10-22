import { Center, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { ColDef, Column, GridApi, RowNode } from "ag-grid-community";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

type EditorParams = {
  api: GridApi;
  column: Column;
  colDef: ColDef;
  node: RowNode;
  value: any;
  options: any[];
};

export const SelectEditor = forwardRef((params: EditorParams, ref) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(params?.value ?? "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const focused = params.api.getFocusedCell();
    focused?.column.getInstanceId();

    if (focused?.column.getInstanceId() === params?.column.getInstanceId()) {
      inputRef.current?.focus();
      setIsOpen(true);
    }
  }, []);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      },

      focusIn() {
        inputRef.current?.focus();
        setIsOpen(true);

        return false;
      },

      focusOut() {
        inputRef.current?.blur();
        setIsOpen(false);

        return false;
      },
    };
  });

  return (
    <Menu isOpen={isOpen} gutter={0} matchWidth>
      <MenuButton
        ref={inputRef}
        as={Center}
        tabIndex={0}
        w={params.column.getActualWidth()}
        h={params.node.rowHeight ?? "none"}
        px="16px"
        border="1px solid"
        bg="background"
        rounded="sm"
        outline="none"
        onClick={() => {
          setIsOpen(p => !p);
        }}
      >
        <Text fontSize="16px">{value || params.colDef.field}</Text>
      </MenuButton>
      <MenuList fontSize="16px">
        {params.options?.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              setValue(option);

              setTimeout(() => {
                params.api.stopEditing();
                params.api.setFocusedCell(params.node.rowIndex ?? 0, params.column);
              }, 100);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
});
