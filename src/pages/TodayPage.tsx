import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Button, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCategoryStore } from "../stores";
import { DataGrid, SelectEditor, TextEditor, UnEditable } from "../components";

const columnHelper = createColumnHelper<any>();

export const TodayPage = () => {
  const { categories } = useCategoryStore(state => ({ categories: state.categories }));
  const [data, setData] = useState([
    { id: 0, category: { id: 1, type: "income", name: "월급" }, price: "100", note: null, type: null, count: null },
    { id: 1, category: { id: 2, type: "income", name: "부수입" }, price: "200", note: null, type: null, count: null },
    { category: "", price: "", note: null, type: null, count: null },
    { category: "", price: "", note: null, type: null, count: null },
  ]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("category", {
        cell: props => (
          <SelectEditor
            {...props}
            displayValue={(option: any) => option?.name}
            options={categories}
            inputProps={{ value: props.row.original.category.id }}
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
      columnHelper.accessor("type", {
        cell: props =>
          props.row.original.type === null ? (
            <UnEditable {...props} />
          ) : (
            <TextEditor {...props} inputProps={{ value: props.row.original.type }} />
          ),
        header: "Type",
        size: 140,
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

  const handleChangeRowData = (rowIndex: number, columnId: string, value: any) => {
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
