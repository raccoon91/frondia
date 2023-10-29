import { Dispatch, FC, SetStateAction, useRef } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { Box, Flex } from "@chakra-ui/react";

interface IDataGridProps {
  data: IExpense[];
  columns: ColumnDef<IExpense, any>[];
  selectedRows?: Record<number, boolean>;
  setSelectedRows?: Dispatch<SetStateAction<Record<number, boolean>>>;
  onChangeRowData?: (rowIndex: number, columnId: string, value: unknown) => void;
}

export const DataGrid: FC<IDataGridProps> = ({
  data,
  columns,
  selectedRows = {},
  setSelectedRows,
  onChangeRowData,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const table = useReactTable({
    data,
    columns,
    state: { rowSelection: selectedRows },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setSelectedRows,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        onChangeRowData?.(rowIndex, columnId, value);
      },
    },
    debugTable: true,
  });

  const handleScrollBody = () => {
    if (!headerRef.current || !bodyRef.current) return;

    headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
  };

  return (
    <Flex
      overflow="hidden"
      direction="column"
      align="stretch"
      w="full"
      h="full"
      bg="surface"
      border="1px solid"
      borderColor="border"
      rounded="md"
      shadow="md"
    >
      <Flex ref={headerRef} overflow="hidden" bg="theader" borderBottom="1px solid" borderColor="border" zIndex="1">
        {table.getFlatHeaders().map(header => (
          <Flex
            key={header.id}
            align="center"
            minW={`${header.getSize()}px`}
            h="40px"
            borderRight="1px solid"
            borderColor="border"
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </Flex>
        ))}
      </Flex>

      <Box ref={bodyRef} overflow="auto" flex="1" onScroll={handleScrollBody}>
        {table.getRowModel().rows.map(row => (
          <Flex key={row.id} _hover={{ ".cell": { bg: "tactive" } }}>
            {row.getAllCells().map(cell => (
              <Box
                key={cell.id}
                className="cell"
                w={`${cell.column.getSize()}px`}
                minW={`${cell.column.getSize()}px`}
                borderRight="1px solid"
                borderBottom="1px solid"
                borderColor="border"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
          </Flex>
        ))}
      </Box>
    </Flex>
  );
};
