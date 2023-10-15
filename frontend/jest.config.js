/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: false,
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "@externals/(.*)": "<rootDir>/externals/$1",
  },
  moduleDirectories: ["node_modules", "src", "externals"],
  moduleFileExtensions: ["js", "ts", "tsx"],
};
