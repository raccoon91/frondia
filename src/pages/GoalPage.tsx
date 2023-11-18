import { SyntheticEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { isNil } from "lodash-es";
import { VscChromeClose } from "react-icons/vsc";
import { useGoalStore } from "@/stores";
import { GoalDrawer } from "@/components/goal";
import { Card } from "@/components";

export const GoalPage = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedGoal, setSelectedGaol] = useState<IGoal | null>(null);
  const { goals, getGoals, postGoal, deleteGoal } = useGoalStore(state => ({
    goals: state.goals,
    getGoals: state.getGoals,
    postGoal: state.postGoal,
    deleteGoal: state.deleteGoal,
  }));

  useEffect(() => {
    getGoals();
  }, [getGoals]);

  const handleOpenDrawer = () => {
    setIsOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  const handleOpenModal = (e: SyntheticEvent<HTMLButtonElement>) => {
    const goalId = e.currentTarget.dataset["goalId"];

    const goal = goals.find(goal => goal.id?.toString() === goalId);

    if (!goal) return;

    setSelectedGaol(goal);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedGaol(null);
    setIsOpenModal(false);
  };

  const handleDeleteGoal = async () => {
    if (!selectedGoal || isNil(selectedGoal.id)) return;

    await deleteGoal(selectedGoal.id);
    await getGoals();

    setSelectedGaol(null);
    setIsOpenModal(false);
  };

  const handleCreateGoal = async (goal: Omit<IGoal, "user_id">) => {
    const res = await postGoal(goal);

    if (res === 200) {
      await getGoals();
    }
  };

  return (
    <Box p="50px">
      <Modal size="xs" isOpen={isOpenModal} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p="24px 24px 16px 24px">
            <Text fontWeight="semibold">목표 제거하기</Text>
          </ModalBody>

          <ModalFooter gap="16px">
            <Button size="sm" variant="ghost" colorScheme="blue" onClick={handleCloseModal}>
              취소
            </Button>

            <Button size="sm" colorScheme="red" onClick={handleDeleteGoal}>
              제거
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <GoalDrawer isOpen={isOpenDrawer} onClose={handleCloseDrawer} onCreate={handleCreateGoal} />

      <Flex justify="end">
        <Button onClick={handleOpenDrawer}>목표 추가하기</Button>
      </Flex>

      <Wrap>
        {goals.map(goal => (
          <Card
            key={goal.id}
            title={goal.name}
            rightAction={
              <IconButton
                size="sm"
                aria-label="delete goal"
                colorScheme="black"
                variant="ghost"
                data-goal-id={goal.id}
                icon={<Icon boxSize="20px" as={VscChromeClose} />}
                onClick={handleOpenModal}
              />
            }
          >
            <VStack w="300px" align="stretch">
              <Text>{goal.description}</Text>
              <Text fontWeight="semibold" align="end">
                {goal.price.toLocaleString()} 원
              </Text>
              <Text align="end">{goal.date}</Text>
            </VStack>
          </Card>
        ))}
      </Wrap>
    </Box>
  );
};
