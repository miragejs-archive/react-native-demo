const jestPreset = require("@testing-library/react-native/jest-preset");

module.exports = {
  preset: "@testing-library/react-native",
  setupFiles: [...jestPreset.setupFiles],
  setupFilesAfterEnv: ["./jest.setup.js"]
};
