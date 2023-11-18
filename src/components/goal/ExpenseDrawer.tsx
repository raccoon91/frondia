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

interface IExpenseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (expense: Omit<IExpense, "user_id">) => Promise<void>;
}

export const ExpenseDrawer: FC<IExpenseDrawerProps> = ({ isOpen, onClose, onCreate }) => {
  const [expense, setExpense] = useState({ name: "", price: "", description: "", date: "" });

  const handleChangeExpenseValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setExpense(p => ({ ...p, [name]: value }));
  };

  const handleChangeExpensePrice = (value: string) => {
    setExpense(p => ({ ...p, price: value }));
  };

  const handleSubmitExpense = async () => {
    if (!expense.name || !expense.price) return;

    await onCreate(expense);

    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>목표 설정</DrawerHeader>

        <DrawerBody as={VStack} spacing="16px">
          <Input autoFocus name="name" value={expense.name} onChange={handleChangeExpenseValue} placeholder="목표" />

          <NumberInput w="full" name="price" value={expense.price} onChange={handleChangeExpensePrice}>
            <NumberInputField placeholder="금액" />
          </NumberInput>

          <Input
            name="description"
            value={expense.description}
            onChange={handleChangeExpenseValue}
            placeholder="설명"
          />

          <Input name="date" value={expense.date} onChange={handleChangeExpenseValue} placeholder="날짜" />
        </DrawerBody>

        <DrawerFooter gap="8px">
          <Button variant="outline" colorScheme="red" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={handleSubmitExpense}>
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
