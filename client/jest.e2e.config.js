module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.js'],
  testMatch: [
    '<rootDir>/tests/e2e/**/*.test.js'
  ],
  testTimeout: 60000, // 60 seconds for E2E tests
  verbose: true,
  globalSetup: '<rootDir>/tests/e2e/globalSetup.js',
  globalTeardown: '<rootDir>/tests/e2e/globalTeardown.js'
}; 