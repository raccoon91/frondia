import { createLazyFileRoute } from "@tanstack/react-router";

const HomePage = () => {
  return (
    <div>
      <p>Hello World</p>
    </div>
  );
};

export const Route = createLazyFileRoute("/")({
  component: HomePage,
});
