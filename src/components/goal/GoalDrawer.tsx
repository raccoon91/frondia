import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChangeEvent, FC, useState } from "react";
import { Datepicker } from "..";
import dayjs from "dayjs";

interface IGoalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (goal: Omit<IGoal, "user_id">) => Promise<void>;
}

export const GoalDrawer: FC<IGoalDrawerProps> = ({ isOpen, onClose, onCreate }) => {
  const [goal, setGoal] = useState({ name: "", price: "", description: "", date: dayjs().format("YYYY-MM-DD") });

  const handleChangeGoalValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setGoal(p => ({ ...p, [name]: value }));
  };

  const handleChangeGoalPrice = (value: string) => {
    setGoal(p => ({ ...p, price: value }));
  };

  const handleChangeGoalDate = (date: Date | null) => {
    if (!date) return;

    setGoal(p => ({ ...p, date: dayjs(date).format("YYYY-MM-DD") }));
  };

  const handleSubmitGoal = async () => {
    if (!goal.name || !goal.price) return;

    await onCreate(goal);

    onClose();
  };

  return (
    <Drawer isOpen={isOpen} size="sm" placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Text>목표 설정</Text>
        </DrawerHeader>

        <DrawerBody as={VStack} spacing="16px">
          <Input autoFocus name="name" value={goal.name} onChange={handleChangeGoalValue} placeholder="목표" />

          <NumberInput w="full" name="price" value={goal.price} onChange={handleChangeGoalPrice}>
            <NumberInputField placeholder="금액" />
          </NumberInput>

          <Input name="description" value={goal.description} onChange={handleChangeGoalValue} placeholder="설명" />

          <Datepicker value={goal.date} onChange={handleChangeGoalDate} />
        </DrawerBody>

        <DrawerFooter gap="16px">
          <Button variant="ghost" colorScheme="orange" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={handleSubmitGoal}>
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
