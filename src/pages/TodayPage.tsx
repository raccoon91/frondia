import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { RowData, createColumnHelper } from "@tanstack/react-table";
import { Box, Button, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCategoryStore } from "../stores";
import { DataGrid, SelectEditor, TextEditor, UnEditable } from "../components";

const TYPES = [
  { id: 1, name: "수입" },
  { id: 2, name: "지출" },
  { id: 3, name: "투자" },
];

const columnHelper = createColumnHelper<IGridData>();

export const TodayPage = () => {
  const { categories } = useCategoryStore(state => ({ categories: state.categories }));
  const [data, setData] = useState<IGridData[]>([
    { id: null, type: null, category: null, price: null, note: null, count: null },
    { id: null, type: null, category: null, price: null, note: null, count: null },
  ]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("type", {
        cell: props => (
          <SelectEditor
            {...props}
            displayValue={(option?: IGridOption) => option?.name}
            options={TYPES}
            inputProps={{ value: props.row.original.type?.id }}
          />
        ),
        header: "Type",
        size: 140,
      }),
      columnHelper.accessor("category", {
        cell: props => (
          <SelectEditor
            {...props}
            displayValue={(option?: IGridOption) => option?.name}
            options={categories}
            inputProps={{ value: props.row.original.category?.id }}
          />
        ),
        header: "Category",
        size: 160,
      }),
      columnHelper.accessor("price", {
        cell: props => <TextEditor {...props} inputProps={{ value: props.row.original.price, textAlign: "right" }} />,
        header: "Price",
        size: 200,
      }),
      columnHelper.accessor("count", {
        cell: props =>
          props.row.original.count === null ? (
            <UnEditable {...props} />
          ) : (
            <TextEditor {...props} inputProps={{ value: props.row.original.count }} />
          ),
        header: "Count",
        size: 140,
      }),
      columnHelper.accessor("note", {
        cell: props => <TextEditor {...props} inputProps={{ value: props.row.original.note, textAlign: "right" }} />,
        header: "Note",
        size: 300,
      }),
    ],
    [categories]
  );

  const handleChangeRowData = (rowIndex: number, columnId: string, value: RowData) => {
    setData(row =>
      row.map((column, index) => {
        if (index === rowIndex) {
          return { ...column, [columnId]: value };
        }

        return column;
      })
    );
  };

  return (
    <Flex direction="column" w="full" h="full" p="50px">
      <Flex justify="space-between">
        <Flex align="center" gap="16px">
          <IconButton aria-label="previous day" variant="ghost" icon={<Icon as={FaChevronLeft} />} />
          <Text fontSize="20px" fontWeight="bold">
            {dayjs().format("YYYY-MM-DD")}
          </Text>
          <IconButton aria-label="next day" variant="ghost" icon={<Icon as={FaChevronRight} />} />
        </Flex>

        <Flex gap="8px">
          <Button>💰 수입</Button>
          <Button>💵 지출</Button>
          <Button colorScheme="green">💾 저장</Button>
        </Flex>
      </Flex>

      <Box overflow="auto" flex="1" mt="30px">
        <DataGrid data={data} columns={columns} onChangeRowData={handleChangeRowData} />
      </Box>
    </Flex>
  );
};
