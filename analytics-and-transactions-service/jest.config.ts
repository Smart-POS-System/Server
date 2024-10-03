import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Optional settings (e.g., specify test patterns or coverage)
  // testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  // collectCoverage: true,
};

export default config;
