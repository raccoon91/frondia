import dayjs from "dayjs";
import { Box, Button, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { DataGrid, SelectEditor, TextEditor } from "../components";
import { SuppressKeyboardEventParams } from "ag-grid-community";

const columns = [
  {
    field: "category",
    editable: true,
    cellEditor: TextEditor,
  },
  {
    field: "price",
    editable: true,
    cellEditor: TextEditor,
  },
  // { field: "price", editable: true, cellEditor: "agNumberCellEditor" },
  {
    field: "note",
    editable: true,
    cellEditor: SelectEditor,
    cellEditorPopup: true,
    cellEditorParams: {
      options: ["English", "Spanish", "French", "Portuguese", "(other)"],
    },
    suppressKeyboardEvent: (params: SuppressKeyboardEventParams) => {
      const key = params.event.key;

      return params.editing && key === "Enter";
    },
  },
  // {
  //   field: "note",
  //   editable: true,
  //   cellEditor: "agSelectCellEditor",
  //   cellEditorParams: {
  //     values: ["English", "Spanish", "French", "Portuguese", "(other)"],
  //     valueListGap: 0,
  //   },
  // },
  { field: "type", editable: true },
  { field: "count", editable: true },
];

const rows = [
  { id: 0, category: "Income", price: "100", note: "", type: "", count: "" },
  { id: 1, category: "Expense", price: "200", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
];

export const TodayPage = () => {
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
        </Flex>
      </Flex>

      <Box overflow="auto" flex="1" mt="30px">
        <DataGrid columns={columns} rows={rows} />
      </Box>
    </Flex>
  );
};
