import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    check: (rowId: number, value: boolean) => void;
    changeInput: (rowId: number, columnName: string, value: string | number) => void;
    changeSelect: (rowId: number, columnName: string, value: string | number) => void;
    clickEdit: (rowId: number) => void;
    clickCancel: (rowId: number) => void;
    clickSave: (rowId: number) => void;
  }
}
