// src\tests\always-pass.test.ts

import { describe, it, expect } from "vitest";

describe("Trivial test", () => {
  it("always passes", () => {
    expect(true).toBe(true);
  });
});
