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
  VStack,
} from "@chakra-ui/react";
import { ChangeEvent, FC, useState } from "react";

interface IGoalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (goal: Omit<IGoal, "user_id">) => Promise<void>;
}

export const GoalDrawer: FC<IGoalDrawerProps> = ({ isOpen, onClose, onCreate }) => {
  const [goal, setGoal] = useState({ name: "", price: "", description: "", date: "" });

  const handleChangeGoalValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setGoal(p => ({ ...p, [name]: value }));
  };

  const handleChangeGoalPrice = (value: string) => {
    setGoal(p => ({ ...p, price: value }));
  };

  const handleSubmitGoal = async () => {
    if (!goal.name || !goal.price) return;

    await onCreate(goal);

    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>목표 설정</DrawerHeader>

        <DrawerBody as={VStack} spacing="16px">
          <Input autoFocus name="name" value={goal.name} onChange={handleChangeGoalValue} placeholder="목표" />

          <NumberInput w="full" name="price" value={goal.price} onChange={handleChangeGoalPrice}>
            <NumberInputField placeholder="금액" />
          </NumberInput>

          <Input name="description" value={goal.description} onChange={handleChangeGoalValue} placeholder="설명" />

          <Input name="date" value={goal.date} onChange={handleChangeGoalValue} placeholder="날짜" />
        </DrawerBody>

        <DrawerFooter gap="8px">
          <Button variant="outline" colorScheme="red" onClick={onClose}>
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
