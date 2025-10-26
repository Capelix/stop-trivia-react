const { device, element, by, waitFor, expect } = require("detox")

/**
 * Test utilities and helper functions for Stop Trivia E2E tests
 */
class TestUtils {
  /**
   * Wait for element to be visible with custom timeout
   * @param {string} testID - Test ID of the element
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   */
  static async waitForElement(testID, timeout = 10000) {
    await waitFor(element(by.id(testID)))
      .toBeVisible()
      .withTimeout(timeout)
  }

  /**
   * Wait for element to not be visible
   * @param {string} testID - Test ID of the element
   * @param {number} timeout - Timeout in milliseconds (default: 5000)
   */
  static async waitForElementToDisappear(testID, timeout = 5000) {
    await waitFor(element(by.id(testID)))
      .not.toBeVisible()
      .withTimeout(timeout)
  }

  /**
   * Tap element by test ID
   * @param {string} testID - Test ID of the element
   */
  static async tapElement(testID) {
    await element(by.id(testID)).tap()
  }

  /**
   * Type text into element by test ID
   * @param {string} testID - Test ID of the element
   * @param {string} text - Text to type
   */
  static async typeText(testID, text) {
    await element(by.id(testID)).typeText(text)
  }

  /**
   * Clear text from element by test ID
   * @param {string} testID - Test ID of the element
   */
  static async clearText(testID) {
    await element(by.id(testID)).clearText()
  }

  /**
   * Check if element has specific text
   * @param {string} testID - Test ID of the element
   * @param {string} text - Expected text
   */
  static async expectElementToHaveText(testID, text) {
    await expect(element(by.id(testID))).toHaveText(text)
  }

  /**
   * Check if element is visible
   * @param {string} testID - Test ID of the element
   */
  static async expectElementToBeVisible(testID) {
    await expect(element(by.id(testID))).toBeVisible()
  }

  /**
   * Check if element is not visible
   * @param {string} testID - Test ID of the element
   */
  static async expectElementToNotBeVisible(testID) {
    await expect(element(by.id(testID))).not.toBeVisible()
  }

  /**
   * Navigate to specific tab
   * @param {string} tabName - Name of the tab ('stop' or 'ttt')
   */
  static async navigateToTab(tabName) {
    await this.tapElement(`${tabName}-tab`)
    await this.waitForElement(`${tabName}-screen`)
  }

  /**
   * Navigate to settings screen
   */
  static async navigateToSettings() {
    await this.tapElement("settings-button")
    await this.waitForElement("settings-screen")
  }

  /**
   * Start offline Stop game
   */
  static async startOfflineStopGame() {
    await this.tapElement("offline-mode-button")
    await this.waitForElement("stop-game-screen")
  }

  /**
   * Start offline TTT game
   */
  static async startOfflineTTTGame() {
    await this.tapElement("ttt-offline-mode-button")
    await this.waitForElement("ttt-game-screen")
  }

  /**
   * Fill Stop game inputs
   * @param {Object} inputs - Object containing input values
   */
  static async fillStopGameInputs(inputs) {
    const inputFields = [
      "name",
      "lastName",
      "country",
      "color",
      "animal",
      "artist",
      "food",
      "fruit",
      "object",
      "profession",
    ]

    for (const field of inputFields) {
      if (inputs[field]) {
        await this.typeText(`${field}-input`, inputs[field])
      }
    }
  }

  /**
   * Make TTT move
   * @param {number} squareIndex - Index of the square (0-8)
   */
  static async makeTTTMove(squareIndex) {
    await this.tapElement(`ttt-square-${squareIndex}`)
  }

  /**
   * Add points in Stop game
   * @param {number} points - Points to add
   */
  static async addPoints(points) {
    await this.tapElement(`points-${points}-button`)
  }

  /**
   * Restart Stop game
   */
  static async restartStopGame() {
    await this.tapElement("restart-button")
    await this.waitForElement("restart-confirm-modal")
    await this.tapElement("confirm-restart-button")
  }

  /**
   * Restart TTT game
   */
  static async restartTTTGame() {
    await this.tapElement("ttt-restart-button")
  }

