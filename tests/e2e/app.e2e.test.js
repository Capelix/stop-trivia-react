const { device, expect, element, by, waitFor } = require("detox")

describe("Stop Trivia App E2E Tests", () => {
  beforeAll(async () => {
    await device.launchApp()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  describe("App Launch and Authentication", () => {
    it("should display splash screen on app launch", async () => {
      // Wait for splash screen to appear
      await waitFor(element(by.id("splash-screen")))
        .toBeVisible()
        .withTimeout(5000)
    })

    it("should navigate to login form after splash screen", async () => {
      // Wait for login form to appear
      await waitFor(element(by.id("login-form")))
        .toBeVisible()
        .withTimeout(10000)

      // Check if login form elements are present
      await expect(element(by.id("google-signin-button"))).toBeVisible()
    })

    it("should handle Google authentication", async () => {
      await waitFor(element(by.id("login-form")))
        .toBeVisible()
        .withTimeout(10000)

      await element(by.id("google-signin-button")).tap()

      // Wait for authentication to complete and navigate to main app
      await waitFor(element(by.id("main-tabs")))
        .toBeVisible()
        .withTimeout(15000)
    })
  })

  describe("Main Navigation", () => {
    beforeEach(async () => {
      // Mock successful authentication
      await device.launchApp({ newInstance: true })
      await waitFor(element(by.id("main-tabs")))
        .toBeVisible()
        .withTimeout(10000)
    })

    it("should display main tab navigation", async () => {
      await expect(element(by.id("main-tabs"))).toBeVisible()
      await expect(element(by.id("stop-tab"))).toBeVisible()
      await expect(element(by.id("ttt-tab"))).toBeVisible()
    })

    it("should navigate between tabs", async () => {
      // Start on Stop tab
      await expect(element(by.id("stop-screen"))).toBeVisible()

      // Navigate to TTT tab
      await element(by.id("ttt-tab")).tap()
      await expect(element(by.id("ttt-screen"))).toBeVisible()

      // Navigate back to Stop tab
      await element(by.id("stop-tab")).tap()
      await expect(element(by.id("stop-screen"))).toBeVisible()
    })

    it("should display settings button in header", async () => {
      await expect(element(by.id("settings-button"))).toBeVisible()
    })

    it("should navigate to settings screen", async () => {
      await element(by.id("settings-button")).tap()
      await expect(element(by.id("settings-screen"))).toBeVisible()
    })
  })

  describe("Stop Game Features", () => {
    beforeEach(async () => {
      await device.launchApp({ newInstance: true })
      await waitFor(element(by.id("stop-screen")))
        .toBeVisible()
        .withTimeout(10000)
    })

    it("should display game mode selection", async () => {
      await expect(element(by.id("offline-mode-button"))).toBeVisible()
      await expect(element(by.id("online-mode-button"))).toBeVisible()
      await expect(element(by.id("join-game-button"))).toBeVisible()
    })

    it("should start offline game", async () => {
      await element(by.id("offline-mode-button")).tap()

      await waitFor(element(by.id("stop-game-screen")))
        .toBeVisible()
        .withTimeout(5000)

      // Check if game elements are present
      await expect(element(by.id("game-inputs-container"))).toBeVisible()
      await expect(element(by.id("points-buttons-container"))).toBeVisible()
    })

    it("should handle game input fields", async () => {
      await element(by.id("offline-mode-button")).tap()

      await waitFor(element(by.id("stop-game-screen")))
        .toBeVisible()
        .withTimeout(5000)

      // Test input fields
      const nameInput = element(by.id("name-input"))
      const countryInput = element(by.id("country-input"))

      await nameInput.typeText("John")
      await countryInput.typeText("USA")

      await expect(nameInput).toHaveText("John")
      await expect(countryInput).toHaveText("USA")
    })

    it("should handle points scoring", async () => {
      await element(by.id("offline-mode-button")).tap()

      await waitFor(element(by.id("stop-game-screen")))
        .toBeVisible()
        .withTimeout(5000)

      // Test points buttons
      await element(by.id("points-50-button")).tap()
      await element(by.id("points-100-button")).tap()

      // Check if points are displayed
      await expect(element(by.id("points-display"))).toHaveText("150")
    })

    it("should handle restart functionality", async () => {
      await element(by.id("offline-mode-button")).tap()

      await waitFor(element(by.id("stop-game-screen")))
        .toBeVisible()
        .withTimeout(5000)

      // Fill some inputs
      await element(by.id("name-input")).typeText("Test")

      // Tap restart button
      await element(by.id("restart-button")).tap()

      // Confirm restart in modal
      await waitFor(element(by.id("restart-confirm-modal")))
        .toBeVisible()
        .withTimeout(3000)

      await element(by.id("confirm-restart-button")).tap()

      // Check if inputs are cleared
      await expect(element(by.id("name-input"))).toHaveText("")
    })

    it("should handle online game creation", async () => {
      await element(by.id("online-mode-button")).tap()

      // Wait for time selection modal
      await waitFor(element(by.id("time-selection-modal")))
        .toBeVisible()
        .withTimeout(3000)

      // Select 3 minutes
      await element(by.id("time-3min-button")).tap()

      await waitFor(element(by.id("stop-game-screen")))
        .toBeVisible()
        .withTimeout(5000)

      // Check if online game elements are present
      await expect(element(by.id("room-code-display"))).toBeVisible()
      await expect(element(by.id("players-count"))).toBeVisible()
    })

    it("should handle join game functionality", async () => {
      // Test join game with invalid code
      await element(by.id("join-game-button")).tap()

      await element(by.id("game-code-input")).typeText("123")
      await element(by.id("join-game-button")).tap()

      // Should show error for invalid code length
      await waitFor(element(by.id("error-message")))
        .toBeVisible()
        .withTimeout(3000)

      // Test with valid code format
      await element(by.id("game-code-input")).clearText()
      await element(by.id("game-code-input")).typeText("abcdef")
      await element(by.id("join-game-button")).tap()

      // Should attempt to join (will fail in test environment)
      await waitFor(element(by.id("error-message")))
        .toBeVisible()
        .withTimeout(5000)
    })
  })

  describe("Tic Tac Toe Game Features", () => {
    beforeEach(async () => {
      await device.launchApp({ newInstance: true })
      await waitFor(element(by.id("main-tabs")))
        .toBeVisible()
        .withTimeout(10000)

      await element(by.id("ttt-tab")).tap()
      await waitFor(element(by.id("ttt-screen")))
        .toBeVisible()
        .withTimeout(5000)
    })

    it("should display TTT game mode selection", async () => {
      await expect(element(by.id("ttt-offline-mode-button"))).toBeVisible()
    })

    it("should start offline TTT game", async () => {
      await element(by.id("ttt-offline-mode-button")).tap()

      await waitFor(element(by.id("ttt-game-screen")))
        .toBeVisible()
        .withTimeout(5000)

      // Check if game board is present
      await expect(element(by.id("ttt-game-board"))).toBeVisible()
      await expect(element(by.id("current-player-display"))).toBeVisible()
    })

    it("should handle TTT game moves", async () => {
      await element(by.id("ttt-offline-mode-button")).tap()

      await waitFor(element(by.id("ttt-game-screen")))
        .toBeVisible()
        .withTimeout(5000)

      // Make moves on the board
      await element(by.id("ttt-square-0")).tap()
      await element(by.id("ttt-square-1")).tap()
      await element(by.id("ttt-square-2")).tap()

      // Check if moves are displayed
      await expect(element(by.id("ttt-square-0"))).toHaveText("X")
      await expect(element(by.id("ttt-square-1"))).toHaveText("O")
      await expect(element(by.id("ttt-square-2"))).toHaveText("X")
    })

    it("should handle TTT game restart", async () => {
      await element(by.id("ttt-offline-mode-button")).tap()

      await waitFor(element(by.id("ttt-game-screen")))
        .toBeVisible()
        .withTimeout(5000)

      // Make some moves
      await element(by.id("ttt-square-0")).tap()
      await element(by.id("ttt-square-1")).tap()

      // Restart game
      await element(by.id("ttt-restart-button")).tap()

      // Check if board is cleared
      await expect(element(by.id("ttt-square-0"))).toHaveText("")
      await expect(element(by.id("ttt-square-1"))).toHaveText("")
    })

    it("should detect winning condition", async () => {
      await element(by.id("ttt-offline-mode-button")).tap()

      await waitFor(element(by.id("ttt-game-screen")))
        .toBeVisible()
        .withTimeout(5000)

      // Create winning condition for X
      await element(by.id("ttt-square-0")).tap() // X
      await element(by.id("ttt-square-3")).tap() // O
      await element(by.id("ttt-square-1")).tap() // X
      await element(by.id("ttt-square-4")).tap() // O
      await element(by.id("ttt-square-2")).tap() // X - wins!

      // Check if winner is displayed
      await waitFor(element(by.id("winner-display")))
        .toBeVisible()
        .withTimeout(3000)

      await expect(element(by.id("winner-display"))).toHaveText("X Win")
    })
  })

  describe("Settings Screen", () => {
    beforeEach(async () => {
      await device.launchApp({ newInstance: true })
      await waitFor(element(by.id("main-tabs")))
        .toBeVisible()
        .withTimeout(10000)

      await element(by.id("settings-button")).tap()
      await waitFor(element(by.id("settings-screen")))
        .toBeVisible()
        .withTimeout(5000)
    })

    it("should display user profile section", async () => {
      await expect(element(by.id("user-profile-section"))).toBeVisible()
      await expect(element(by.id("user-name-display"))).toBeVisible()
      await expect(element(by.id("user-email-display"))).toBeVisible()
      await expect(element(by.id("user-id-display"))).toBeVisible()
    })

    it("should handle vibration toggle", async () => {
      const vibrationSwitch = element(by.id("vibration-switch"))

      await expect(vibrationSwitch).toBeVisible()

      // Toggle vibration off
      await vibrationSwitch.tap()

      // Toggle vibration on
      await vibrationSwitch.tap()
    })

    it("should handle language selection", async () => {
      await element(by.id("language-button")).tap()

      // Wait for language selection modal
      await waitFor(element(by.id("language-selection-modal")))
        .toBeVisible()
        .withTimeout(3000)

      // Select Spanish
      await element(by.id("language-spanish-option")).tap()

      // Modal should close
      await waitFor(element(by.id("language-selection-modal")))
        .not.toBeVisible()
        .withTimeout(3000)
    })

    it("should handle app sharing", async () => {
      await element(by.id("share-app-button")).tap()

      // Share modal should appear (handled by system)
      // In test environment, this will be mocked
    })

    it("should handle external links", async () => {
      // Test rate game button
      await element(by.id("rate-game-button")).tap()

      // Test website button
      await element(by.id("website-button")).tap()

      // Test privacy policy button
      await element(by.id("privacy-policy-button")).tap()

      // Test terms and conditions button
      await element(by.id("terms-conditions-button")).tap()

      // Test GitHub button
      await element(by.id("github-button")).tap()

      // Test feedback button
      await element(by.id("feedback-button")).tap()
    })

    it("should handle sign out", async () => {
      await element(by.id("sign-out-button")).tap()

      // Should navigate back to login screen
      await waitFor(element(by.id("login-form")))
        .toBeVisible()
        .withTimeout(5000)
    })

    it("should handle profile image upload", async () => {
      await element(by.id("profile-image-button")).tap()

      // Image picker should open (mocked in test environment)
      // Wait for upload modal
      await waitFor(element(by.id("image-upload-modal")))
        .toBeVisible()
        .withTimeout(3000)

      // Confirm upload
      await element(by.id("confirm-upload-button")).tap()

      // Modal should close
      await waitFor(element(by.id("image-upload-modal")))
        .not.toBeVisible()
        .withTimeout(5000)
    })
  })

  describe("App State Management", () => {
    it("should handle app backgrounding and foregrounding", async () => {
      await device.launchApp({ newInstance: true })
      await waitFor(element(by.id("main-tabs")))
        .toBeVisible()
        .withTimeout(10000)

      // Background the app
      await device.sendToHome()

      // Foreground the app
      await device.launchApp()

      // App should still be in the same state
      await waitFor(element(by.id("main-tabs")))
        .toBeVisible()
        .withTimeout(5000)
    })

    it("should handle network connectivity changes", async () => {
      await device.launchApp({ newInstance: true })
      await waitFor(element(by.id("main-tabs")))
        .toBeVisible()
        .withTimeout(10000)

      // Simulate network disconnection
      await device.setURLBlacklist([".*"])

      // App should handle offline state
      await waitFor(element(by.id("offline-indicator")))
        .toBeVisible()
        .withTimeout(5000)

      // Restore network
      await device.clearURLBlacklist()

      // App should return to online state
      await waitFor(element(by.id("offline-indicator")))
        .not.toBeVisible()
        .withTimeout(5000)
    })
  })

  describe("Error Handling", () => {
    it("should handle invalid game codes gracefully", async () => {
      await device.launchApp({ newInstance: true })
      await waitFor(element(by.id("stop-screen")))
        .toBeVisible()
        .withTimeout(10000)

      await element(by.id("join-game-button")).tap()

      // Test various invalid codes
      const invalidCodes = ["123", "abc", "12345", "abcdefg"]

      for (const code of invalidCodes) {
        await element(by.id("game-code-input")).clearText()
        await element(by.id("game-code-input")).typeText(code)
        await element(by.id("join-game-button")).tap()

        // Should show appropriate error message
        await waitFor(element(by.id("error-message")))
          .toBeVisible()
          .withTimeout(3000)
      }
    })

    it("should handle network errors gracefully", async () => {
      await device.launchApp({ newInstance: true })
      await waitFor(element(by.id("main-tabs")))
        .toBeVisible()
        .withTimeout(10000)

      // Disable network
      await device.setURLBlacklist([".*"])

      // Try to create online game
      await element(by.id("online-mode-button")).tap()

      // Should show offline message
      await waitFor(element(by.id("offline-toast")))
        .toBeVisible()
        .withTimeout(3000)
    })
  })

  describe("Performance Tests", () => {
    it("should load app within acceptable time", async () => {
      const startTime = Date.now()

      await device.launchApp({ newInstance: true })
      await waitFor(element(by.id("main-tabs")))
        .toBeVisible()
        .withTimeout(10000)

      const loadTime = Date.now() - startTime

      // App should load within 10 seconds
      expect(loadTime).toBeLessThan(10000)
    })

    it("should handle rapid navigation without crashes", async () => {
      await device.launchApp({ newInstance: true })
      await waitFor(element(by.id("main-tabs")))
        .toBeVisible()
        .withTimeout(10000)

      // Rapidly switch between tabs
      for (let i = 0; i < 10; i++) {
        await element(by.id("ttt-tab")).tap()
        await element(by.id("stop-tab")).tap()
      }

      // App should still be responsive
      await expect(element(by.id("main-tabs"))).toBeVisible()
    })
  })
})
