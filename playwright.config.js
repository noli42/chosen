const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./test/browser",
  timeout: 10000,
  use: {
    ...devices["Desktop Chrome"],
    browserName: "chromium"
  }
});
