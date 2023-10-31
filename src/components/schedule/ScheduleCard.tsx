import { FC } from "react";
import { Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { Card, Schedule } from "..";

interface IScheduleCardProps {
  title: string;
  schedules?: ISchedule[];
}

export const ScheduleCard: FC<IScheduleCardProps> = ({ title, schedules }) => {
  return (
    <Card w="400px">
      <Flex align="center" justify="space-between">
        <Text fontWeight="semibold">{title}</Text>

        <IconButton aria-label="add fixed income" variant="ghost" icon={<Icon as={FaPlus} />} />
      </Flex>

      <Flex direction="column" gap="16px" mt="20px">
        {schedules?.map(schedule => (
          <Schedule key={schedule.id} date={schedule.date} name={schedule.name} price={schedule.price} />
        ))}
      </Flex>
    </Card>
  );
};
