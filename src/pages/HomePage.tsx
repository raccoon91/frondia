import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Box, Flex, Text, VStack, Wrap } from "@chakra-ui/react";
import { Card, Dropdown, DropdownItem } from "../components";

export const HomePage = () => {
  return (
    <Box p="50px">
      <Dropdown
        value="1"
        onChange={e => {
          console.log(e);
        }}
      >
        <DropdownItem value="0">0</DropdownItem>
        <DropdownItem value="1">1</DropdownItem>
        <DropdownItem value="2">2</DropdownItem>
        <DropdownItem value="3">3</DropdownItem>
        <DropdownItem value="4">4</DropdownItem>
        <DropdownItem value="5">5</DropdownItem>
        <DropdownItem value="6">6</DropdownItem>
        <DropdownItem value="7">7</DropdownItem>
        <DropdownItem value="8">8</DropdownItem>
        <DropdownItem value="9">9</DropdownItem>
      </Dropdown>

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

        <VStack align="stretch" spacing="30px" w="300px">
          <Card>
            <Flex as={Link} to="/today" align="center" justify="center" gap="16px" cursor="pointer">
              <Text fontSize="30px">💰</Text>
              <Text>오늘 내역 입력하기</Text>
            </Flex>
          </Card>

          <Card>
            <Flex align="center" justify="center" gap="16px" cursor="pointer">
              <Text fontSize="30px">💵</Text>
              <Text>고정 수입 추가하기</Text>
            </Flex>
          </Card>

          <Card>
            <Flex align="center" justify="center" gap="16px" cursor="pointer">
              <Text fontSize="30px">💳</Text>
              <Text>고정 지출 추가하기</Text>
            </Flex>
          </Card>

          <Card>
            <Flex align="center" justify="center" gap="16px" cursor="pointer">
              <Text fontSize="30px">🌏</Text>
              <Text>목표 설정</Text>
            </Flex>
          </Card>
        </VStack>
      </Wrap>
    </Box>
  );
};
