const TestUtils = require("./utils/TestUtils")

/**
 * Test data and constants for Stop Trivia E2E tests
 */
const TestData = {
  // User data
  TEST_USER: {
    uid: "test-user-id",
    displayName: "Test User",
    email: "test@example.com",
    photoURL: null,
  },

  // Game codes
  VALID_GAME_CODE: "abcdef",
  INVALID_GAME_CODES: ["123", "abc", "12345", "abcdefg", "1234567"],

  // Stop game inputs
  SAMPLE_STOP_INPUTS: {
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
  },

  // TTT game data
  TTT_WINNING_COMBINATIONS: [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal
    [2, 4, 6], // Anti-diagonal
  ],

  // Timeouts
  TIMEOUTS: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 10000,
    VERY_LONG: 15000,
    LOAD_TIME: 10000,
  },

  // Points values
  POINTS_VALUES: [25, 50, 75, 100],

  // Game time options
  GAME_TIME_OPTIONS: [60, 180, 300], // 1min, 3min, 5min

  // Languages
  LANGUAGES: {
    ENGLISH: "en",
    SPANISH: "es",
  },

  // Test scenarios
  SCENARIOS: {
    STOP_GAME_COMPLETE_ROUND: {
      inputs: {
        name: "Alice",
        country: "Canada",
        animal: "Cat",
        food: "Burger",
        object: "Book",
      },
      expectedPoints: 250,
    },

    TTT_WIN_X: {
      moves: [
        { square: 0, player: "X" },
        { square: 3, player: "O" },
        { square: 1, player: "X" },
        { square: 4, player: "O" },
        { square: 2, player: "X" },
      ],
      winner: "X",
    },

    TTT_WIN_O: {
      moves: [
        { square: 0, player: "X" },
        { square: 3, player: "O" },
        { square: 1, player: "X" },
        { square: 4, player: "O" },
        { square: 6, player: "X" },
        { square: 5, player: "O" },
      ],
      winner: "O",
    },

    TTT_DRAW: {
      moves: [
        { square: 0, player: "X" },
        { square: 1, player: "O" },
        { square: 2, player: "X" },
        { square: 3, player: "O" },
        { square: 5, player: "X" },
        { square: 4, player: "O" },
        { square: 6, player: "X" },
        { square: 8, player: "O" },
        { square: 7, player: "X" },
      ],
      winner: "draw",
    },
  },

  // Error messages
  ERROR_MESSAGES: {
    INVALID_GAME_CODE: "Invalid game code",
    GAME_NOT_FOUND: "Game not found",
    GAME_FULL: "Game is full",
    GAME_STARTED: "Game has already started",
    OFFLINE: "You are offline",
    NOT_ALL_PLAYERS_READY: "Not all players are ready",
    YOU_ARE_ALONE: "You are alone",
  },

  // Performance thresholds
  PERFORMANCE: {
    MAX_LOAD_TIME: 10000, // 10 seconds
    MAX_NAVIGATION_TIME: 2000, // 2 seconds
    MAX_ANIMATION_TIME: 1000, // 1 second
  },

  // Network simulation
  NETWORK: {
    BLACKLIST_PATTERNS: [".*"],
    RESTORE_DELAY: 2000,
  },
}

/**
 * Helper functions for test data
 */
const TestDataHelpers = {
  /**
   * Generate random game code
   * @returns {string} Random 6-character code
   */
  generateRandomGameCode() {
    const chars = "abcdefghijklmnopqrstuvwxyz"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  /**
   * Get random Stop game inputs
   * @returns {Object} Random inputs object
   */
  getRandomStopInputs() {
    const names = ["Alice", "Bob", "Charlie", "Diana", "Eve"]
    const countries = ["USA", "Canada", "Mexico", "Brazil", "Argentina"]
    const colors = ["Red", "Blue", "Green", "Yellow", "Purple"]
    const animals = ["Dog", "Cat", "Bird", "Fish", "Rabbit"]
    const foods = ["Pizza", "Burger", "Pasta", "Salad", "Soup"]
    const fruits = ["Apple", "Banana", "Orange", "Grape", "Strawberry"]
    const objects = ["Phone", "Book", "Car", "House", "Computer"]
    const artists = ["Picasso", "Van Gogh", "Monet", "Da Vinci", "Dali"]
    const professions = ["Doctor", "Teacher", "Engineer", "Artist", "Chef"]

    return {
      name: names[Math.floor(Math.random() * names.length)],
      lastName: names[Math.floor(Math.random() * names.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      animal: animals[Math.floor(Math.random() * animals.length)],
      artist: artists[Math.floor(Math.random() * artists.length)],
      food: foods[Math.floor(Math.random() * foods.length)],
      fruit: fruits[Math.floor(Math.random() * fruits.length)],
      object: objects[Math.floor(Math.random() * objects.length)],
      profession: professions[Math.floor(Math.random() * professions.length)],
    }
  },

  /**
   * Create TTT winning scenario
   * @param {number} combinationIndex - Index of winning combination
   * @param {string} winner - 'X' or 'O'
   * @returns {Array} Array of moves
   */
  createTTTWinningScenario(combinationIndex = 0, winner = "X") {
    const combinations = TestData.TTT_WINNING_COMBINATIONS
    const combination = combinations[combinationIndex]
    const moves = []

    for (let i = 0; i < combination.length; i++) {
      moves.push({ square: combination[i], player: winner })

      // Add opponent move between winner moves (except for the last move)
      if (i < combination.length - 1) {
        const availableSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(
          (sq) => !combination.slice(0, i + 1).includes(sq)
        )
        if (availableSquares.length > 0) {
          const opponent = winner === "X" ? "O" : "X"
          moves.push({ square: availableSquares[0], player: opponent })
        }
      }
    }

    return moves
  },

  /**
   * Create TTT draw scenario
   * @returns {Array} Array of moves resulting in a draw
   */
  createTTTDrawScenario() {
    return TestData.SCENARIOS.TTT_DRAW.moves
  },

  /**
   * Get performance test scenarios
   * @returns {Array} Array of performance test scenarios
   */
  getPerformanceScenarios() {
    return [
      {
        name: "App Launch",
        operation: () => TestUtils.launchApp(),
        maxTime: TestData.PERFORMANCE.MAX_LOAD_TIME,
      },
      {
        name: "Tab Navigation",
        operation: async () => {
          await TestUtils.navigateToTab("ttt")
          await TestUtils.navigateToTab("stop")
        },
        maxTime: TestData.PERFORMANCE.MAX_NAVIGATION_TIME,
      },
      {
        name: "Settings Navigation",
        operation: () => TestUtils.navigateToSettings(),
        maxTime: TestData.PERFORMANCE.MAX_NAVIGATION_TIME,
      },
    ]
  },

  /**
   * Get error test scenarios
   * @returns {Array} Array of error test scenarios
   */
  getErrorScenarios() {
    return [
      {
        name: "Invalid Game Code Length",
        code: "123",
        expectedError: TestData.ERROR_MESSAGES.INVALID_GAME_CODE,
      },
      {
        name: "Invalid Game Code Characters",
        code: "123456",
        expectedError: TestData.ERROR_MESSAGES.INVALID_GAME_CODE,
      },
      {
        name: "Non-existent Game Code",
        code: "nonexist",
        expectedError: TestData.ERROR_MESSAGES.GAME_NOT_FOUND,
      },
    ]
  },
}

module.exports = {
  TestData,
  TestDataHelpers,
}
