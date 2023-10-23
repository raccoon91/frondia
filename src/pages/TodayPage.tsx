import dayjs from "dayjs";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Button, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCategoryStore } from "../stores";
import { DataGrid, TextEditor } from "../components";

const rows = [
  { id: 0, category: { id: 1, type: "income", name: "월급" }, price: "100", note: "", type: "", count: "" },
  { id: 1, category: { id: 2, type: "income", name: "부수입" }, price: "200", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
];

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor("category", {
    cell: props => <TextEditor {...props} getValue={() => props.row.original.category.name} />,
    header: "Category",
    size: 200,
  }),
  columnHelper.accessor("price", {
    cell: TextEditor,
    header: "Price",
    size: 200,
  }),
  columnHelper.accessor("note", {
    cell: TextEditor,
    header: "Note",
    size: 200,
  }),
  columnHelper.accessor("type", {
    cell: TextEditor,
    header: "Type",
    size: 200,
  }),
  columnHelper.accessor("count", {
    cell: TextEditor,
    header: "Count",
    size: 200,
  }),
];

export const TodayPage = () => {
  const { categories } = useCategoryStore(state => ({ categories: state.categories }));

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
        <DataGrid data={rows} columns={columns} />
      </Box>
    </Flex>
  );
};
