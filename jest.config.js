module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/', '<rootDir>/test/'],
  setupFilesAfterEnv: ['jest-extended/all'],
  bail: 1,
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
  clearMocks: true,
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  globals: {
    DataMilk2726a2a1z_info: {
      magicFetchTimestampMs: 100123,
      magicVersion: '1234567893',
    },
  },
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
