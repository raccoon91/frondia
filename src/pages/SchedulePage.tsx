import { useEffect } from "react";
import { Button, Flex, VStack, Wrap } from "@chakra-ui/react";
import { ScheduleCard } from "@/components";
import { useScheduleStore } from "@/stores";

export const SchedulePage = () => {
  const { schedules, getSchedules, addSchdule } = useScheduleStore(state => ({
    schedules: state.schedules,
    getSchedules: state.getSchedules,
    addSchdule: state.addSchdule,
  }));

  useEffect(() => {
    getSchedules();
  }, []);

  const handleAddSchedule = ({ type }: { type: string }) => {
    addSchdule(type);
  };

  return (
    <VStack align="stretch" spacing="30px" p="50px">
      <Flex justify="end">
        <Button variant="outline" colorScheme="green">
          💾 저장
        </Button>
      </Flex>

      <Wrap spacing="30px">
        <ScheduleCard title="수입" type="incomes" schedules={schedules?.incomes} onAddSchedule={handleAddSchedule} />

        <ScheduleCard title="지출" type="expenses" schedules={schedules?.expenses} onAddSchedule={handleAddSchedule} />

        <ScheduleCard title="저축" type="savings" schedules={schedules?.savings} onAddSchedule={handleAddSchedule} />

        <ScheduleCard
          title="투자"
          type="investments"
          schedules={schedules?.investments}
          onAddSchedule={handleAddSchedule}
        />
      </Wrap>
    </VStack>
  );
};
