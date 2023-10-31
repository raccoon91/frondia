import { Flex, Icon, IconButton, Text, Wrap } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { Card, Schedule, ScheduleCard } from "@/components";
import { useEffect } from "react";
import { useScheduleStore } from "@/stores";

export const SchedulePage = () => {
  const { schedules, getSchedules } = useScheduleStore(state => ({
    schedules: state.schedules,
    getSchedules: state.getSchedules,
  }));

  useEffect(() => {
    getSchedules();
  }, []);

  return (
    <Wrap spacing="30px" p="50px">
      <Card w="400px">
        <Flex align="center" justify="space-between">
          <Text fontWeight="semibold">수입</Text>

          <IconButton aria-label="add fixed income" variant="ghost" icon={<Icon as={FaPlus} />} />
        </Flex>

        <Flex direction="column" gap="16px" mt="20px">
          <Schedule date={1} name="월급" price={100000} />
        </Flex>
      </Card>

      <ScheduleCard title="지출" schedules={schedules?.expenses} />

      <ScheduleCard title="저축" schedules={schedules?.savings} />

      <ScheduleCard title="투자" schedules={schedules?.investments} />
    </Wrap>
  );
};
