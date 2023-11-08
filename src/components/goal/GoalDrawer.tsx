import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";

interface IGoalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalDrawer: FC<IGoalDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>목표 설정</DrawerHeader>

        <DrawerBody as={VStack} spacing="16px">
          <Input autoFocus placeholder="목표" />
          <Input placeholder="금액" />
          <Input placeholder="설명" />
          <Input placeholder="날짜" />
        </DrawerBody>

        <DrawerFooter gap="8px">
          <Button variant="outline" colorScheme="red" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="green">Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
