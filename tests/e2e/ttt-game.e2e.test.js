const TestUtils = require("./utils/TestUtils")
const { TestData, TestDataHelpers } = require("./utils/TestData")

/**
 * Comprehensive Tic Tac Toe E2E Tests
 */
describe("Tic Tac Toe E2E Tests", () => {
  beforeAll(async () => {
    await TestUtils.launchApp()
    await TestUtils.waitForAppReady()
  })

  beforeEach(async () => {
    await TestUtils.reloadApp()
    await TestUtils.waitForAppReady()
    await TestUtils.navigateToTab("ttt")
  })

  afterEach(async () => {
    await TestUtils.cleanup()
  })

  describe("Game Mode Selection", () => {
    it("should display TTT game mode options", async () => {
      await TestUtils.expectElementToBeVisible("ttt-offline-mode-button")
    })

    it("should show correct descriptions for TTT modes", async () => {
      await TestUtils.expectElementToBeVisible("ttt-offline-mode-button")
    })
  })

  describe("Offline TTT Game", () => {
    beforeEach(async () => {
      await TestUtils.startOfflineTTTGame()
    })

    it("should start offline TTT game successfully", async () => {
      await TestUtils.expectElementToBeVisible("ttt-game-screen")
      await TestUtils.expectElementToBeVisible("ttt-game-board")
      await TestUtils.expectElementToBeVisible("current-player-display")
    })

    it("should display initial game state", async () => {
      // Check that all squares are empty initially
      for (let i = 0; i < 9; i++) {
        await TestUtils.expectElementToHaveText(`ttt-square-${i}`, "")
      }

      // Check that it's X's turn initially
      await TestUtils.expectElementToHaveText(
        "current-player-display",
        "X Turn"
      )
    })

    it("should handle basic game moves", async () => {
      // Make first move (X)
      await TestUtils.makeTTTMove(0)
      await TestUtils.expectElementToHaveText("ttt-square-0", "X")
      await TestUtils.expectElementToHaveText(
        "current-player-display",
        "O Turn"
      )

      // Make second move (O)
      await TestUtils.makeTTTMove(1)
      await TestUtils.expectElementToHaveText("ttt-square-1", "O")
      await TestUtils.expectElementToHaveText(
        "current-player-display",
        "X Turn"
      )

      // Make third move (X)
      await TestUtils.makeTTTMove(2)
      await TestUtils.expectElementToHaveText("ttt-square-2", "X")
      await TestUtils.expectElementToHaveText(
        "current-player-display",
        "O Turn"
      )
    })

    it("should prevent moves on occupied squares", async () => {
      // Make first move
      await TestUtils.makeTTTMove(0)
      await TestUtils.expectElementToHaveText("ttt-square-0", "X")

      // Try to make move on same square
      await TestUtils.makeTTTMove(0)

      // Square should still show X
      await TestUtils.expectElementToHaveText("ttt-square-0", "X")
      await TestUtils.expectElementToHaveText(
        "current-player-display",
        "O Turn"
      )
    })

    it("should handle game restart", async () => {
      // Make some moves
      await TestUtils.makeTTTMove(0)
      await TestUtils.makeTTTMove(1)
      await TestUtils.makeTTTMove(2)

      // Restart game
      await TestUtils.restartTTTGame()

      // Check that board is cleared
      for (let i = 0; i < 9; i++) {
        await TestUtils.expectElementToHaveText(`ttt-square-${i}`, "")
      }

      // Check that it's X's turn again
      await TestUtils.expectElementToHaveText(
        "current-player-display",
        "X Turn"
      )
    })

    it("should handle multiple game restarts", async () => {
      // Play multiple games
      for (let game = 0; game < 3; game++) {
        // Make some moves
        await TestUtils.makeTTTMove(0)
        await TestUtils.makeTTTMove(1)
        await TestUtils.makeTTTMove(2)

        // Restart
        await TestUtils.restartTTTGame()

        // Verify board is cleared
        await TestUtils.expectElementToHaveText("ttt-square-0", "")
        await TestUtils.expectElementToHaveText("ttt-square-1", "")
        await TestUtils.expectElementToHaveText("ttt-square-2", "")
      }
    })
  })

  describe("Winning Conditions", () => {
    beforeEach(async () => {
      await TestUtils.startOfflineTTTGame()
    })

    it("should detect X wins in top row", async () => {
      const moves = TestDataHelpers.createTTTWinningScenario(0, "X")

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Check for win
      await TestUtils.waitForElement("winner-display")
      await TestUtils.expectElementToHaveText("winner-display", "X Win")
    })

    it("should detect O wins in middle row", async () => {
      const moves = TestDataHelpers.createTTTWinningScenario(1, "O")

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Check for win
      await TestUtils.waitForElement("winner-display")
      await TestUtils.expectElementToHaveText("winner-display", "O Win")
    })

    it("should detect X wins in bottom row", async () => {
      const moves = TestDataHelpers.createTTTWinningScenario(2, "X")

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Check for win
      await TestUtils.waitForElement("winner-display")
      await TestUtils.expectElementToHaveText("winner-display", "X Win")
    })

    it("should detect O wins in left column", async () => {
      const moves = TestDataHelpers.createTTTWinningScenario(3, "O")

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Check for win
      await TestUtils.waitForElement("winner-display")
      await TestUtils.expectElementToHaveText("winner-display", "O Win")
    })

    it("should detect X wins in middle column", async () => {
      const moves = TestDataHelpers.createTTTWinningScenario(4, "X")

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Check for win
      await TestUtils.waitForElement("winner-display")
      await TestUtils.expectElementToHaveText("winner-display", "X Win")
    })

    it("should detect O wins in right column", async () => {
      const moves = TestDataHelpers.createTTTWinningScenario(5, "O")

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Check for win
      await TestUtils.waitForElement("winner-display")
      await TestUtils.expectElementToHaveText("winner-display", "O Win")
    })

    it("should detect X wins in diagonal", async () => {
      const moves = TestDataHelpers.createTTTWinningScenario(6, "X")

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Check for win
      await TestUtils.waitForElement("winner-display")
      await TestUtils.expectElementToHaveText("winner-display", "X Win")
    })

    it("should detect O wins in anti-diagonal", async () => {
      const moves = TestDataHelpers.createTTTWinningScenario(7, "O")

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Check for win
      await TestUtils.waitForElement("winner-display")
      await TestUtils.expectElementToHaveText("winner-display", "O Win")
    })

    it("should prevent moves after game ends", async () => {
      // Create winning scenario
      const moves = TestDataHelpers.createTTTWinningScenario(0, "X")

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Wait for win
      await TestUtils.waitForElement("winner-display")

      // Try to make additional move
      await TestUtils.makeTTTMove(3)

      // Square should remain empty
      await TestUtils.expectElementToHaveText("ttt-square-3", "")
    })
  })

  describe("Draw Conditions", () => {
    beforeEach(async () => {
      await TestUtils.startOfflineTTTGame()
    })

    it("should detect draw when board is full", async () => {
      const drawMoves = TestDataHelpers.createTTTDrawScenario()

      for (const move of drawMoves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Check for draw
      await TestUtils.waitForElement("winner-display")
      await TestUtils.expectElementToHaveText("winner-display", "Draw")
    })

    it("should handle draw scenario correctly", async () => {
      // Create draw scenario
      const moves = [
        { square: 0, player: "X" },
        { square: 1, player: "O" },
        { square: 2, player: "X" },
        { square: 3, player: "O" },
        { square: 5, player: "X" },
        { square: 4, player: "O" },
        { square: 6, player: "X" },
        { square: 8, player: "O" },
        { square: 7, player: "X" },
      ]

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Check for draw
      await TestUtils.waitForElement("winner-display")
      await TestUtils.expectElementToHaveText("winner-display", "Draw")
    })
  })

  describe("Game State Management", () => {
    beforeEach(async () => {
      await TestUtils.startOfflineTTTGame()
    })

    it("should maintain game state during app backgrounding", async () => {
      // Make some moves
      await TestUtils.makeTTTMove(0)
      await TestUtils.makeTTTMove(1)
      await TestUtils.makeTTTMove(2)

      // Background app
      await TestUtils.backgroundAndForegroundApp()

      // Game state should be maintained
      await TestUtils.waitForElement("ttt-game-screen")
      await TestUtils.expectElementToHaveText("ttt-square-0", "X")
      await TestUtils.expectElementToHaveText("ttt-square-1", "O")
      await TestUtils.expectElementToHaveText("ttt-square-2", "X")
    })

    it("should handle rapid moves", async () => {
      // Make rapid moves
      const moves = [0, 1, 2, 3, 4]

      for (const square of moves) {
        await TestUtils.makeTTTMove(square)
        await TestUtils.wait(50) // Small delay
      }

      // Verify moves were recorded
      await TestUtils.expectElementToHaveText("ttt-square-0", "X")
      await TestUtils.expectElementToHaveText("ttt-square-1", "O")
      await TestUtils.expectElementToHaveText("ttt-square-2", "X")
      await TestUtils.expectElementToHaveText("ttt-square-3", "O")
      await TestUtils.expectElementToHaveText("ttt-square-4", "X")
    })

    it("should handle multiple game sessions", async () => {
      // Play first game
      await TestUtils.makeTTTMove(0)
      await TestUtils.makeTTTMove(1)
      await TestUtils.makeTTTMove(2)
      await TestUtils.restartTTTGame()

      // Play second game
      await TestUtils.makeTTTMove(3)
      await TestUtils.makeTTTMove(4)
      await TestUtils.makeTTTMove(5)
      await TestUtils.restartTTTGame()

      // Play third game
      await TestUtils.makeTTTMove(6)
      await TestUtils.makeTTTMove(7)
      await TestUtils.makeTTTMove(8)

      // Verify final state
      await TestUtils.expectElementToHaveText("ttt-square-6", "X")
      await TestUtils.expectElementToHaveText("ttt-square-7", "O")
      await TestUtils.expectElementToHaveText("ttt-square-8", "X")
    })
  })

  describe("Performance Tests", () => {
    it("should load TTT game quickly", async () => {
      const loadTime = await TestUtils.measurePerformance(async () => {
        await TestUtils.startOfflineTTTGame()
      })

      expect(loadTime).toBeLessThan(TestData.PERFORMANCE.MAX_LOAD_TIME)
    })

    it("should handle rapid game restarts", async () => {
      await TestUtils.startOfflineTTTGame()

      // Rapidly restart games
      for (let i = 0; i < 10; i++) {
        await TestUtils.makeTTTMove(0)
        await TestUtils.restartTTTGame()
        await TestUtils.wait(100)
      }

      // Game should still be functional
      await TestUtils.expectElementToBeVisible("ttt-game-screen")
    })

    it("should handle stress testing", async () => {
      await TestUtils.startOfflineTTTGame()

      // Make many moves rapidly
      for (let i = 0; i < 50; i++) {
        const square = i % 9
        await TestUtils.makeTTTMove(square)
        await TestUtils.wait(10)
      }

      // Game should still be responsive
      await TestUtils.expectElementToBeVisible("ttt-game-screen")
    })
  })

  describe("Edge Cases", () => {
    beforeEach(async () => {
      await TestUtils.startOfflineTTTGame()
    })

    it("should handle simultaneous moves", async () => {
      // Try to make moves very quickly
      await TestUtils.makeTTTMove(0)
      await TestUtils.makeTTTMove(1)
      await TestUtils.makeTTTMove(2)

      // All moves should be recorded
      await TestUtils.expectElementToHaveText("ttt-square-0", "X")
      await TestUtils.expectElementToHaveText("ttt-square-1", "O")
      await TestUtils.expectElementToHaveText("ttt-square-2", "X")
    })

    it("should handle restart during game", async () => {
      // Make some moves
      await TestUtils.makeTTTMove(0)
      await TestUtils.makeTTTMove(1)

      // Restart mid-game
      await TestUtils.restartTTTGame()

      // Board should be cleared
      await TestUtils.expectElementToHaveText("ttt-square-0", "")
      await TestUtils.expectElementToHaveText("ttt-square-1", "")
    })

    it("should handle restart after win", async () => {
      // Create winning scenario
      const moves = TestDataHelpers.createTTTWinningScenario(0, "X")

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Wait for win
      await TestUtils.waitForElement("winner-display")

      // Restart game
      await TestUtils.restartTTTGame()

      // Board should be cleared and ready for new game
      await TestUtils.expectElementToHaveText("ttt-square-0", "")
      await TestUtils.expectElementToHaveText(
        "current-player-display",
        "X Turn"
      )
    })

    it("should handle restart after draw", async () => {
      // Create draw scenario
      const drawMoves = TestDataHelpers.createTTTDrawScenario()

      for (const move of drawMoves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Wait for draw
      await TestUtils.waitForElement("winner-display")

      // Restart game
      await TestUtils.restartTTTGame()

      // Board should be cleared and ready for new game
      await TestUtils.expectElementToHaveText("ttt-square-0", "")
      await TestUtils.expectElementToHaveText(
        "current-player-display",
        "X Turn"
      )
    })
  })

  describe("Visual Feedback", () => {
    beforeEach(async () => {
      await TestUtils.startOfflineTTTGame()
    })

    it("should provide visual feedback on square press", async () => {
      // Press square and check for visual feedback
      await TestUtils.makeTTTMove(0)

      // Square should show X
      await TestUtils.expectElementToHaveText("ttt-square-0", "X")
    })

    it("should update current player display", async () => {
      // Initial state
      await TestUtils.expectElementToHaveText(
        "current-player-display",
        "X Turn"
      )

      // After X move
      await TestUtils.makeTTTMove(0)
      await TestUtils.expectElementToHaveText(
        "current-player-display",
        "O Turn"
      )

      // After O move
      await TestUtils.makeTTTMove(1)
      await TestUtils.expectElementToHaveText(
        "current-player-display",
        "X Turn"
      )
    })

    it("should show winner display correctly", async () => {
      // Create winning scenario
      const moves = TestDataHelpers.createTTTWinningScenario(0, "X")

      for (const move of moves) {
        await TestUtils.makeTTTMove(move.square)
      }

      // Winner display should appear
      await TestUtils.waitForElement("winner-display")
      await TestUtils.expectElementToHaveText("winner-display", "X Win")
    })
  })
})
