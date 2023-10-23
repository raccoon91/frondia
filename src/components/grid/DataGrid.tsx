import { FC } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { Box, Flex, Text } from "@chakra-ui/react";

interface IDataGridProps<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  onChangeRowData?: (rowIndex: number, columnId: string, value: T) => void;
}

export const DataGrid: FC<IDataGridProps> = ({ data, columns, onChangeRowData }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        console.log(rowIndex, columnId, value);

        onChangeRowData?.(rowIndex, columnId, value);
      },
    },
    debugTable: true,
  });

  return (
    <Flex direction="column" w="full" h="full" border="1px solid" borderColor="border">
      <Flex bg="theader" borderBottom="1px solid" borderColor="border">
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
      <Box bg="surface" flex="1" w="full">
        {table.getRowModel().rows.map(row => (
          <Flex key={row.id} _hover={{ bg: "tactive" }} borderBottom="1px solid" borderColor="border">
            {row.getAllCells().map(cell => (
              <Box key={cell.id} minW={cell.column.getSize()} borderRight="1px solid" borderColor="border">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
          </Flex>
        ))}
      </Box>
    </Flex>
  );
};
