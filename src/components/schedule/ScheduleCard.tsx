import { FC } from "react";
import { Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { Card, Schedule } from "..";
import { useScheduleStore } from "@/stores";

interface IScheduleCardProps {
  title: string;
  type: IExpenseTypes;
  schedules?: ISchedule[];
}

export const ScheduleCard: FC<IScheduleCardProps> = ({ title, type, schedules }) => {
  const { addSchdule, changeSchedule } = useScheduleStore(state => ({
    addSchdule: state.addSchdule,
    changeSchedule: state.changeSchedule,
  }));

  const handleClickAddSchedule = () => {
    addSchdule(type);
  };

  const handleChangeSchedule = (index: number) => (name: string, value: string | number) => {
    console.log(name, value);
    changeSchedule(index, type, { name, value });
  };

  return (
    <Card w="400px">
      <Flex align="center" justify="space-between">
        <Text fontWeight="semibold">{title}</Text>

        <IconButton
          aria-label="add fixed income"
          variant="ghost"
          icon={<Icon as={FaPlus} />}
          onClick={handleClickAddSchedule}
        />
      </Flex>

      <Flex direction="column" gap="16px" mt="20px">
        {schedules?.map((schedule, index) => (
          <Schedule
            key={index}
            date={schedule.date}
            name={schedule.name}
            price={schedule.price}
            onChange={handleChangeSchedule(index)}
          />
        ))}
      </Flex>
    </Card>
  );
};
