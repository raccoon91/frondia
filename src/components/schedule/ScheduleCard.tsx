import { FC } from "react";
import { Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { Card, Schedule } from "..";

interface IScheduleCardProps {
  title: string;
  type: IExpenseTypes;
  expenseType?: IExpenseType;
  categories?: ICategory[];
  schedules?: ISchedule[];
  onAddSchedule: (type: IExpenseType) => void;
  onChangeSchedule: (type: IExpenseTypes, index: number, name: string, value: string | number | ICategory) => void;
}

export const ScheduleCard: FC<IScheduleCardProps> = ({
  title,
  type,
  expenseType,
  categories,
  schedules,
  onAddSchedule,
  onChangeSchedule,
}) => {
  const handleClickAddSchedule = () => {
    if (!expenseType?.id) return;

    onAddSchedule(expenseType);
  };

  const handleChangeSchedule =
    (type: IExpenseTypes, index: number) => (name: string, value: string | number | ICategory) => {
      onChangeSchedule(type, index, name, value);
    };

  return (
    <Card w="500px">
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
            categoryId={schedule.category_id}
            categories={categories}
            onChange={handleChangeSchedule(type, index)}
          />
        ))}
      </Flex>
    </Card>
  );
};
