import { FC, useRef } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { Box, Flex, Text } from "@chakra-ui/react";

interface IDataGridProps {
  data: IExpense[];
  columns: ColumnDef<IExpense, any>[];
  onChangeRowData?: (rowIndex: number, columnId: string, value: unknown) => void;
}

export const DataGrid: FC<IDataGridProps> = ({ data, columns, onChangeRowData }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
    >
      <Flex ref={headerRef} overflow="hidden" bg="theader" borderBottom="1px solid" borderColor="border" zIndex="1">
        {table.getFlatHeaders().map(header => (
          <Flex
            key={header.id}
            align="center"
            minW={header.getSize()}
            h="40px"
            px="16px"
            borderRight="1px solid"
            borderColor="border"
          >
            <Text fontWeight="bold">{flexRender(header.column.columnDef.header, header.getContext())}</Text>
          </Flex>
        ))}
      </Flex>

      <Box ref={bodyRef} overflow="auto" flex="1" onScroll={handleScrollBody}>
        {table.getRowModel().rows.map(row => (
          <Flex key={row.id} _hover={{ bg: "tactive", cell: { bg: "tactive" } }}>
            {row.getAllCells().map((cell, index) => (
              <Box
                key={index}
                className="cell"
                w={cell.column.getSize()}
                minW={cell.column.getSize()}
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
