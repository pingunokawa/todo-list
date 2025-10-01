module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ["json", "lcov", "text", "cobertura"],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
      "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/swagger.ts",
      "!src/**/databases/*.ts"
    ]
};