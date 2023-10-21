import { Text, VStack, Wrap } from "@chakra-ui/react";
import { useGoalStore } from "../stores";
import { useEffect } from "react";
import { Card } from "../components";

export const DashboardPage = () => {
  const { goals, getGoalsData } = useGoalStore(state => ({ goals: state.goals, getGoalsData: state.getGoalsData }));

  useEffect(() => {
    getGoalsData();
  }, []);

  return (
    <Wrap p="50px" spacing="30px">
      {goals.map(goal => (
        <Card key={goal.id}>
          <VStack align="stretch" spacing="10px" w="300px" p="10px">
            <Text mb="10px">{goal.name}</Text>
            <Text align="right">{goal.price}</Text>
            <Text align="right">{goal.due_date}</Text>
          </VStack>
        </Card>
      ))}
    </Wrap>
  );
};
