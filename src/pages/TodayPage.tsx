import dayjs from "dayjs";
import { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { Box, Button, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { DataGrid, createSelectColumn, createTextColumn } from "../components";
import { useCategoryStore } from "../stores";

const rows = [
  { id: 0, category: { id: 1, type: "income", name: "월급" }, price: "100", note: "", type: "", count: "" },
  { id: 1, category: { id: 2, type: "income", name: "부수입" }, price: "200", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
  { category: "", price: "", note: "", type: "", count: "" },
];

export const TodayPage = () => {
  const { categories } = useCategoryStore(state => ({ categories: state.categories }));

  const columns: ColDef[] = useMemo(
    () => [
      createSelectColumn(
        "category",
        categories,
        (origin, target) => origin?.id === target?.id,
        option => option?.name ?? ""
      ),
      createTextColumn("price"),
      createTextColumn("note"),
      createTextColumn("type"),
      createTextColumn("count"),
    ],
    [categories]
  );

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
        <DataGrid columns={columns} rows={rows} />
      </Box>
    </Flex>
  );
};
