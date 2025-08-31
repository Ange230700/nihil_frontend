// src\tests\msw\server.ts

import { setupServer } from "msw/node";
import { defaultHandlers } from "./standard-handlers";
import { postHandlers } from "./posts-handlers";
import { userHandlers } from "./users-handlers";

export const server = setupServer(
  ...defaultHandlers, // csrf, etc.
  ...postHandlers, // posts
  ...userHandlers, // users
);
