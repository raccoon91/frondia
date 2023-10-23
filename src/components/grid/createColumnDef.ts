import { SuppressKeyboardEventParams } from "ag-grid-community";
import { CellRendererProps, SelectEditor, TextEditor } from ".";

export const createTextColumn = (field: string) => ({
  field: field,
  editable: true,
  cellEditor: TextEditor,
});

export const createSelectColumn = (
  field: string,
  options: {
    label: string;
    value: string | number;
  }[],
  optionIsEqual: (origin: any, target: any) => boolean,
  formatter: (date: any) => string
) => ({
  field: field,
  editable: true,
  cellEditor: SelectEditor,
  // cellEditorPopup: true,
  cellEditorParams: {
    options: options,
    optionIsEqual: optionIsEqual,
    optionFormatter: formatter,
  },
  suppressKeyboardEvent: (params: SuppressKeyboardEventParams) => {
    const key = params.event.key;

    return params.editing && key === "Enter";
  },
  cellRenderer: (props: CellRendererProps) => {
    return formatter(props.value);
  },
});
