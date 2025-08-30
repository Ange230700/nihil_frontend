// src\tests\msw\server.ts

import { setupServer } from "msw/node";
import { defaultHandlers } from "./standard-handlers";
import { postHandlers } from "./posts-handlers";

export const server = setupServer(
  ...defaultHandlers, // csrf, etc.
  ...postHandlers, // posts
);
