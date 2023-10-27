import { ChangeEvent, FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Center, Heading, Input, VStack } from "@chakra-ui/react";
import { useAuthStore } from "@/stores";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore(state => ({ login: state.login }));

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmitLogin: FormEventHandler<HTMLDivElement> = async e => {
    e.preventDefault();

    const res = await login(email, password);

    if (res?.status !== "ok") return;

    navigate("/");
  };

  return (
    <Center w="100vw" h="100vh" bg="background">
      <VStack
        as="form"
        align="stretch"
        spacing="20px"
        w="400px"
        p="30px"
        bg="surface"
        border="1px solid"
        borderColor="border"
        rounded="md"
        shadow="md"
        onSubmit={handleSubmitLogin}
      >
        <Heading mb="40px" textAlign="center">
          Welcome
        </Heading>

        <Input type="email" value={email} onChange={handleChangeEmail} placeholder="Email" autoFocus />
        <Input type="password" value={password} onChange={handleChangePassword} placeholder="Password" />

        <Button type="submit" mt="30px">
          Log In
        </Button>
      </VStack>
    </Center>
  );
};
