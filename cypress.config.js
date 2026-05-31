const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'oyxf3x',
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    retries: { runMode: 2, openMode: 0 },
  },
})