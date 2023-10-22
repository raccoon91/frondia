import { FC, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { Box } from "@chakra-ui/react";
import { grid } from "../../styles";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { ColDef, ColGroupDef, RowValueChangedEvent } from "ag-grid-community";

interface IDataGridProps<T = unknown> {
  columns: (ColDef | ColGroupDef)[];
  rows: T[];
}

export const DataGrid: FC<IDataGridProps> = ({ columns, rows }) => {
  const handleRowValueChange = useCallback((event: RowValueChangedEvent) => {
    console.log(event);
  }, []);

  return (
    <Box
      className="ag-theme-alpine"
      w="full"
      h="full"
      sx={{
        "--ag-borders": grid.border,
        "--ag-border-color": grid.borderColor,
        "--ag-font-size": grid.fontSize,
        "--ag-font-family": grid.fontFamily,
        "--ag-row-hover-color": grid.rowHoverColor,
        "--ag-alpine-active-color": grid.alpineActiveColor,
        "--ag-header-foreground-color": grid.headerForegroundColor,
        "--ag-header-background-color": grid.headerBackgroundColor,
        "--ag-header-column-resize-handle-color": grid.headerColumnResizeHandleColor,
        "--ag-foreground-color": grid.foregroundColor,
        "--ag-background-color": grid.backgroundColor,
        "--ag-odd-row-background-color": grid.oddBackgroundColor,
        "--ag-selected-row-background-color": grid.selectedRowBackgroundColor,
        "--ag-borders-input": grid.bordersInput,
        "--ag-input-border-color": grid.inputBorderColor,
        "--ag-input-focus-border-color": grid.inputFocusBorderColor,
      }}
    >
      <AgGridReact
        editType="fullRow"
        columnDefs={columns}
        rowData={rows}
        tabToNextCell={event => event.nextCellPosition}
        onRowValueChanged={handleRowValueChange}
      />
    </Box>
  );
};
