import { createLazyFileRoute } from "@tanstack/react-router";

const LoginPage = () => {
  return (
    <div>
      <p>Login Page</p>
    </div>
  );
};

export const Route = createLazyFileRoute("/_auth/login")({
  component: LoginPage,
});
