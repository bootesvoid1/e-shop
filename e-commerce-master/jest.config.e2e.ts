// jest.config.unit.ts (or better, create jest.config.e2e.ts)
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@app/shared/(.*)$": "<rootDir>/libs/shared/src/$1"
    // Add other aliases if needed
  },
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // Change this line to find only .e2e-spec.ts files
  testRegex: '.*\\.e2e-spec\\.ts$', // This will match files like product.e2e-spec.ts
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['<rootDir>'],
  clearMocks: true,
  // Optionally adjust coverage settings if needed for E2E tests
  collectCoverageFrom: [
    'apps/**/*.(t|j)s',
    'libs/**/*.(t|j)s',
  ],
  coverageDirectory: './coverage',
};

export default config;