  /**
   * Handle modal confirmation
   * @param {string} modalTestID - Test ID of the modal
   * @param {string} confirmButtonTestID - Test ID of the confirm button
   */
  static async confirmModal(modalTestID, confirmButtonTestID) {
    await this.waitForElement(modalTestID)
    await this.tapElement(confirmButtonTestID)
    await this.waitForElementToDisappear(modalTestID)
  }

  /**
   * Wait for and dismiss error message
   * @param {number} timeout - Timeout in milliseconds (default: 5000)
   */
  static async waitForErrorMessage(timeout = 5000) {
    await this.waitForElement("error-message", timeout)
  }

  /**
   * Simulate network disconnection
   */
  static async simulateNetworkDisconnection() {
    await device.setURLBlacklist([".*"])
  }

  /**
   * Restore network connection
   */
  static async restoreNetworkConnection() {
    await device.clearURLBlacklist()
  }

  /**
   * Background and foreground app
   */
  static async backgroundAndForegroundApp() {
    await device.sendToHome()
    await device.launchApp()
  }

  /**
   * Reload React Native app
   */
  static async reloadApp() {
    await device.reloadReactNative()
  }

  /**
   * Launch app with new instance
   */
  static async launchApp() {
    await device.launchApp({ newInstance: true })
  }

  /**
   * Wait for app to be ready
   */
  static async waitForAppReady() {
    await this.waitForElement("main-tabs", 15000)
  }

  /**
   * Take screenshot for debugging
   * @param {string} name - Name for the screenshot
   */
  static async takeScreenshot(name) {
    await device.takeScreenshot(`${name}.png`)
  }

  /**
   * Wait for specific time
   * @param {number} ms - Milliseconds to wait
   */
  static async wait(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Generate random game code
   * @returns {string} Random 6-character code
   */
  static generateRandomGameCode() {
    const chars = "abcdefghijklmnopqrstuvwxyz"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * Test invalid game codes
   */
  static getInvalidGameCodes() {
    return ["123", "abc", "12345", "abcdefg", "1234567"]
  }

  /**
   * Test valid game code format
   */
  static getValidGameCode() {
    return "abcdef"
  }

  /**
   * Get sample Stop game inputs
   */
  static getSampleStopInputs() {
    return {
      name: "John",
      lastName: "Doe",
      country: "USA",
      color: "Blue",
      animal: "Dog",
      artist: "Picasso",
      food: "Pizza",
      fruit: "Apple",
      object: "Phone",
      profession: "Doctor",
    }
  }

  /**
   * Get TTT winning combinations
   */
  static getTTTWinningCombinations() {
    return [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal
      [2, 4, 6], // Anti-diagonal
    ]
  }

  /**
   * Create TTT winning scenario
   * @param {number} combinationIndex - Index of winning combination
   * @returns {Array} Array of moves to create winning scenario
   */
  static createTTTWinningScenario(combinationIndex = 0) {
    const combinations = this.getTTTWinningCombinations()
    const combination = combinations[combinationIndex]

    // Create moves where X wins
    const moves = []
    for (let i = 0; i < combination.length; i++) {
      moves.push({ square: combination[i], player: "X" })
      if (i < combination.length - 1) {
        // Add O move between X moves
        const availableSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(
          (sq) => !combination.slice(0, i + 1).includes(sq)
        )
        if (availableSquares.length > 0) {
          moves.push({ square: availableSquares[0], player: "O" })
        }
      }
    }

    return moves
  }

  /**
   * Measure performance of an operation
   * @param {Function} operation - Function to measure
   * @returns {number} Execution time in milliseconds
   */
  static async measurePerformance(operation) {
    const startTime = Date.now()
    await operation()
    const endTime = Date.now()
    return endTime - startTime
  }

  /**
   * Retry operation with exponential backoff
   * @param {Function} operation - Function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} baseDelay - Base delay in milliseconds
   */
  static async retryOperation(operation, maxRetries = 3, baseDelay = 1000) {
    let lastError

    for (let i = 0; i < maxRetries; i++) {
      try {
        await operation()
        return
      } catch (error) {
        lastError = error
        if (i < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, i)
          await this.wait(delay)
        }
      }
    }

    throw lastError
  }

  /**
   * Clean up test state
   */
  static async cleanup() {
    try {
      await this.restoreNetworkConnection()
      await this.reloadApp()
    } catch (error) {
      console.warn("Cleanup warning:", error.message)
    }
  }
}

module.exports = TestUtils
