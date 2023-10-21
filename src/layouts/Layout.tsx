import { Box, Flex } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuthStore } from "../stores";
import { useCallback, useEffect } from "react";

export const Layout = () => {
  const navigate = useNavigate();
  const { user, getUser } = useAuthStore(state => ({ user: state.user, getUser: state.getUser }));

  const authCheck = useCallback(async () => {
    if (user) return;

    const res = await getUser();

    if (res?.status === "ok") return;

    navigate("/login");
  }, [user, getUser]);

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  return (
    <Flex align="stretch" w="100vw" h="100vh" bg="background">
      <Sidebar />

      <Box overflow="auto" flex="1">
        <Outlet />
      </Box>
    </Flex>
  );
};
