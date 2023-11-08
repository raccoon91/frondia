import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Divider, Flex, Icon, IconButton, Text, VStack, Wrap } from "@chakra-ui/react";
import dayjs from "dayjs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useStatisticsStore } from "@/stores";
import { Card, ExpenseProgress, Price } from "@/components";

export const HomePage = () => {
  const { isFetched, date, price, category, getMonthlyExpense, moveDate } = useStatisticsStore(state => ({
    isFetched: state.isFetched,
    date: state.date,
    price: state.price,
    category: state.category,
    getMonthlyExpense: state.getMonthlyExpense,
    moveDate: state.moveDate,
  }));

  useEffect(() => {
    getMonthlyExpense(date);
  }, [date]);

  const handleMovePrevMonth = () => {
    moveDate("prev");
  };

  const handleMoveNextMonth = () => {
    moveDate("next");
  };

  return (
    <Box p="50px">
      <Flex align="center" gap="16px">
        <IconButton
          aria-label="previous day"
          variant="ghost"
          icon={<Icon as={FaChevronLeft} />}
          onClick={handleMovePrevMonth}
        />
        <Text fontSize="20px" fontWeight="bold">
          {dayjs(date).format("YYYY년 MM월")}
        </Text>
        <IconButton
          aria-label="next day"
          variant="ghost"
          icon={<Icon as={FaChevronRight} />}
          isDisabled={dayjs().isSame(date, "day")}
          onClick={handleMoveNextMonth}
        />
      </Flex>

      <Wrap mt="30px" spacing="30px">
        <Box w="300px">
          <Card title="이번 달">
            <VStack align="stretch">
              <Price isLoaded={isFetched} label="수입" price={price?.income} />
              <Price isLoaded={isFetched} label="적금" price={price?.saving} />
              <Price isLoaded={isFetched} label="투자" price={price?.investment} />
              <Price isLoaded={isFetched} label="지출" price={price?.expense} />
              <Divider />
              <Price isLoaded={isFetched} label="남은 금액" price={price?.remain} />
            </VStack>
          </Card>
        </Box>

        <VStack w="600px" align="stretch">
          <Card title="이번 달">
            <VStack align="stretch" gap="8px" divider={<Divider />}>
              <VStack align="stretch">
                <Text fontWeight="semibold">지출</Text>
                <ExpenseProgress isLoaded={isFetched} expenses={category?.expenses} totalPrice={price?.expense} />
              </VStack>

              <VStack align="stretch">
                <Text fontWeight="semibold">수입</Text>
                <ExpenseProgress isLoaded={isFetched} expenses={category?.incomes} totalPrice={price?.totalIncome} />
              </VStack>

              <VStack align="stretch">
                <Text fontWeight="semibold">저축</Text>
                <ExpenseProgress isLoaded={isFetched} expenses={category?.savings} totalPrice={price?.totalIncome} />
              </VStack>

              <VStack align="stretch">
                <Text fontWeight="semibold">투자</Text>
                <ExpenseProgress
                  isLoaded={isFetched}
                  expenses={category?.investments}
                  totalPrice={price?.totalIncome}
                />
              </VStack>
            </VStack>
          </Card>
        </VStack>

        <VStack align="stretch" spacing="30px" w="300px">
          <Card cursor="pointer">
            <Flex as={Link} to="/daily" align="center" justify="center" gap="16px">
              <Text fontSize="30px">💰</Text>
              <Text>오늘 내역 입력하기</Text>
            </Flex>
          </Card>

          {/* <Card cursor="pointer">
            <Flex align="center" justify="center" gap="16px">
              <Text fontSize="30px">💵</Text>
              <Text>고정 수입 추가하기</Text>
            </Flex>
          </Card>

          <Card cursor="pointer">
            <Flex align="center" justify="center" gap="16px">
              <Text fontSize="30px">💳</Text>
              <Text>고정 지출 추가하기</Text>
            </Flex>
          </Card> */}

          <Card cursor="pointer">
            <Flex as={Link} to="/goal" align="center" justify="center" gap="16px">
              <Text fontSize="30px">🌏</Text>
              <Text>목표 설정</Text>
            </Flex>
          </Card>
        </VStack>
      </Wrap>
    </Box>
  );
};
