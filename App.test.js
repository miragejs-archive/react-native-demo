// src/__tests__/App.test.js
import React from "react";
import { render, waitForElement, wait } from "@testing-library/react-native";
import App from "./App";
import { makeServer } from "./server";
import { Response } from "miragejs";

let server;

beforeEach(() => {
  server = makeServer({ environment: "test" });
});

afterEach(() => {
  server.shutdown();
});

it("shows the users from our server", async () => {
  server.create("user", { name: "Luke" });
  server.create("user", { name: "Leia" });

  const { getByTestId } = render(<App />);
  await waitForElement(() => getByTestId("user-1"));
  await waitForElement(() => getByTestId("user-2"));

  expect(getByTestId("user-1-name")).toHaveTextContent("Luke");
  expect(getByTestId("user-2-name")).toHaveTextContent("Leia");
});

it("shows a message if there are no users", async () => {
  // Don't create any users

  const { getByTestId } = render(<App />);
  await waitForElement(() => getByTestId("no-users"));

  expect(getByTestId("no-users")).toHaveTextContent("No users!");

  // let the component finish rendering
  await wait();
});

it("handles error responses from the server", async () => {
  // Override Mirage's route handler for /users, just for this test
  server.get("/api/users", () => {
    return new Response(
      500,
      {},
      {
        error: "The database is on vacation."
      }
    );
  });

  const { getByTestId } = render(<App />);

  await waitForElement(() => getByTestId("server-error"));

  expect(getByTestId("server-error")).toHaveTextContent(
    "The database is on vacation."
  );
});
