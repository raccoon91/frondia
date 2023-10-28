import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Text, VStack, Wrap } from "@chakra-ui/react";
import dayjs from "dayjs";
import { Card } from "@/components";
import { useStatisticsStore } from "@/stores";

export const HomePage = () => {
  const { price, getMonthlyExpense } = useStatisticsStore(state => ({
    price: state.price,
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
        <VStack align="stretch" spacing="30px" w="300px">
          <Card title="계좌">
            <VStack align="stretch">
              <Flex justify="space-between">
                <Text>현금</Text>
                <Text>{price?.income ?? "-"}원</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>적금</Text>
                <Text>{price?.saving ?? "-"}원</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>투자</Text>
                <Text>{price?.investment ?? "-"}원</Text>
              </Flex>
            </VStack>
          </Card>

          <Card title="종합">
            <VStack align="stretch">
              <Flex justify="space-between">
                <Text>수입</Text>
                <Text>{price?.totalIncome ?? "-"}원</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>지출</Text>
                <Text>{price?.expense ?? "-"}원</Text>
              </Flex>
            </VStack>
          </Card>
        </VStack>

        <VStack w="600px">
          <Card title="이번 달">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates vitae illo assumenda deserunt earum nam
            placeat perferendis laborum cum. Deleniti natus ducimus perspiciatis quibusdam tempore. Distinctio atque sit
            deserunt vel. Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, alias officia? Ducimus
            molestiae, eligendi quos, facilis repudiandae aliquid voluptas, sed totam voluptatem ad laboriosam enim
            quaerat quidem rerum placeat possimus. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident
            placeat, aspernatur dolorum eveniet harum inventore consectetur modi possimus laboriosam quos officia iste
            labore nostrum quibusdam, amet, odio reiciendis voluptatum cumque. Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Reprehenderit odio commodi nesciunt dolorem voluptas ex perspiciatis est quia ea rerum
            architecto, vero, debitis numquam quos, dolorum culpa totam aut accusantium.
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
