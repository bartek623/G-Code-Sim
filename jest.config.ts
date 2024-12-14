export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    // process `*.tsx` files with `ts-jest`
  },
  moduleNameMapper: {
    '^@UI(.*)$': '<rootDir>/src/UI$1',
    '^@store(.*)$': '<rootDir>/src/store$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__ mocks __/fileMock.js',
  },
};
