import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Divider, Flex, Progress, Text, VStack, Wrap } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useStatisticsStore } from "@/stores";
import { Card, Price } from "@/components";

export const HomePage = () => {
  const { price, category, getMonthlyExpense } = useStatisticsStore(state => ({
    price: state.price,
    category: state.category,
    getMonthlyExpense: state.getMonthlyExpense,
  }));

  useEffect(() => {
    getMonthlyExpense();
  }, []);

  return (
    <Box p="50px">
      <Text fontSize="20px" fontWeight="bold">
        {dayjs().format("YYYY-MM-DD")}
      </Text>

      <Wrap mt="30px" spacing="30px">
        <Box w="300px">
          <Card title="이번 달">
            <VStack align="stretch">
              <Price label="수입" price={price?.income} />
              <Price label="적금" price={price?.saving} />
              <Price label="투자" price={price?.investment} />
              <Price label="지출" price={price?.expense} />
              <Divider />
              <Price label="남은 금액" price={price?.remain} />
            </VStack>
          </Card>
        </Box>

        <VStack w="600px" align="stretch">
          <Card title="이번 달">
            <VStack align="stretch" gap="8px" divider={<Divider />}>
              <VStack align="stretch">
                <Text fontWeight="semibold">지출</Text>
                <VStack align="stretch">
                  {Object.entries(category?.expenses ?? {}).map(([name, value], index) => (
                    <Flex key={index} gap="16px">
                      <Text color="sub">{name}</Text>
                      <Progress
                        flex="1"
                        rounded="md"
                        value={price?.expense ? (value / price.expense) * 100 : undefined}
                      />
                    </Flex>
                  ))}
                </VStack>
              </VStack>

              <VStack align="stretch">
                <Text fontWeight="semibold">수입</Text>
                <VStack align="stretch">
                  {Object.entries(category?.incomes ?? {}).map(([name, value], index) => (
                    <Flex key={index} gap="16px">
                      <Text color="sub">{name}</Text>
                      <Progress
                        flex="1"
                        rounded="md"
                        value={price?.totalIncome ? (value / price.totalIncome) * 100 : undefined}
                      />
                    </Flex>
                  ))}
                </VStack>
              </VStack>

              <VStack align="stretch">
                <Text fontWeight="semibold">저축</Text>
                <VStack align="stretch">
                  {Object.entries(category?.savings ?? {}).map(([name, value], index) => (
                    <Flex key={index} gap="16px">
                      <Text color="sub">{name}</Text>
                      <Progress
                        flex="1"
                        rounded="md"
                        value={price?.totalIncome ? (value / price.totalIncome) * 100 : undefined}
                      />
                    </Flex>
                  ))}
                </VStack>
              </VStack>

              <VStack align="stretch">
                <Text fontWeight="semibold">투자</Text>
                <VStack align="stretch">
                  {Object.entries(category?.investments ?? {}).map(([name, value], index) => (
                    <Flex key={index} gap="16px">
                      <Text color="sub">{name}</Text>
                      <Progress
                        flex="1"
                        rounded="md"
                        value={price?.totalIncome ? (value / price.totalIncome) * 100 : undefined}
                      />
                    </Flex>
                  ))}
                </VStack>
              </VStack>
            </VStack>
          </Card>
        </VStack>

        <VStack align="stretch" spacing="30px" w="300px">
          <Card cursor="pointer">
            <Flex as={Link} to="/today" align="center" justify="center" gap="16px">
              <Text fontSize="30px">💰</Text>
              <Text>오늘 내역 입력하기</Text>
            </Flex>
          </Card>

          <Card cursor="pointer">
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
          </Card>

          <Card cursor="pointer">
            <Flex align="center" justify="center" gap="16px">
              <Text fontSize="30px">🌏</Text>
              <Text>목표 설정</Text>
            </Flex>
          </Card>
        </VStack>
      </Wrap>
    </Box>
  );
};
