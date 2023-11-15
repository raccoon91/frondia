import { useEffect } from "react";
import { Button, Flex, VStack, Wrap } from "@chakra-ui/react";
import { ScheduleCard } from "@/components";
import { useScheduleStore } from "@/stores";

export const SchedulePage = () => {
  const { isEnableSave, schedules, getSchedules, addSchdule, setSchedules, saveSchedules } = useScheduleStore(
    state => ({
      isEnableSave: state.isEnableSave,
      schedules: state.schedules,
      getSchedules: state.getSchedules,
      addSchdule: state.addSchdule,
      setSchedules: state.setSchedules,
      saveSchedules: state.saveSchedules,
    })
  );

  useEffect(() => {
    getSchedules();
  }, []);

  const handleChangeSchedule = (type: IExpenseTypes, index: number, name: string, value: string | number) => {
    if (!schedules) return;

    const newSchedules = {
      ...schedules,
      [type]: schedules?.[type]?.map((scheduleData, scheduleIndex) => {
        if (scheduleIndex === index) {
          return { ...scheduleData, [name]: value };
        }

        return scheduleData;
      }),
    };

    setSchedules(newSchedules);
  };

  return (
    <VStack align="stretch" spacing="30px" p="50px">
      <Flex justify="end">
        <Button isDisabled={!isEnableSave} variant="outline" colorScheme="green" onClick={saveSchedules}>
          💾 저장
        </Button>
      </Flex>

      <Wrap spacing="30px">
        <ScheduleCard
          title="수입"
          type="incomes"
          schedules={schedules?.incomes}
          onAddSchedule={addSchdule}
          onChangeSchedule={handleChangeSchedule}
        />

        <ScheduleCard
          title="지출"
          type="expenses"
          schedules={schedules?.expenses}
          onAddSchedule={addSchdule}
          onChangeSchedule={handleChangeSchedule}
        />

        <ScheduleCard
          title="저축"
          type="savings"
          schedules={schedules?.savings}
          onAddSchedule={addSchdule}
          onChangeSchedule={handleChangeSchedule}
        />

        <ScheduleCard
          title="투자"
          type="investments"
          schedules={schedules?.investments}
          onAddSchedule={addSchdule}
          onChangeSchedule={handleChangeSchedule}
        />
      </Wrap>
    </VStack>
  );
};
