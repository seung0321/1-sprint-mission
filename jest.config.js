module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['src/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
};
