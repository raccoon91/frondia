import { FC } from "react";
import { Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { Card, Schedule } from "..";

interface IScheduleCardProps {
  title: string;
  type: IExpenseTypes;
  schedules?: ISchedule[];
  onAddSchedule: (type: IExpenseTypes) => void;
  onChangeSchedule: (type: IExpenseTypes, index: number, name: string, value: string | number) => void;
}

export const ScheduleCard: FC<IScheduleCardProps> = ({ title, type, schedules, onAddSchedule, onChangeSchedule }) => {
  const handleClickAddSchedule = () => {
    onAddSchedule(type);
  };

  const handleChangeSchedule = (type: IExpenseTypes, index: number) => (name: string, value: string | number) => {
    onChangeSchedule(type, index, name, value);
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
            onChange={handleChangeSchedule(type, index)}
          />
        ))}
      </Flex>
    </Card>
  );
};
