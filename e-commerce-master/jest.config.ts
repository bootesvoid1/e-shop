// jest.config.unit.ts
import type { Config } from 'jest';

const config: Config = {
  // Preset for NestJS testing
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Crucial: Tell Jest how to resolve path aliases
  moduleNameMapper: {
    "^@app/shared/(.*)$": "<rootDir>/libs/shared/src/$1"
  },
  // How to transform files before running tests
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // File patterns to look for tests
  // This array will match files ending in .spec.ts OR .e2e-spec.ts
  testRegex:  '.*\\.spec\\.ts$',
     
  // File extensions Jest will resolve
  moduleFileExtensions: ['js', 'json', 'ts'],
  // Root directory for tests (adjust if needed, <rootDir> is the default)
  roots: ['<rootDir>'],
  // Ensure mocks are cleared between tests
  clearMocks: true,
  // Collect coverage from these files (optional)
  collectCoverageFrom: [
    'apps/**/*.(t|j)s',
    'libs/**/*.(t|j)s',
  ],
  // Directory for coverage reports (optional)
  coverageDirectory: './coverage',
};

export default config;