/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'db/db.connect.ts',
    'app.ts',
    'config.ts',
    'routers',
    'repository/user/user.m.model.ts',
    'repository/perfume/perfume.m.model.ts',
    'controllers/controller.ts',
  ],
};
