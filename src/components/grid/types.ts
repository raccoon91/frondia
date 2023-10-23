import { ColDef, Column, ColumnApi, GridApi, RowNode } from "ag-grid-community";

export type EditorParams = {
  api: GridApi;
  column: Column;
  colDef: ColDef;
  node: RowNode;
  value: string | number;
  options: { label: string; value: string | number }[];
  optionIsEqual: (origin: any, target: any) => boolean;
  optionFormatter: (data: any) => string;
};

export type CellRendererProps = {
  api: GridApi;
  colDef: ColDef;
  column: Column;
  columnApi: ColumnApi;
  node: RowNode;
  rowIndex: number;
  value: string | number;
};
