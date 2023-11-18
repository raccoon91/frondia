import { useEffect } from "react";
import { Button, Flex, VStack, Wrap } from "@chakra-ui/react";
import { ScheduleCard } from "@/components";
import { useCategoryStore, useExpenseTypeStore, useScheduleStore } from "@/stores";

export const SchedulePage = () => {
  const { expenseTypes } = useExpenseTypeStore(state => ({ expenseTypes: state.expenseTypes }));
  const { category } = useCategoryStore(state => ({ category: state.category }));
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
    if (!expenseTypes.length) return;

    getSchedules();
  }, [expenseTypes]);

  const handleChangeSchedule = (
    type: IExpenseTypes,
    index: number,
    name: string,
    value: string | number | ICategory
  ) => {
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
        {expenseTypes.map(expenseType => (
          <ScheduleCard
            key={expenseType.id}
            title={expenseType.name}
            type={expenseType.type}
            expenseType={expenseType}
            categories={category?.[expenseType.type]}
            schedules={schedules?.[expenseType.type]}
            onAddSchedule={addSchdule}
            onChangeSchedule={handleChangeSchedule}
          />
        ))}
      </Wrap>
    </VStack>
  );
};
