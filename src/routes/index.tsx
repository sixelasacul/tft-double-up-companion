import { v4 as uuid } from "uuid";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  beforeLoad() {
    throw redirect({
      to: "/$id",
      params: {
        id: uuid(),
      },
    });
  },
});

// for now, but we could also have a landing page and have a button to start a game
function Home() {
  return <p>Loading</p>;
}
