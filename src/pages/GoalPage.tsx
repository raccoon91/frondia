import { useEffect, useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useGoalStore } from "@/stores";
import { GoalDrawer } from "@/components/goal";

export const GoalPage = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const { getGoals } = useGoalStore(state => ({
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

  return (
    <Box p="50px">
      <GoalDrawer isOpen={isOpenDrawer} onClose={handleCloseDrawer} />

      <Flex justify="end">
        <Button onClick={handleOpenDrawer}>목표 추가하기</Button>
      </Flex>

      <p>goal</p>
    </Box>
  );
};
