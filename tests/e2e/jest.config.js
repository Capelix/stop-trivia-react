module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/e2e/**/*.test.js"],
  testTimeout: 120000,
  setupFilesAfterEnv: ["<rootDir>/e2e/setup.js"],
  verbose: true,
  collectCoverage: false,
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true,
}
