import { useEffect } from "react";
import { Button, Flex, VStack, Wrap } from "@chakra-ui/react";
import { ScheduleCard } from "@/components";
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
    <VStack align="stretch" spacing="30px" p="50px">
      <Flex justify="end">
        <Button variant="outline" colorScheme="green">
          💾 저장
        </Button>
      </Flex>

      <Wrap spacing="30px">
        <ScheduleCard title="수입" type="incomes" schedules={schedules?.incomes} />

        <ScheduleCard title="지출" type="expenses" schedules={schedules?.expenses} />

        <ScheduleCard title="저축" type="savings" schedules={schedules?.savings} />

        <ScheduleCard title="투자" type="investments" schedules={schedules?.investments} />
      </Wrap>
    </VStack>
  );
};
