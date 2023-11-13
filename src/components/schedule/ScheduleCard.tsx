import { FC } from "react";
import { Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { Card, Schedule } from "..";

interface IScheduleCardProps {
  title: string;
  type: string;
  schedules?: ISchedule[];
  onAddSchedule: (params: { type: string }) => void;
}

export const ScheduleCard: FC<IScheduleCardProps> = ({ title, type, schedules, onAddSchedule }) => {
  const handleClickAddSchedule = () => {
    onAddSchedule({ type });
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
        {schedules?.map(schedule => (
          <Schedule key={schedule.id} date={schedule.date} name={schedule.name} price={schedule.price} />
        ))}
      </Flex>
    </Card>
  );
};
