import dayjs from "dayjs";
import { useEffect } from "react";
import { Box, Text, VStack, Wrap } from "@chakra-ui/react";
import { Card } from "../components";
import { useCategoryStore } from "../stores";

export const HomePage = () => {
  const { getCategories } = useCategoryStore(state => ({ getCategories: state.getCategories }));

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Box p="50px">
      <Text fontSize="20px" fontWeight="bold">
        {dayjs().format("YYYY-MM-DD")}
      </Text>

      <Wrap mt="30px" spacing="30px">
        <VStack align="stretch" spacing="30px" w="400px">
          <Card title="계좌">
            <VStack align="stretch">
              <Text>현금</Text>
              <Text>적금</Text>
              <Text>투자</Text>
            </VStack>
          </Card>

          <Card title="요약">
            <VStack align="stretch">
              <Text>수입</Text>
              <Text>지출</Text>
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

        <VStack spacing="30px" w="400px">
          <Card title="오늘 내역 입력하기">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates vitae illo assumenda deserunt earum nam
            placeat perferendis laborum cum. Deleniti natus ducimus perspiciatis quibusdam tempore. Distinctio atque sit
            deserunt vel.💰
          </Card>

          <Card title="고정 수입">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates vitae illo assumenda deserunt earum nam
            placeat perferendis laborum cum. Deleniti natus ducimus perspiciatis quibusdam tempore. Distinctio atque sit
            deserunt vel.
          </Card>

          <Card title="고정 지출">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates vitae illo assumenda deserunt earum nam
            placeat perferendis laborum cum. Deleniti natus ducimus perspiciatis quibusdam tempore. Distinctio atque sit
            deserunt vel.
          </Card>

          <Card title="목표 설정">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates vitae illo assumenda deserunt earum nam
            placeat perferendis laborum cum. Deleniti natus ducimus perspiciatis quibusdam tempore. Distinctio atque sit
            deserunt vel.
          </Card>
        </VStack>
      </Wrap>
    </Box>
  );
};
