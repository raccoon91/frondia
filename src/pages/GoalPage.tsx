import { useEffect, useState } from "react";
import { Box, Button, Flex, Text, VStack, Wrap } from "@chakra-ui/react";
import { useGoalStore } from "@/stores";
import { GoalDrawer } from "@/components/goal";
import { Card } from "@/components";

export const GoalPage = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const { goals, getGoals, postGoal } = useGoalStore(state => ({
    goals: state.goals,
    getGoals: state.getGoals,
    postGoal: state.postGoal,
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

  const handleCreateGoal = async (goal: Omit<IGoal, "user_id">) => {
    const res = await postGoal(goal);

    if (res === 200) {
      await getGoals();
    }
  };

  return (
    <Box p="50px">
      <GoalDrawer isOpen={isOpenDrawer} onClose={handleCloseDrawer} onCreate={handleCreateGoal} />

      <Flex justify="end">
        <Button onClick={handleOpenDrawer}>목표 추가하기</Button>
      </Flex>

      <Wrap>
        {goals.map(goal => (
          <Card key={goal.id} title={goal.name}>
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
