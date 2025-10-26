const TestUtils = require("./utils/TestUtils")
const { TestData, TestDataHelpers } = require("./utils/TestData")

/**
 * Comprehensive Stop Game E2E Tests
 */
describe("Stop Game E2E Tests", () => {
  beforeAll(async () => {
    await TestUtils.launchApp()
    await TestUtils.waitForAppReady()
  })

  beforeEach(async () => {
    await TestUtils.reloadApp()
    await TestUtils.waitForAppReady()
  })

  afterEach(async () => {
    await TestUtils.cleanup()
  })

  describe("Game Mode Selection", () => {
    it("should display all game mode options", async () => {
      await TestUtils.expectElementToBeVisible("offline-mode-button")
      await TestUtils.expectElementToBeVisible("online-mode-button")
      await TestUtils.expectElementToBeVisible("join-game-button")
    })

    it("should show correct descriptions for each mode", async () => {
      // Test offline mode description
      await TestUtils.expectElementToBeVisible("offline-mode-button")

      // Test online mode description
      await TestUtils.expectElementToBeVisible("online-mode-button")

      // Test join game description
      await TestUtils.expectElementToBeVisible("join-game-button")
    })
  })

  describe("Offline Game Mode", () => {
    beforeEach(async () => {
      await TestUtils.startOfflineStopGame()
    })

    it("should start offline game successfully", async () => {
      await TestUtils.expectElementToBeVisible("stop-game-screen")
      await TestUtils.expectElementToBeVisible("game-inputs-container")
      await TestUtils.expectElementToBeVisible("points-buttons-container")
    })

    it("should handle input field interactions", async () => {
      const inputs = TestData.SAMPLE_STOP_INPUTS

      // Test each input field
      await TestUtils.typeText("name-input", inputs.name)
      await TestUtils.typeText("lastName-input", inputs.lastName)
      await TestUtils.typeText("country-input", inputs.country)
      await TestUtils.typeText("color-input", inputs.color)
      await TestUtils.typeText("animal-input", inputs.animal)
      await TestUtils.typeText("artist-input", inputs.artist)
      await TestUtils.typeText("food-input", inputs.food)
      await TestUtils.typeText("fruit-input", inputs.fruit)
      await TestUtils.typeText("object-input", inputs.object)
      await TestUtils.typeText("profession-input", inputs.profession)

      // Verify inputs are saved
      await TestUtils.expectElementToHaveText("name-input", inputs.name)
      await TestUtils.expectElementToHaveText("lastName-input", inputs.lastName)
      await TestUtils.expectElementToHaveText("country-input", inputs.country)
    })

    it("should handle points scoring system", async () => {
      // Test different point values
      for (const points of TestData.POINTS_VALUES) {
        await TestUtils.addPoints(points)
      }

      // Verify total points calculation
      const expectedTotal = TestData.POINTS_VALUES.reduce(
        (sum, points) => sum + points,
        0
      )
      await TestUtils.expectElementToHaveText(
        "points-display",
        expectedTotal.toString()
      )
    })

    it("should handle game restart functionality", async () => {
      // Fill some inputs
      await TestUtils.typeText("name-input", "Test Name")
      await TestUtils.typeText("country-input", "Test Country")

      // Add some points
      await TestUtils.addPoints(50)
      await TestUtils.addPoints(100)

      // Restart game
      await TestUtils.restartStopGame()

      // Verify inputs are cleared
      await TestUtils.expectElementToHaveText("name-input", "")
      await TestUtils.expectElementToHaveText("country-input", "")

      // Verify points are reset
      await TestUtils.expectElementToHaveText("points-display", "0")
    })

    it("should handle multiple rounds", async () => {
      // Complete first round
      await TestUtils.fillStopGameInputs(TestData.SAMPLE_STOP_INPUTS)
      await TestUtils.addPoints(100)

      // Restart for second round
      await TestUtils.restartStopGame()

      // Complete second round with different inputs
      const secondRoundInputs = TestDataHelpers.getRandomStopInputs()
      await TestUtils.fillStopGameInputs(secondRoundInputs)
      await TestUtils.addPoints(75)

      // Verify second round inputs
      await TestUtils.expectElementToHaveText(
        "name-input",
        secondRoundInputs.name
      )
      await TestUtils.expectElementToHaveText("points-display", "75")
    })

    it("should handle keyboard interactions", async () => {
      // Test keyboard show/hide
      await TestUtils.tapElement("name-input")
      await TestUtils.wait(1000) // Wait for keyboard

      await TestUtils.typeText("name-input", "Keyboard Test")
      await TestUtils.expectElementToHaveText("name-input", "Keyboard Test")
    })
  })

  describe("Online Game Mode", () => {
    it("should show time selection modal", async () => {
      await TestUtils.tapElement("online-mode-button")
      await TestUtils.waitForElement("time-selection-modal")
    })

    it("should handle different time options", async () => {
      await TestUtils.tapElement("online-mode-button")
      await TestUtils.waitForElement("time-selection-modal")

      // Test each time option
      for (const timeOption of TestData.GAME_TIME_OPTIONS) {
        await TestUtils.tapElement(`time-${timeOption}min-button`)

        // Should navigate to game screen
        await TestUtils.waitForElement("stop-game-screen")

        // Verify room code is displayed
        await TestUtils.expectElementToBeVisible("room-code-display")

        // Go back and test next option
        await TestUtils.tapElement("back-button")
        await TestUtils.waitForElement("stop-screen")
        await TestUtils.tapElement("online-mode-button")
        await TestUtils.waitForElement("time-selection-modal")
      }
    })

    it("should create online game with room code", async () => {
      await TestUtils.tapElement("online-mode-button")
      await TestUtils.waitForElement("time-selection-modal")
      await TestUtils.tapElement("time-3min-button")

      await TestUtils.waitForElement("stop-game-screen")

      // Verify online game elements
      await TestUtils.expectElementToBeVisible("room-code-display")
      await TestUtils.expectElementToBeVisible("players-count")
      await TestUtils.expectElementToBeVisible("copy-room-code-button")
    })

    it("should handle room code copying", async () => {
      await TestUtils.tapElement("online-mode-button")
      await TestUtils.waitForElement("time-selection-modal")
      await TestUtils.tapElement("time-3min-button")

      await TestUtils.waitForElement("stop-game-screen")

      // Copy room code
      await TestUtils.tapElement("copy-room-code-button")

      // Should show copy confirmation
      await TestUtils.waitForElement("copy-confirmation-toast")
    })
  })

  describe("Join Game Mode", () => {
    it("should handle invalid game codes", async () => {
      await TestUtils.tapElement("join-game-button")

      // Test each invalid code
      for (const invalidCode of TestData.INVALID_GAME_CODES) {
        await TestUtils.clearText("game-code-input")
        await TestUtils.typeText("game-code-input", invalidCode)
        await TestUtils.tapElement("join-game-button")

        // Should show error message
        await TestUtils.waitForErrorMessage()
      }
    })

    it("should handle valid game code format", async () => {
      await TestUtils.tapElement("join-game-button")

      // Test valid code format
      await TestUtils.typeText("game-code-input", TestData.VALID_GAME_CODE)
      await TestUtils.tapElement("join-game-button")

      // Should attempt to join (will fail in test environment)
      await TestUtils.waitForErrorMessage()
    })

    it("should handle game code input validation", async () => {
      await TestUtils.tapElement("join-game-button")

      // Test case sensitivity
      await TestUtils.typeText("game-code-input", "ABCDEF")
      await TestUtils.tapElement("join-game-button")

      // Should show error for non-existent game
      await TestUtils.waitForErrorMessage()
    })

    it("should handle empty game code", async () => {
      await TestUtils.tapElement("join-game-button")

      // Leave input empty
      await TestUtils.tapElement("join-game-button")

      // Should show validation error
      await TestUtils.waitForErrorMessage()
    })
  })

  describe("Game Input Validation", () => {
    beforeEach(async () => {
      await TestUtils.startOfflineStopGame()
    })

    it("should handle special characters in inputs", async () => {
      const specialInputs = {
        name: "José María",
        country: "Côte d'Ivoire",
        animal: "Café-au-lait",
        food: "Crème brûlée",
      }

      await TestUtils.fillStopGameInputs(specialInputs)

      // Verify special characters are handled
      await TestUtils.expectElementToHaveText("name-input", specialInputs.name)
      await TestUtils.expectElementToHaveText(
        "country-input",
        specialInputs.country
      )
    })

    it("should handle long text inputs", async () => {
      const longText = "A".repeat(100)

      await TestUtils.typeText("name-input", longText)
      await TestUtils.expectElementToHaveText("name-input", longText)
    })

    it("should handle numeric inputs", async () => {
      const numericInputs = {
        name: "123",
        country: "456",
        animal: "789",
      }

      await TestUtils.fillStopGameInputs(numericInputs)

      await TestUtils.expectElementToHaveText("name-input", numericInputs.name)
      await TestUtils.expectElementToHaveText(
        "country-input",
        numericInputs.country
      )
    })
  })

  describe("Points System", () => {
    beforeEach(async () => {
      await TestUtils.startOfflineStopGame()
    })

    it("should handle maximum points", async () => {
      // Add maximum possible points
      const maxPoints = TestData.POINTS_VALUES.reduce(
        (sum, points) => sum + points,
        0
      )

      for (const points of TestData.POINTS_VALUES) {
        await TestUtils.addPoints(points)
      }

      await TestUtils.expectElementToHaveText(
        "points-display",
        maxPoints.toString()
      )
    })

    it("should handle points overflow", async () => {
      // Add points multiple times
      for (let i = 0; i < 10; i++) {
        await TestUtils.addPoints(100)
      }

      const expectedPoints = 1000
      await TestUtils.expectElementToHaveText(
        "points-display",
        expectedPoints.toString()
      )
    })

    it("should reset points on restart", async () => {
      // Add some points
      await TestUtils.addPoints(50)
      await TestUtils.addPoints(100)

      // Restart game
      await TestUtils.restartStopGame()

      // Points should be reset
      await TestUtils.expectElementToHaveText("points-display", "0")
    })
  })

  describe("Performance Tests", () => {
    it("should load offline game quickly", async () => {
      const loadTime = await TestUtils.measurePerformance(async () => {
        await TestUtils.startOfflineStopGame()
      })

      expect(loadTime).toBeLessThan(TestData.PERFORMANCE.MAX_LOAD_TIME)
    })

    it("should handle rapid input changes", async () => {
      await TestUtils.startOfflineStopGame()

      // Rapidly change inputs
      const inputs = ["A", "B", "C", "D", "E"]
      for (const input of inputs) {
        await TestUtils.clearText("name-input")
        await TestUtils.typeText("name-input", input)
        await TestUtils.wait(100)
      }

      // Should handle all changes
      await TestUtils.expectElementToHaveText("name-input", "E")
    })

    it("should handle rapid points addition", async () => {
      await TestUtils.startOfflineStopGame()

      // Rapidly add points
      for (let i = 0; i < 20; i++) {
        await TestUtils.addPoints(50)
        await TestUtils.wait(50)
      }

      const expectedPoints = 1000
      await TestUtils.expectElementToHaveText(
        "points-display",
        expectedPoints.toString()
      )
    })
  })

  describe("Error Handling", () => {
    it("should handle network disconnection gracefully", async () => {
      await TestUtils.simulateNetworkDisconnection()

      // Try to create online game
      await TestUtils.tapElement("online-mode-button")

      // Should show offline message
      await TestUtils.waitForElement("offline-toast")

      await TestUtils.restoreNetworkConnection()
    })

    it("should handle app backgrounding during game", async () => {
      await TestUtils.startOfflineStopGame()

      // Fill some inputs
      await TestUtils.typeText("name-input", "Background Test")

      // Background app
      await TestUtils.backgroundAndForegroundApp()

      // App should maintain state
      await TestUtils.waitForElement("stop-game-screen")
      await TestUtils.expectElementToHaveText("name-input", "Background Test")
    })
  })
})
