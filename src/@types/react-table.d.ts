import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData = any> {
    updateData: (rowIndex: number, columnId: string, value: TData) => void;
  }
}
