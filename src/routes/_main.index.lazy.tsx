import { createLazyFileRoute } from "@tanstack/react-router";

const MainPage = () => {
  return (
    <div>
      <p>Main Page</p>
    </div>
  );
};

export const Route = createLazyFileRoute("/_main/")({
  component: MainPage,
});
