// src\tests\utils\faker.ts

import { faker as baseFaker } from "@faker-js/faker";

// One seed for the whole test run = deterministic fixtures
baseFaker.seed(20250830);

export const faker = baseFaker;
